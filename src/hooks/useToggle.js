// =====================================================
// FILE: frontend/src/hooks/useToggle.js
// DESKRIPSI: Toggle hook
// =====================================================

import { useState, useCallback } from 'react';

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return [state, { toggle, setTrue, setFalse, set: setState }];
};

// Multiple toggles hook
export const useMultiToggle = (initialState = {}) => {
  const [states, setStates] = useState(initialState);

  const toggle = useCallback((key) => {
    setStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const setTrue = useCallback((key) => {
    setStates(prev => ({
      ...prev,
      [key]: true
    }));
  }, []);

  const setFalse = useCallback((key) => {
    setStates(prev => ({
      ...prev,
      [key]: false
    }));
  }, []);

  const setAll = useCallback((value) => {
    const newStates = {};
    Object.keys(states).forEach(key => {
      newStates[key] = value;
    });
    setStates(newStates);
  }, [states]);

  const reset = useCallback(() => {
    setStates(initialState);
  }, [initialState]);

  return [states, { toggle, setTrue, setFalse, setAll, reset, set: setStates }];
};

// Accordion hook
export const useAccordion = (initialOpen = null) => {
  const [openItem, setOpenItem] = useState(initialOpen);

  const toggleItem = useCallback((itemId) => {
    setOpenItem(prev => prev === itemId ? null : itemId);
  }, []);

  const isOpen = useCallback((itemId) => {
    return openItem === itemId;
  }, [openItem]);

  return { openItem, toggleItem, isOpen };
};

// Menu hook
export const useMenu = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = useCallback((event) => {
    setAnchorEl(event?.currentTarget || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setAnchorEl(null);
    setIsOpen(false);
  }, []);

  const toggle = useCallback((event) => {
    if (isOpen) {
      close();
    } else {
      open(event);
    }
  }, [isOpen, open, close]);

  return { isOpen, anchorEl, open, close, toggle };
};

// Tab hook
export const useTab = (initialTab = 0) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab = useCallback((index) => {
    setActiveTab(index);
  }, []);

  return { activeTab, changeTab };
};

// Step hook (wizard)
export const useStep = (initialStep = 0, totalSteps = 1) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((step) => {
    setCurrentStep(Math.min(Math.max(step, 0), totalSteps - 1));
  }, [totalSteps]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return { currentStep, next, prev, goTo, reset, isFirst, isLast };
};