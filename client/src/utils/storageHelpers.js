/**
 * Storage Helper Utilities for Form Data Persistence
 * Handles serialization, deserialization, and validation of localStorage data
 */

/**
 * Deep merge two objects, useful for restoring partial form data
 * @param {Object} target - Target object
 * @param {Object} source - Source object to merge from
 * @returns {Object} Merged object
 */
export const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object') return target;
  
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else if (Array.isArray(source[key])) {
        result[key] = [...source[key]];
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
};

/**
 * Serialize data for localStorage storage
 * @param {any} data - Data to serialize
 * @returns {string} JSON string
 */
export const serializeData = (data) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error serializing data for storage:', error);
    return '';
  }
};

/**
 * Deserialize data from localStorage
 * @param {string} jsonString - JSON string from localStorage
 * @returns {any} Parsed data or null if parsing fails
 */
export const deserializeData = (jsonString) => {
  try {
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error deserializing data from storage:', error);
    return null;
  }
};

/**
 * Check if form data has any meaningful content (not empty/null)
 * @param {Object} formData - Form data to check
 * @returns {boolean} True if form has data
 */
export const hasFormData = (formData) => {
  if (!formData || typeof formData !== 'object') return false;
  
  const checkValue = (val) => {
    if (val === null || val === undefined || val === '') return false;
    if (typeof val === 'boolean') return val;
    if (Array.isArray(val)) return val.length > 0 && val.some(checkValue);
    if (typeof val === 'object') return Object.values(val).some(checkValue);
    return true;
  };
  
  return checkValue(formData);
};

/**
 * Get size of object in approximate KB
 * @param {Object} obj - Object to measure
 * @returns {number} Size in KB
 */
export const getObjectSize = (obj) => {
  const jsonString = JSON.stringify(obj);
  return (jsonString.length / 1024).toFixed(2);
};

/**
 * Clear a specific key from localStorage with error handling
 * @param {string} key - Storage key to remove
 */
export const clearStorageKey = (key) => {
  try {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      return true;
    }
  } catch (error) {
    console.error(`Error clearing storage key "${key}":`, error);
  }
  return false;
};

/**
 * Load data from localStorage with validation
 * @param {string} key - Storage key
 * @returns {any} Stored data or null
 */
export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return deserializeData(data);
  } catch (error) {
    console.error(`Error loading data from storage key "${key}":`, error);
    return null;
  }
};

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 * @returns {boolean} Success status
 */
export const saveToStorage = (key, data) => {
  try {
    const serialized = serializeData(data);
    if (serialized) {
      localStorage.setItem(key, serialized);
      return true;
    }
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded:', error);
    } else {
      console.error(`Error saving data to storage key "${key}":`, error);
    }
  }
  return false;
};

/**
 * Get timestamp for save indicator
 * @returns {string} Formatted time string (e.g., "2:45 PM")
 */
export const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
