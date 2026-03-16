// =====================================================
// FILE: frontend/src/contexts/ConfirmContext.jsx
// DESKRIPSI: Confirm dialog context provider
// =====================================================

import React, { createContext, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/atoms';

// Create context
const ConfirmContext = createContext(null);

// Custom hook to use confirm context
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

// Confirm dialog component
const ConfirmDialog = ({ isOpen, options, onConfirm, onCancel }) => {
  const {
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin?',
    confirmText = 'Ya',
    cancelText = 'Batal',
    variant = 'primary',
    icon: Icon,
    confirmButtonVariant = 'primary',
    cancelButtonVariant = 'outline',
    size = 'md'
  } = options;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getIcon = () => {
    if (Icon) return Icon;
    
    switch (variant) {
      case 'danger':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`${sizeClasses[size]} w-full rounded-2xl shadow-2xl border overflow-hidden ${getVariantClasses()}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex space-x-2">
              <Button
                variant={cancelButtonVariant}
                onClick={onCancel}
                fullWidth
              >
                {cancelText}
              </Button>
              <Button
                variant={confirmButtonVariant}
                onClick={onConfirm}
                fullWidth
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Provider component
export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    options: {},
    resolve: null,
    reject: null
  });

  // Show confirm dialog
  const confirm = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      setDialog({
        isOpen: true,
        options,
        resolve,
        reject
      });
    });
  }, []);

  // Handle confirm
  const handleConfirm = useCallback(() => {
    dialog.resolve?.(true);
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, [dialog]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    dialog.resolve?.(false);
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, [dialog]);

  // Danger confirm helper
  const confirmDanger = useCallback((message, title = 'Konfirmasi Hapus') => {
    return confirm({
      title,
      message,
      variant: 'danger',
      confirmText: 'Hapus',
      confirmButtonVariant: 'danger',
      cancelText: 'Batal'
    });
  }, [confirm]);

  // Warning confirm helper
  const confirmWarning = useCallback((message, title = 'Perhatian') => {
    return confirm({
      title,
      message,
      variant: 'warning',
      confirmText: 'Ya',
      confirmButtonVariant: 'warning',
      cancelText: 'Tidak'
    });
  }, [confirm]);

  // Success confirm helper
  const confirmSuccess = useCallback((message, title = 'Konfirmasi') => {
    return confirm({
      title,
      message,
      variant: 'success',
      confirmText: 'OK',
      confirmButtonVariant: 'success',
      cancelText: 'Batal'
    });
  }, [confirm]);

  // Context value
  const value = {
    confirm,
    confirmDanger,
    confirmWarning,
    confirmSuccess
  };

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        options={dialog.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};