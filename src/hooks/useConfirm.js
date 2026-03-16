// =====================================================
// FILE: frontend/src/hooks/useConfirm.js
// DESKRIPSI: Confirm hook
// =====================================================

import { useContext, useCallback } from 'react';
import { ConfirmContext } from '../contexts/ConfirmContext';

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  
  return context;
};

// Convenience hooks
export const useConfirmDialog = () => {
  const { confirm } = useConfirm();
  return confirm;
};

export const useConfirmDanger = () => {
  const { confirmDanger } = useConfirm();
  return confirmDanger;
};

export const useConfirmWarning = () => {
  const { confirmWarning } = useConfirm();
  return confirmWarning;
};

export const useConfirmSuccess = () => {
  const { confirmSuccess } = useConfirm();
  return confirmSuccess;
};

// Specialized confirm hooks
export const useDeleteConfirm = (onConfirm, options = {}) => {
  const { confirmDanger } = useConfirm();

  const handleDelete = useCallback(async (item) => {
    const confirmed = await confirmDanger(
      options.message || `Apakah Anda yakin ingin menghapus ${item?.name || 'item ini'}?`,
      options.title || 'Konfirmasi Hapus'
    );

    if (confirmed) {
      await onConfirm(item);
    }
  }, [onConfirm, confirmDanger, options]);

  return handleDelete;
};

export const useCancelConfirm = (onConfirm, options = {}) => {
  const { confirmWarning } = useConfirm();

  const handleCancel = useCallback(async (item) => {
    const confirmed = await confirmWarning(
      options.message || `Apakah Anda yakin ingin membatalkan ${item?.name || 'aksi ini'}?`,
      options.title || 'Konfirmasi Pembatalan'
    );

    if (confirmed) {
      await onConfirm(item);
    }
  }, [onConfirm, confirmWarning, options]);

  return handleCancel;
};

export const useSaveConfirm = (onConfirm, options = {}) => {
  const { confirmSuccess } = useConfirm();

  const handleSave = useCallback(async (data) => {
    const confirmed = await confirmSuccess(
      options.message || 'Apakah Anda yakin ingin menyimpan data ini?',
      options.title || 'Konfirmasi Simpan'
    );

    if (confirmed) {
      await onConfirm(data);
    }
  }, [onConfirm, confirmSuccess, options]);

  return handleSave;
};

// Form dirty confirm hook
export const useFormDirtyConfirm = (isDirty, onLeave) => {
  const { confirmWarning } = useConfirm();

  const handleLeave = useCallback(async () => {
    if (isDirty) {
      const confirmed = await confirmWarning(
        'Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman ini?',
        'Perubahan Belum Disimpan'
      );

      if (confirmed) {
        onLeave?.();
      }
      return confirmed;
    }
    
    onLeave?.();
    return true;
  }, [isDirty, onLeave, confirmWarning]);

  return handleLeave;
};