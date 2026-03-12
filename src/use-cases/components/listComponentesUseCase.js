import { normalizeApiData } from "../shared/normalizeApiData.js";
import { buildBearerHeaders } from "../shared/requireValidToken.js";

export const executeListComponentesUseCase = async ({
  httpClient,
  authService,
  beBase,
}) => {
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/componentes`,
    headers,
  });

  const payload = normalizeApiData(response);
  return Array.isArray(payload) ? payload : [];
};
