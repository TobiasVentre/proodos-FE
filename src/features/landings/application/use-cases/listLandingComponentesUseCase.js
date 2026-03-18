import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

export const executeListLandingComponentesUseCase = async ({
  landingIdInput,
  httpClient,
  authService,
  beBase,
}) => {
  const landingId = parseRequiredPositiveInteger(landingIdInput, "El id_landing");
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/landings/${landingId}/componentes`,
    headers,
  });

  const payload = normalizeApiData(response);
  const relations = Array.isArray(payload) ? payload : [];
  return relations.map((relation) => relation?.componente ?? relation).filter(Boolean);
};
