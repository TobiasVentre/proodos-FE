import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

export const executeListTiposElementoUseCase = async ({
  httpClient,
  authService,
  beBase,
}) => {
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/tipos-elemento`,
    headers,
  });

  const payload = normalizeApiData(response);
  return Array.isArray(payload) ? payload : [];
};
