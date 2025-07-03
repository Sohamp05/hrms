/**
 * Utility to manage authentication state and prevent stuck loading states
 */

const AUTH_STATE_KEY = "hrms_auth_loading_state";
const AUTH_STATE_TIMESTAMP_KEY = "hrms_auth_loading_timestamp";
const MAX_LOADING_DURATION = 60000; // 1 minute

export const setAuthLoadingState = (isLoading, userType = "admin") => {
  const key = `${AUTH_STATE_KEY}_${userType}`;
  const timestampKey = `${AUTH_STATE_TIMESTAMP_KEY}_${userType}`;

  if (isLoading) {
    localStorage.setItem(key, "true");
    localStorage.setItem(timestampKey, Date.now().toString());
  } else {
    localStorage.removeItem(key);
    localStorage.removeItem(timestampKey);
  }
};

export const getAuthLoadingState = (userType = "admin") => {
  const key = `${AUTH_STATE_KEY}_${userType}`;
  const timestampKey = `${AUTH_STATE_TIMESTAMP_KEY}_${userType}`;

  const isLoading = localStorage.getItem(key) === "true";
  const timestamp = localStorage.getItem(timestampKey);

  if (isLoading && timestamp) {
    const timeDiff = Date.now() - parseInt(timestamp);
    if (timeDiff > MAX_LOADING_DURATION) {
      // Loading state has been active too long, clear it
      localStorage.removeItem(key);
      localStorage.removeItem(timestampKey);
      console.warn(
        `[AuthStateManager] Clearing stuck loading state for ${userType} after ${timeDiff}ms`
      );
      return false;
    }
  }

  return isLoading;
};

export const clearAuthLoadingState = (userType = "admin") => {
  const key = `${AUTH_STATE_KEY}_${userType}`;
  const timestampKey = `${AUTH_STATE_TIMESTAMP_KEY}_${userType}`;

  localStorage.removeItem(key);
  localStorage.removeItem(timestampKey);
};

export const clearAllAuthStates = () => {
  // Clear both admin and employee states
  clearAuthLoadingState("admin");
  clearAuthLoadingState("employee");
};
