import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const executeListTiposVariacionUseCase = async ({
  idTipoComponenteInput,
  httpClient,
  authService,
  beBase,
}) => {
  const idTipoComponente = parsePositiveInteger(idTipoComponenteInput);
  if (!idTipoComponente) {
    return [];
  }

  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/tipos-variacion?id_tipo_componente=${idTipoComponente}`,
    headers,
  });

  const payload = normalizeApiData(response);
  return Array.isArray(payload) ? payload : [];
};
