export const executeRefreshSessionUseCase = async ({ authApi, sessionStore }) => {
  const refreshToken = sessionStore.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const refreshedSession = await authApi.refresh(refreshToken);
  const user = refreshedSession?.user ?? sessionStore.getUser();

  if (!user || !refreshedSession?.token) {
    sessionStore.clear();
    return null;
  }

  sessionStore.save({
    token: refreshedSession.token,
    refreshToken: refreshedSession.refreshToken ?? refreshToken,
    user,
  });

  return refreshedSession.token;
};
