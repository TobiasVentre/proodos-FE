import { HttpError } from "../../../../shared/infrastructure/httpClient.js";

const normalizePath = (path) => {
  const value = String(path || "").trim();
  if (!value) {
    return "/health";
  }

  return value.startsWith("/") ? value : `/${value}`;
};

const safeParseJson = (rawBody) => {
  const body = String(rawBody || "").trim();
  if (!body) {
    return undefined;
  }

  return JSON.parse(body);
};

export const executeApiTesterRequestUseCase = async ({
  httpClient,
  authService,
  authBase,
  beBase,
  input,
}) => {
  const { base, method, path, body, includeToken } = input;
  const baseUrl = base === "AUTH" ? authBase : beBase;
  const url = `${baseUrl}${normalizePath(path)}`;
  const payload = safeParseJson(body);

  let token = null;
  if (includeToken) {
    token = await authService.getValidToken();
  }

  try {
    const response = await httpClient.request({
      method,
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: payload,
    });

    return { status: "success", response };
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        status: "error",
        response: {
          message: error.message,
          httpStatus: error.status,
          details: error.details,
        },
      };
    }

    return {
      status: "error",
      response: { message: error.message || "Error desconocido" },
    };
  }
};
