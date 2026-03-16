// =====================================================
// FILE: frontend/src/hooks/useModal.js
// DESKRIPSI: Modal hook
// =====================================================

import { useContext, useCallback } from 'react';
import { ModalContext } from '../contexts/ModalContext';

export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
};

// Convenience hooks
export const useOpenModal = () => {
  const { openModal } = useModal();
  return openModal;
};

export const useCloseModal = () => {
  const { closeModal } = useModal();
  return closeModal;
};

export const useCloseAllModals = () => {
  const { closeAllModals } = useModal();
  return closeAllModals;
};

export const useUpdateModal = () => {
  const { updateModal } = useModal();
  return updateModal;
};

// Specialized modal hooks
export const useConfirm = () => {
  const { confirm } = useModal();
  return confirm;
};

export const useConfirmDanger = () => {
  const { confirmDanger } = useModal();
  return confirmDanger;
};

export const useConfirmWarning = () => {
  const { confirmWarning } = useModal();
  return confirmWarning;
};

export const useConfirmSuccess = () => {
  const { confirmSuccess } = useModal();
  return confirmSuccess;
};

export const useAlert = () => {
  const { alert } = useModal();
  return alert;
};

export const usePrompt = () => {
  const { prompt } = useModal();
  return prompt;
};

// Form modal helper
export const useFormModal = (FormComponent, onSubmit, options = {}) => {
  const { openModal, closeModal } = useModal();

  const openFormModal = useCallback((initialData = {}) => {
    const modalId = `form-${Date.now()}`;

    const handleSubmit = async (data) => {
      const result = await onSubmit(data);
      if (result !== false) {
        closeModal(modalId);
      }
      return result;
    };

    openModal({
      id: modalId,
      component: FormComponent,
      props: {
        initialData,
        onSubmit: handleSubmit,
        onCancel: () => closeModal(modalId)
      },
      options: {
        size: 'lg',
        ...options
      }
    });

    return modalId;
  }, [FormComponent, onSubmit, openModal, closeModal, options]);

  return openFormModal;
};

// Detail modal helper
export const useDetailModal = (DetailComponent, options = {}) => {
  const { openModal, closeModal } = useModal();

  const openDetailModal = useCallback((data) => {
    const modalId = `detail-${Date.now()}`;

    openModal({
      id: modalId,
      component: DetailComponent,
      props: {
        data,
        onClose: () => closeModal(modalId)
      },
      options: {
        size: 'md',
        ...options
      }
    });

    return modalId;
  }, [DetailComponent, openModal, closeModal, options]);

  return openDetailModal;
};