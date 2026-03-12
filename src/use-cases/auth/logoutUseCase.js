export const executeLogoutUseCase = async ({ authApi, sessionStore }) => {
  const refreshToken = sessionStore.getRefreshToken();
  sessionStore.clear();

  if (!refreshToken) {
    return;
  }

  try {
    await authApi.logout(refreshToken);
  } catch {
    // Logout remoto best-effort. La sesión local ya quedó invalidada.
  }
};
