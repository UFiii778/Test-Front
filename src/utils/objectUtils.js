// =====================================================
// FILE: frontend/src/utils/objectUtils.js
// DESKRIPSI: Object utilities
// =====================================================

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Check if object is not empty
 */
export const isNotEmpty = (obj) => {
  return obj && Object.keys(obj).length > 0;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Deep merge objects
 */
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key]) && isObject(target[key])) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  
  return output;
};

/**
 * Check if value is object
 */
export const isObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Pick specific keys from object
 */
export const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/**
 * Omit specific keys from object
 */
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

/**
 * Get nested value using path
 */
export const get = (obj, path, defaultValue = undefined) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || !result.hasOwnProperty(key)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result;
};

/**
 * Set nested value using path
 */
export const set = (obj, path, value) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  
  return result;
};

/**
 * Flatten object
 */
export const flatten = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flatten(obj[key], `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    
    return acc;
  }, {});
};

/**
 * Unflatten object
 */
export const unflatten = (obj) => {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return result;
};

/**
 * Map object values
 */
export const mapValues = (obj, fn) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = fn(value, key);
    return acc;
  }, {});
};

/**
 * Map object keys
 */
export const mapKeys = (obj, fn) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[fn(key, value)] = value;
    return acc;
  }, {});
};

/**
 * Filter object
 */
export const filter = (obj, predicate) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (predicate(value, key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * Invert object (swap keys and values)
 */
export const invert = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
};

/**
 * Compare two objects
 */
export const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Compare objects deeply
 */
export const isDeepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
};

/**
 * Get object size
 */
export const size = (obj) => {
  return Object.keys(obj).length;
};

/**
 * Get object values
 */
export const values = (obj) => {
  return Object.values(obj);
};

/**
 * Get object keys
 */
export const keys = (obj) => {
  return Object.keys(obj);
};

/**
 * Get object entries
 */
export const entries = (obj) => {
  return Object.entries(obj);
};

/**
 * Merge objects
 */
export const merge = (...objects) => {
  return objects.reduce((result, obj) => {
    return { ...result, ...obj };
  }, {});
};

/**
 * Merge objects deeply
 */
export const mergeDeep = (...objects) => {
  return objects.reduce((result, obj) => {
    return deepMerge(result, obj);
  }, {});
};

/**
 * Freeze object
 */
export const freeze = (obj) => {
  return Object.freeze(obj);
};

/**
 * Seal object
 */
export const seal = (obj) => {
  return Object.seal(obj);
};

/**
 * Check if object has key
 */
export const hasKey = (obj, key) => {
  return obj.hasOwnProperty(key);
};

/**
 * Check if object has value
 */
export const hasValue = (obj, value) => {
  return Object.values(obj).includes(value);
};

/**
 * Rename key
 */
export const renameKey = (obj, oldKey, newKey) => {
  if (!obj.hasOwnProperty(oldKey)) return obj;
  
  const { [oldKey]: value, ...rest } = obj;
  return { ...rest, [newKey]: value };
};

/**
 * Sort object keys
 */
export const sortKeys = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

/**
 * Sort object by keys
 */
export const sortByKeys = (obj, comparator) => {
  return Object.keys(obj)
    .sort(comparator)
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

/**
 * Sort object by values
 */
export const sortByValues = (obj, comparator) => {
  return Object.entries(obj)
    .sort(([, a], [, b]) => comparator(a, b))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};