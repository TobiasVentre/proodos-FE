import { normalizeApiData } from "../shared/normalizeApiData.js";
import { buildBearerHeaders } from "../shared/requireValidToken.js";

export const executeListLandingsUseCase = async ({
  httpClient,
  authService,
  beBase,
}) => {
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/landings`,
    headers,
  });

  const payload = normalizeApiData(response);
  return Array.isArray(payload) ? payload : [];
};
