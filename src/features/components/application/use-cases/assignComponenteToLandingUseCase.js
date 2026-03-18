import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

export const executeAssignComponenteToLandingUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const id_componente = parseRequiredPositiveInteger(input?.id_componente, "id_componente");
  const id_landing = parseRequiredPositiveInteger(input?.id_landing, "id_landing");
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "POST",
    url: `${beBase}/landings/${id_landing}/componentes`,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: {
      id_componente,
    },
  });

  return normalizeApiData(response);
};
