// =====================================================
// FILE: frontend/src/utils/domUtils.js
// DESKRIPSI: DOM utilities
// =====================================================

/**
 * Get element by ID
 */
export const getElement = (id) => {
  return document.getElementById(id);
};

/**
 * Get elements by class name
 */
export const getElementsByClass = (className) => {
  return document.getElementsByClassName(className);
};

/**
 * Get elements by tag name
 */
export const getElementsByTag = (tagName) => {
  return document.getElementsByTagName(tagName);
};

/**
 * Query selector
 */
export const query = (selector) => {
  return document.querySelector(selector);
};

/**
 * Query selector all
 */
export const queryAll = (selector) => {
  return document.querySelectorAll(selector);
};

/**
 * Add class to element
 */
export const addClass = (element, className) => {
  if (element && element.classList) {
    element.classList.add(className);
  }
};

/**
 * Remove class from element
 */
export const removeClass = (element, className) => {
  if (element && element.classList) {
    element.classList.remove(className);
  }
};

/**
 * Toggle class on element
 */
export const toggleClass = (element, className) => {
  if (element && element.classList) {
    element.classList.toggle(className);
  }
};

/**
 * Check if element has class
 */
export const hasClass = (element, className) => {
  if (element && element.classList) {
    return element.classList.contains(className);
  }
  return false;
};

/**
 * Set attribute
 */
export const setAttribute = (element, name, value) => {
  if (element) {
    element.setAttribute(name, value);
  }
};

/**
 * Get attribute
 */
export const getAttribute = (element, name) => {
  if (element) {
    return element.getAttribute(name);
  }
  return null;
};

/**
 * Remove attribute
 */
export const removeAttribute = (element, name) => {
  if (element) {
    element.removeAttribute(name);
  }
};

/**
 * Set style
 */
export const setStyle = (element, property, value) => {
  if (element && element.style) {
    element.style[property] = value;
  }
};

/**
 * Get style
 */
export const getStyle = (element, property) => {
  if (element && element.style) {
    return element.style[property];
  }
  return null;
};

/**
 * Add event listener
 */
export const addEvent = (element, event, handler, options = false) => {
  if (element) {
    element.addEventListener(event, handler, options);
  }
};

/**
 * Remove event listener
 */
export const removeEvent = (element, event, handler, options = false) => {
  if (element) {
    element.removeEventListener(event, handler, options);
  }
};

/**
 * Trigger event
 */
export const triggerEvent = (element, eventName) => {
  if (element) {
    const event = new Event(eventName, { bubbles: true });
    element.dispatchEvent(event);
  }
};

/**
 * Create element
 */
export const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
};

/**
 * Remove element
 */
export const removeElement = (element) => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

/**
 * Empty element
 */
export const emptyElement = (element) => {
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
};

/**
 * Get element position
 */
export const getPosition = (element) => {
  if (!element) return { top: 0, left: 0 };
  
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    right: rect.right + window.scrollX,
    width: rect.width,
    height: rect.height
  };
};

/**
 * Check if element is visible
 */
export const isVisible = (element) => {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
};

/**
 * Scroll to element
 */
export const scrollToElement = (element, options = {}) => {
  if (element) {
    element.scrollIntoView({
      behavior: options.behavior || 'smooth',
      block: options.block || 'start',
      inline: options.inline || 'nearest'
    });
  }
};

/**
 * Get document height
 */
export const getDocumentHeight = () => {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
};

/**
 * Get document width
 */
export const getDocumentWidth = () => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.body.clientWidth,
    document.documentElement.clientWidth
  );
};

/**
 * Get scroll position
 */
export const getScrollPosition = () => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
};

/**
 * Lock body scroll
 */
export const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

/**
 * Unlock body scroll
 */
export const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = (text) => {
  return navigator.clipboard?.writeText(text);
};

/**
 * Focus element
 */
export const focusElement = (element) => {
  if (element) {
    element.focus();
  }
};

/**
 * Blur element
 */
export const blurElement = (element) => {
  if (element) {
    element.blur();
  }
};

/**
 * Select all text in input
 */
export const selectAllText = (input) => {
  if (input) {
    input.select();
  }
};

/**
 * Get caret position in input
 */
export const getCaretPosition = (input) => {
  return input?.selectionStart || 0;
};

/**
 * Set caret position in input
 */
export const setCaretPosition = (input, position) => {
  if (input) {
    input.setSelectionRange(position, position);
  }
};

/**
 * Insert text at caret position
 */
export const insertAtCaret = (input, text) => {
  if (!input) return;
  
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const value = input.value;
  
  input.value = value.substring(0, start) + text + value.substring(end);
  input.setSelectionRange(start + text.length, start + text.length);
};