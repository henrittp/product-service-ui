// app/utils/auth.ts
export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("authToken");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

export function isAuthenticated() {
  return !!getAuthToken();
}
