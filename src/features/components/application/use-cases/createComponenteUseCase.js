import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`El campo ${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

export const executeCreateComponenteUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const nombre = String(input?.nombre ?? "").trim();
  if (!nombre) {
    throw new Error("El nombre del componente es obligatorio.");
  }

  const payload = {
    nombre,
    id_tipo_componente: parseRequiredPositiveInteger(
      input?.id_tipo_componente,
      "id_tipo_componente"
    ),
    id_tipo_variacion: parseRequiredPositiveInteger(
      input?.id_tipo_variacion,
      "id_tipo_variacion"
    ),
    id_plan: parseRequiredPositiveInteger(input?.id_plan, "id_plan"),
  };

  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "POST",
    url: `${beBase}/componentes`,
    headers,
    body: payload,
  });

  return normalizeApiData(response);
};
