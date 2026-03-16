// =====================================================
// FILE: frontend/src/hooks/useForm.js
// DESKRIPSI: Form handling hook
// =====================================================

import { useState, useEffect, useCallback, useMemo } from 'react';

export const useForm = (initialValues = {}, validationRules = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Validate on values change
  useEffect(() => {
    validateForm();
  }, [values]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldRules = validationRules[fieldName];
      const fieldValue = values[fieldName];

      if (fieldRules) {
        // Required validation
        if (fieldRules.required && (!fieldValue || fieldValue.toString().trim() === '')) {
          newErrors[fieldName] = fieldRules.requiredMessage || 'Field ini wajib diisi';
          formIsValid = false;
        }

        // Min length validation
        if (fieldRules.minLength && fieldValue && fieldValue.length < fieldRules.minLength) {
          newErrors[fieldName] = fieldRules.minLengthMessage || `Minimal ${fieldRules.minLength} karakter`;
          formIsValid = false;
        }

        // Max length validation
        if (fieldRules.maxLength && fieldValue && fieldValue.length > fieldRules.maxLength) {
          newErrors[fieldName] = fieldRules.maxLengthMessage || `Maksimal ${fieldRules.maxLength} karakter`;
          formIsValid = false;
        }

        // Pattern validation
        if (fieldRules.pattern && fieldValue && !fieldRules.pattern.test(fieldValue)) {
          newErrors[fieldName] = fieldRules.patternMessage || 'Format tidak valid';
          formIsValid = false;
        }

        // Custom validation
        if (fieldRules.validate && fieldValue) {
          const customError = fieldRules.validate(fieldValue, values);
          if (customError) {
            newErrors[fieldName] = customError;
            formIsValid = false;
          }
        }

        // Email validation
        if (fieldRules.email && fieldValue) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(fieldValue)) {
            newErrors[fieldName] = fieldRules.emailMessage || 'Format email tidak valid';
            formIsValid = false;
          }
        }

        // Phone validation
        if (fieldRules.phone && fieldValue) {
          const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
          if (!phoneRegex.test(fieldValue)) {
            newErrors[fieldName] = fieldRules.phoneMessage || 'Format nomor telepon tidak valid';
            formIsValid = false;
          }
        }

        // Number validation
        if (fieldRules.number && fieldValue) {
          if (isNaN(fieldValue)) {
            newErrors[fieldName] = fieldRules.numberMessage || 'Harus berupa angka';
            formIsValid = false;
          } else {
            const num = parseFloat(fieldValue);
            
            if (fieldRules.min !== undefined && num < fieldRules.min) {
              newErrors[fieldName] = fieldRules.minMessage || `Minimal ${fieldRules.min}`;
              formIsValid = false;
            }
            
            if (fieldRules.max !== undefined && num > fieldRules.max) {
              newErrors[fieldName] = fieldRules.maxMessage || `Maksimal ${fieldRules.max}`;
              formIsValid = false;
            }
          }
        }
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validationRules]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files : value
    }));
  }, []);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Set field value
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set field error
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Handle submit
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    setSubmitCount(prev => prev + 1);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const formIsValid = validateForm();

    if (formIsValid && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors(prev => ({ ...prev, form: error.message }));
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Clear form
  const clearForm = useCallback(() => {
    const emptyValues = {};
    Object.keys(initialValues).forEach(key => {
      emptyValues[key] = '';
    });
    setValues(emptyValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Get field props
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] && errors[name] ? errors[name] : '',
    touched: touched[name]
  }), [values, errors, touched, handleChange, handleBlur]);

  // Get field helpers
  const getFieldHelpers = useCallback((name) => ({
    setValue: (value) => setFieldValue(name, value),
    setError: (error) => setFieldError(name, error),
    clearError: () => clearFieldError(name),
    isTouched: touched[name],
    hasError: !!errors[name],
    error: errors[name]
  }), [name, touched, errors, setFieldValue, setFieldError, clearFieldError]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearFieldError,
    resetForm,
    clearForm,
    getFieldProps,
    getFieldHelpers
  };
};

// Form with steps/wizard
export const useFormWizard = (steps, initialValues = {}, onSubmit = null) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialValues);
  const [completedSteps, setCompletedSteps] = useState([]);

  const currentStepConfig = steps[currentStep];

  const form = useForm(
    formData,
    currentStepConfig?.validation || {},
    async (data) => {
      // Update form data
      setFormData(prev => ({ ...prev, ...data }));

      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }

      // Check if this is the last step
      if (currentStep === steps.length - 1) {
        if (onSubmit) {
          await onSubmit({ ...formData, ...data });
        }
      } else {
        // Move to next step
        setCurrentStep(prev => prev + 1);
      }
    }
  );

  const goToStep = useCallback((step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const isStepCompleted = useCallback((step) => {
    return completedSteps.includes(step);
  }, [completedSteps]);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return {
    ...form,
    currentStep,
    currentStepConfig,
    steps,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isStepCompleted,
    isLastStep,
    isFirstStep,
    progress: ((currentStep + 1) / steps.length) * 100
  };
};

// Form with array fields
export const useFormArray = (name, initialValues = []) => {
  const [items, setItems] = useState(initialValues);

  const push = useCallback((value) => {
    setItems(prev => [...prev, value]);
  }, []);

  const pop = useCallback(() => {
    setItems(prev => prev.slice(0, -1));
  }, []);

  const remove = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const insert = useCallback((index, value) => {
    setItems(prev => [...prev.slice(0, index), value, ...prev.slice(index)]);
  }, []);

  const move = useCallback((fromIndex, toIndex) => {
    setItems(prev => {
      const newItems = [...prev];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return newItems;
    });
  }, []);

  const swap = useCallback((indexA, indexB) => {
    setItems(prev => {
      const newItems = [...prev];
      [newItems[indexA], newItems[indexB]] = [newItems[indexB], newItems[indexA]];
      return newItems;
    });
  }, []);

  const update = useCallback((index, value) => {
    setItems(prev => prev.map((item, i) => i === index ? value : item));
  }, []);

  const replace = useCallback((newItems) => {
    setItems(newItems);
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    length: items.length,
    push,
    pop,
    remove,
    insert,
    move,
    swap,
    update,
    replace,
    clear
  };
};