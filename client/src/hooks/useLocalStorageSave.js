import { useState, useEffect, useRef } from 'react';
import { 
  loadFromStorage, 
  saveToStorage, 
  clearStorageKey, 
  getFormattedTime 
} from '../utils/storageHelpers';

/**
 * Custom hook for auto-save functionality with debouncing
 * Automatically saves form data to localStorage with a 500ms debounce
 * 
 * @param {string} storageKey - localStorage key for storing data
 * @param {any} initialData - Initial data structure
 * @returns {Object} Object with save methods and state tracking
 */
export default function useLocalStorageSave(storageKey, initialData) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs to track debounce timer and last saved state
  const debounceTimerRef = useRef(null);
  const lastSaveDataRef = useRef(null);

  /**
   * Load data from localStorage on component mount
   */
  const loadData = () => {
    try {
      const loaded = loadFromStorage(storageKey);
      if (loaded) {
        setSavedData(loaded);
        lastSaveDataRef.current = loaded;
      }
      return loaded;
    } catch (error) {
      console.error(`Error loading data from localStorage key "${storageKey}":`, error);
      return null;
    }
  };

  /**
   * Clear all saved data for this form from localStorage
   */
  const clearData = () => {
    try {
      clearStorageKey(storageKey);
      setSavedData(null);
      setLastSaveTime(null);
      setHasUnsavedChanges(false);
      lastSaveDataRef.current = null;
    } catch (error) {
      console.error(`Error clearing localStorage key "${storageKey}":`, error);
    }
  };

  /**
   * Check if current data differs from last saved data
   */
  const isDataChanged = (currentData) => {
    if (!lastSaveDataRef.current) return true;
    return JSON.stringify(currentData) !== JSON.stringify(lastSaveDataRef.current);
  };

  /**
   * Save data immediately to localStorage (bypassing debounce)
   */
  const saveNow = (dataToSave) => {
    try {
      if (!dataToSave) return;

      setIsSaving(true);

      // Save to localStorage
      const success = saveToStorage(storageKey, dataToSave);

      if (success) {
        lastSaveDataRef.current = JSON.parse(JSON.stringify(dataToSave));
        setSavedData(dataToSave);
        setLastSaveTime(getFormattedTime());
        setHasUnsavedChanges(false);
      }

      setIsSaving(false);
    } catch (error) {
      console.error(`Error saving data to localStorage key "${storageKey}":`, error);
      setIsSaving(false);
    }
  };

  /**
   * Auto-save with debounce (500ms delay)
   * Prevents excessive localStorage writes
   */
  const autoSave = (dataToSave) => {
    try {
      // Mark as having unsaved changes
      if (isDataChanged(dataToSave)) {
        setHasUnsavedChanges(true);
      }

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      setIsSaving(true);
      debounceTimerRef.current = setTimeout(() => {
        saveNow(dataToSave);
      }, 500);
    } catch (error) {
      console.error('Error in autoSave:', error);
      setIsSaving(false);
    }
  };

  /**
   * Cleanup debounce timer on component unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    autoSave,
    saveNow,
    loadData,
    clearData,
    savedData,
    lastSaveTime,
    isSaving,
    hasUnsavedChanges,
  };
}
