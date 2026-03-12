import { executeRefreshSessionUseCase } from "./refreshSessionUseCase.js";
import { isTokenExpired } from "./tokenExpiry.js";

export const executeGetValidTokenUseCase = async ({ authApi, sessionStore }) => {
  const token = sessionStore.getToken();
  if (token && !isTokenExpired(token)) {
    return token;
  }

  try {
    return await executeRefreshSessionUseCase({ authApi, sessionStore });
  } catch {
    sessionStore.clear();
    return null;
  }
};
