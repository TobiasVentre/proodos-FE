import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

export const executeListAssignableComponentesUseCase = async ({
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
