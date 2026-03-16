// =====================================================
// FILE: frontend/src/contexts/ModalContext.jsx
// DESKRIPSI: Modal context provider
// =====================================================

import React, { createContext, useState, useContext, useCallback } from 'react';
import { Modal } from '../components/atoms';

// Create context
const ModalContext = createContext(null);

// Custom hook to use modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Provider component
export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  // Open modal
  const openModal = useCallback(({ id, component, props = {}, options = {} }) => {
    const modalId = id || `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setModals(prev => [
      ...prev,
      {
        id: modalId,
        component,
        props,
        options: {
          size: 'md',
          closeOnClickOutside: true,
          closeOnEsc: true,
          ...options
        }
      }
    ]);

    return modalId;
  }, []);

  // Close modal
  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  // Close all modals
  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  // Update modal props
  const updateModal = useCallback((id, newProps) => {
    setModals(prev =>
      prev.map(modal =>
        modal.id === id
          ? { ...modal, props: { ...modal.props, ...newProps } }
          : modal
      )
    );
  }, []);

  // Confirm modal helper
  const confirm = useCallback(({
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin?',
    confirmText = 'Ya',
    cancelText = 'Batal',
    onConfirm,
    onCancel,
    variant = 'primary'
  }) => {
    const modalId = `confirm-${Date.now()}`;
    
    const handleConfirm = () => {
      closeModal(modalId);
      onConfirm?.();
    };

    const handleCancel = () => {
      closeModal(modalId);
      onCancel?.();
    };

    const ConfirmModal = () => (
      <Modal
        isOpen={true}
        onClose={handleCancel}
        title={title}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">{message}</p>
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 rounded-lg text-white ${
                variant === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </Modal>
    );

    openModal({
      id: modalId,
      component: ConfirmModal
    });

    return new Promise((resolve) => {
      // You can implement promise-based confirmation if needed
    });
  }, [openModal, closeModal]);

  // Alert modal helper
  const alert = useCallback(({
    title = 'Perhatian',
    message,
    buttonText = 'OK',
    onClose,
    variant = 'info'
  }) => {
    const modalId = `alert-${Date.now()}`;
    
    const handleClose = () => {
      closeModal(modalId);
      onClose?.();
    };

    const AlertModal = () => (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title={title}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">{message}</p>
          <button
            onClick={handleClose}
            className={`w-full px-4 py-2 rounded-lg text-white ${
              variant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700'
                : variant === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {buttonText}
          </button>
        </div>
      </Modal>
    );

    openModal({
      id: modalId,
      component: AlertModal
    });
  }, [openModal, closeModal]);

  // Prompt modal helper
  const prompt = useCallback(({
    title = 'Input',
    message,
    defaultValue = '',
    placeholder = '',
    confirmText = 'OK',
    cancelText = 'Batal',
    onConfirm,
    onCancel,
    validate
  }) => {
    const modalId = `prompt-${Date.now()}`;
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState('');

    const handleConfirm = () => {
      if (validate && !validate(value)) {
        setError('Input tidak valid');
        return;
      }
      closeModal(modalId);
      onConfirm?.(value);
    };

    const handleCancel = () => {
      closeModal(modalId);
      onCancel?.();
    };

    const PromptModal = () => (
      <Modal
        isOpen={true}
        onClose={handleCancel}
        title={title}
        size="sm"
      >
        <div className="space-y-4">
          {message && <p className="text-gray-600">{message}</p>}
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
              placeholder={placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </Modal>
    );

    openModal({
      id: modalId,
      component: PromptModal
    });
  }, [openModal, closeModal]);

  // Render modals
  const renderModals = () => {
    return modals.map(({ id, component: Component, props, options }) => (
      <Component key={id} {...props} modalOptions={options} />
    ));
  };

  // Context value
  const value = {
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
    confirm,
    alert,
    prompt
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {renderModals()}
    </ModalContext.Provider>
  );
};