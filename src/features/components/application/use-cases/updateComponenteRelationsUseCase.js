import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`El campo ${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

const parseOptionalPositiveInteger = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return parseRequiredPositiveInteger(value, fieldName);
};

const hasOwnField = (value, fieldName) =>
  Object.prototype.hasOwnProperty.call(value ?? {}, fieldName);

const parseOptionalSelector = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return null;
  }

  const isValid = /^([#.])[A-Za-z_][A-Za-z0-9_-]*$/.test(normalized);
  if (!isValid) {
    throw new Error(
      "El selector de hijos debe tener formato #id o .clase."
    );
  }

  return normalized;
};

export const executeUpdateComponenteRelationsUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const payload = {};

  if (hasOwnField(input, "id_tipo_variacion")) {
    payload.id_tipo_variacion = parseRequiredPositiveInteger(
      input?.id_tipo_variacion,
      "id_tipo_variacion"
    );
  }

  if (hasOwnField(input, "id_plan")) {
    payload.id_plan = parseOptionalPositiveInteger(input?.id_plan, "id_plan");
  }

  if (hasOwnField(input, "selector_hijos")) {
    payload.selector_hijos = parseOptionalSelector(input?.selector_hijos);
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("Tenés que indicar al menos un cambio para actualizar el componente.");
  }

  const idComponente = parseRequiredPositiveInteger(input?.id_componente, "id_componente");
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "PATCH",
    url: `${beBase}/componentes/${idComponente}`,
    headers,
    body: payload,
  });

  return normalizeApiData(response);
};
