import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

export const executeLoadVariationFiltersUseCase = async ({
  httpClient,
  authService,
  beBase,
}) => {
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/tipos-componente`,
    headers,
  });

  const payload = normalizeApiData(response);
  return {
    tiposComponente: Array.isArray(payload) ? payload : [],
  };
};
