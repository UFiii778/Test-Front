/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/FileUpload/FileUpload.jsx
// DESKRIPSI: File upload component
// =====================================================

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import { Button, Typography, Badge } from '../../atoms';

const FileUpload = ({
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onUpload,
  onRemove,
  value = [],
  disabled = false,
  className = '',
  ...props
}) => {
  const [files, setFiles] = useState(value);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  // Handle file selection via input
  const handleFileInput = (e) => {
    if (disabled) return;

    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  // Process files
  const handleFiles = async (newFiles) => {
    // Validate number of files
    if (!multiple && newFiles.length > 1) {
      alert('Hanya bisa upload 1 file');
      return;
    }

    if (multiple && files.length + newFiles.length > maxFiles) {
      alert(`Maksimal ${maxFiles} file`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const errors = [];

    for (const file of newFiles) {
      // Check file type
      const fileType = file.type;
      const acceptTypes = accept.split(',').map(type => type.trim());
      
      const isValidType = acceptTypes.some(type => {
        if (type.endsWith('/*')) {
          const mainType = type.split('/')[0];
          return fileType.startsWith(mainType);
        }
        return type === fileType;
      });

      if (!isValidType) {
        errors.push(`Tipe file ${file.name} tidak didukung`);
        continue;
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(`Ukuran file ${file.name} terlalu besar (maksimal ${maxSize / (1024 * 1024)}MB)`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    // Upload files
    setUploading(true);
    try {
      const uploadedFiles = await onUpload?.(validFiles) || validFiles;
      
      const newFileList = multiple 
        ? [...files, ...uploadedFiles]
        : uploadedFiles;
      
      setFiles(newFileList);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file
  const handleRemove = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onRemove?.(newFiles);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type?.startsWith('image/')) {
      return PhotoIcon;
    }
    return DocumentIcon;
  };

  return (
    <div className={className} {...props}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-200
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <CloudArrowUpIcon className={`
            w-12 h-12 mx-auto mb-4
            ${dragActive ? 'text-primary-600' : 'text-gray-400'}
          `} />
          
          <Typography variant="body1" weight="medium" className="mb-1">
            {dragActive ? 'Lepaskan file di sini' : 'Upload file'}
          </Typography>
          
          <Typography variant="body2" color="secondary" className="mb-2">
            Drag & drop atau klik untuk memilih file
          </Typography>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>Format: {accept.replace(/,/g, ', ')}</span>
            <span>•</span>
            <span>Maks: {maxSize / (1024 * 1024)}MB</span>
            {multiple && (
              <>
                <span>•</span>
                <span>Maks: {maxFiles} file</span>
              </>
            )}
          </div>
        </div>

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              const isImage = file.type?.startsWith('image/');
              const fileUrl = file.url || (file instanceof File ? URL.createObjectURL(file) : null);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  {/* Preview for images */}
                  {isImage && fileUrl ? (
                    <img
                      src={fileUrl}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}

                  {/* File info */}
                  <div className="flex-1 ml-3 min-w-0">
                    <Typography variant="body2" className="truncate">
                      {file.name}
                    </Typography>
                    <div className="flex items-center space-x-2">
                      <Typography variant="caption" color="secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                      {file.status === 'uploaded' && (
                        <Badge size="sm" variant="success" icon={CheckCircleIcon}>
                          Terupload
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(index)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FileUpload.propTypes = {
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  maxFiles: PropTypes.number,
  onUpload: PropTypes.func,
  onRemove: PropTypes.func,
  value: PropTypes.array,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default FileUpload;