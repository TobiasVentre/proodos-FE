export const executeLoginUseCase = async ({ authApi, sessionStore, credentials }) => {
  const session = await authApi.login(credentials);
  sessionStore.save(session);
  return session;
};
