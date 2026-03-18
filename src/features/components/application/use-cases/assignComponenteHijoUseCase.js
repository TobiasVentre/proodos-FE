import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

export const executeAssignComponenteHijoUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const id_padre = parseRequiredPositiveInteger(input?.id_padre, "id_padre");
  const id_hijo = parseRequiredPositiveInteger(input?.id_hijo, "id_hijo");
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "POST",
    url: `${beBase}/componentes/${id_padre}/hijos`,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: {
      id_hijo,
    },
  });

  return normalizeApiData(response);
};
