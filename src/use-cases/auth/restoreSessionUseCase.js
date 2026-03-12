import { executeGetValidTokenUseCase } from "./getValidTokenUseCase.js";

export const executeRestoreSessionUseCase = async ({ authApi, sessionStore }) => {
  const user = sessionStore.getUser();
  if (!user) {
    return null;
  }

  const token = await executeGetValidTokenUseCase({ authApi, sessionStore });
  if (!token) {
    sessionStore.clear();
    return null;
  }

  return {
    token,
    refreshToken: sessionStore.getRefreshToken(),
    user,
  };
};
