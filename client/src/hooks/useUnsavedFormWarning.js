/**
 * useUnsavedFormWarning Hook
 * Warns user before leaving page if there is unsaved form data
 * Attaches to window beforeunload event
 */

import { useEffect } from 'react';

/**
 * Hook that warns user before navigating away with unsaved changes
 * @param {boolean} hasUnsavedData - Whether form has unsaved changes
 * @param {string} formName - Name of form for warning message (optional)
 */
export const useUnsavedFormWarning = (hasUnsavedData, formName = 'form') => {
  useEffect(() => {
    if (!hasUnsavedData) {
      // Remove warning if no unsaved data
      window.onbeforeunload = null;
      return;
    }

    // Define beforeunload handler
    const handleBeforeUnload = (event) => {
      // Standard message (browsers may override with their own)
      const message = `You have unsaved changes in your ${formName}. Are you sure you want to leave?`;
      
      // For modern browsers, we need to set returnValue
      event.preventDefault();
      event.returnValue = message;
      
      // Some older browsers require returning the message
      return message;
    };

    // Attach the warning
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup: remove warning on unmount or when data is saved
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedData, formName]);
};

export default useUnsavedFormWarning;
