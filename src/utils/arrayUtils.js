// =====================================================
// FILE: frontend/src/utils/arrayUtils.js
// DESKRIPSI: Array utilities
// =====================================================

/**
 * Check if array is empty
 */
export const isEmpty = (array) => {
  return !Array.isArray(array) || array.length === 0;
};

/**
 * Check if array is not empty
 */
export const isNotEmpty = (array) => {
  return Array.isArray(array) && array.length > 0;
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = (array, size) => {
  if (!Array.isArray(array) || size <= 0) return [];
  
  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }
    chunks[chunkIndex].push(item);
    return chunks;
  }, []);
};

/**
 * Flatten array
 */
export const flatten = (array) => {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

/**
 * Unique array
 */
export const unique = (array) => {
  return [...new Set(array)];
};

/**
 * Unique by key
 */
export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Sort array by multiple keys
 */
export const sortByMultiple = (array, keys) => {
  return [...array].sort((a, b) => {
    for (const { key, order = 'asc' } of keys) {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Filter array by search term
 */
export const filterBy = (array, term, keys = []) => {
  if (!term) return array;
  
  const searchTerm = term.toLowerCase();
  
  return array.filter(item => {
    if (keys.length === 0) {
      return JSON.stringify(item).toLowerCase().includes(searchTerm);
    }
    
    return keys.some(key => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(searchTerm);
    });
  });
};

/**
 * Paginate array
 */
export const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: array.slice(start, end),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNext: end < array.length,
      hasPrev: start > 0
    }
  };
};

/**
 * Get random item from array
 */
export const random = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Shuffle array
 */
export const shuffle = (array) => {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
};

/**
 * Take first n items
 */
export const take = (array, n = 1) => {
  return array.slice(0, n);
};

/**
 * Take last n items
 */
export const takeLast = (array, n = 1) => {
  return array.slice(-n);
};

/**
 * Take random n items
 */
export const takeRandom = (array, n = 1) => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, n);
};

/**
 * Remove item by index
 */
export const removeAt = (array, index) => {
  return array.filter((_, i) => i !== index);
};

/**
 * Remove item by value
 */
export const remove = (array, value) => {
  return array.filter(item => item !== value);
};

/**
 * Remove duplicates
 */
export const removeDuplicates = (array) => {
  return unique(array);
};

/**
 * Intersection of arrays
 */
export const intersection = (...arrays) => {
  return arrays.reduce((result, array) => {
    return result.filter(item => array.includes(item));
  });
};

/**
 * Union of arrays
 */
export const union = (...arrays) => {
  return unique(arrays.flat());
};

/**
 * Difference of arrays
 */
export const difference = (array1, array2) => {
  return array1.filter(item => !array2.includes(item));
};

/**
 * Symmetric difference
 */
export const symmetricDifference = (array1, array2) => {
  const diff1 = array1.filter(item => !array2.includes(item));
  const diff2 = array2.filter(item => !array1.includes(item));
  return [...diff1, ...diff2];
};

/**
 * Check if array contains all values
 */
export const containsAll = (array, values) => {
  return values.every(value => array.includes(value));
};

/**
 * Check if array contains any value
 */
export const containsAny = (array, values) => {
  return values.some(value => array.includes(value));
};

/**
 * Count occurrences
 */
export const countBy = (array, key) => {
  return array.reduce((count, item) => {
    const value = item[key];
    count[value] = (count[value] || 0) + 1;
    return count;
  }, {});
};

/**
 * Sum by key
 */
export const sumBy = (array, key) => {
  return array.reduce((sum, item) => sum + (item[key] || 0), 0);
};

/**
 * Average by key
 */
export const averageBy = (array, key) => {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
};

/**
 * Min by key
 */
export const minBy = (array, key) => {
  return array.reduce((min, item) => {
    return item[key] < min[key] ? item : min;
  }, array[0]);
};

/**
 * Max by key
 */
export const maxBy = (array, key) => {
  return array.reduce((max, item) => {
    return item[key] > max[key] ? item : max;
  }, array[0]);
};

/**
 * Zip arrays
 */
export const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  
  return Array.from({ length: maxLength }, (_, i) => {
    return arrays.map(arr => arr[i]);
  });
};

/**
 * Unzip array of pairs
 */
export const unzip = (array) => {
  return array.reduce(
    ([first, second], [a, b]) => {
      first.push(a);
      second.push(b);
      return [first, second];
    },
    [[], []]
  );
};

/**
 * Partition array by predicate
 */
export const partition = (array, predicate) => {
  return array.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []]
  );
};

/**
 * Split array by size
 */
export const split = (array, size) => {
  const result = [];
  
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  
  return result;
};

/**
 * Rotate array
 */
export const rotate = (array, n) => {
  const len = array.length;
  const shift = n % len;
  
  return [...array.slice(-shift), ...array.slice(0, -shift)];
};