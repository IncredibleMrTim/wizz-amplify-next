// auth.js
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getIdToken = () => localStorage.getItem("idToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token; // Returns true if token exists
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};
