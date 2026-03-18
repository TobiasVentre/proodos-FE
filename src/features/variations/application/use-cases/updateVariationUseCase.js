import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`El campo ${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

const parseRequiredText = (value, fieldName) => {
  const parsed = String(value ?? "").trim();
  if (!parsed) {
    throw new Error(`El campo ${fieldName} es obligatorio.`);
  }

  return parsed;
};

const parseOptionalText = (value) => {
  const parsed = String(value ?? "").trim();
  return parsed ? parsed : null;
};

const hasOwnField = (value, fieldName) =>
  Object.prototype.hasOwnProperty.call(value ?? {}, fieldName);

export const executeUpdateVariationUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const payload = {};

  if (hasOwnField(input, "id_tipo_componente")) {
    payload.id_tipo_componente = parseRequiredPositiveInteger(
      input?.id_tipo_componente,
      "id_tipo_componente"
    );
  }

  if (hasOwnField(input, "nombre")) {
    payload.nombre = parseRequiredText(input?.nombre, "nombre");
  }

  if (hasOwnField(input, "descripcion")) {
    payload.descripcion = parseOptionalText(input?.descripcion);
  }

  if (hasOwnField(input, "css_url")) {
    payload.css_url = parseOptionalText(input?.css_url);
  }

  if (hasOwnField(input, "js_url")) {
    payload.js_url = parseOptionalText(input?.js_url);
  }

  if (hasOwnField(input, "html")) {
    payload.html = parseOptionalText(input?.html);
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("Tenés que indicar al menos un cambio para actualizar la variación.");
  }

  const idTipoVariacion = parseRequiredPositiveInteger(
    input?.id_tipo_variacion,
    "id_tipo_variacion"
  );
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "PATCH",
    url: `${beBase}/tipos-variacion/${idTipoVariacion}`,
    headers,
    body: payload,
  });

  return normalizeApiData(response);
};
