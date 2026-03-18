export const requireValidToken = async (
  authService,
  { message = "No hay una sesión activa para consultar el BE." } = {}
) => {
  const token = await authService.getValidToken();
  if (!token) {
    throw new Error(message);
  }

  return token;
};

export const buildBearerHeaders = async (authService, options) => {
  const token = await requireValidToken(authService, options);
  return { Authorization: `Bearer ${token}` };
};
