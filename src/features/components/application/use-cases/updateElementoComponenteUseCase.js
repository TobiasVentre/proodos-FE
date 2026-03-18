import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

const parseOptionalNullableString = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized || null;
};

export const executeUpdateElementoComponenteUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const id_elemento = parseRequiredPositiveInteger(input?.id_elemento, "id_elemento");
  const payload = {
    selector: parseOptionalNullableString(input?.selector),
  };

  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "PATCH",
    url: `${beBase}/elementos-componente/${id_elemento}`,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: payload,
  });

  return normalizeApiData(response);
};
