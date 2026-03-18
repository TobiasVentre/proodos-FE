import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const requestGet = ({ httpClient, url, headers }) =>
  httpClient.request({
    method: "GET",
    url,
    headers,
  });

export const executeLoadCreateComponenteFormUseCase = async ({
  httpClient,
  authService,
  beBase,
}) => {
  const headers = await buildBearerHeaders(authService);

  const [tiposComponenteResponse, planesResponse] = await Promise.all([
    requestGet({
      httpClient,
      url: `${beBase}/tipos-componente`,
      headers,
    }),
    requestGet({
      httpClient,
      url: `${beBase}/planes`,
      headers,
    }),
  ]);

  const tiposComponentePayload = normalizeApiData(tiposComponenteResponse);
  const planesPayload = normalizeApiData(planesResponse);

  return {
    tiposComponente: Array.isArray(tiposComponentePayload) ? tiposComponentePayload : [],
    planes: Array.isArray(planesPayload) ? planesPayload : [],
  };
};
