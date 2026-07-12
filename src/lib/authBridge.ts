import api from "./api";
import { getCookie, setCookie, deleteCookie } from "./cookies";

export async function authBridge(): Promise<any> {
  const accessToken = getCookie("access_token");
  const refreshToken = getCookie("refresh_token");

  const clearAuth = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    deleteCookie("user");
  };

  const fetchProfile = async () => {
    const profileResponse = await api.get(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/profile/`
    );
    const userData = profileResponse.data;
    setCookie("user", JSON.stringify(userData), 7);
    return userData;
  };

  // 1. If accessToken exists, try fetching profile
  if (accessToken) {
    try {
      return await fetchProfile();
    } catch (error) {
      // If profile fetch fails (e.g. invalid or expired accessToken)
      // and we have a refreshToken, attempt to refresh and try again.
      if (refreshToken) {
        try {
          const refreshResponse = await api.post(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/token/refresh/`,
            { refresh: refreshToken }
          );
          const { access } = refreshResponse.data;
          setCookie("access_token", access, 7);
          return await fetchProfile();
        } catch (refreshErr) {
          clearAuth();
          throw refreshErr;
        }
      } else {
        clearAuth();
        throw error;
      }
    }
  }

  // 2. If accessToken does not exist but refreshToken does, try refreshing first
  if (refreshToken) {
    try {
      const refreshResponse = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"}/api/users/token/refresh/`,
        { refresh: refreshToken }
      );
      const { access } = refreshResponse.data;
      setCookie("access_token", access, 7);
      return await fetchProfile();
    } catch (refreshErr) {
      clearAuth();
      throw refreshErr;
    }
  }

  // 3. If neither token exists, clean up and return null (guest state, no redirect)
  clearAuth();
  return null;
}
