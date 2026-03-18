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

export const executeCreateVariationUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const payload = {
    id_tipo_componente: parseRequiredPositiveInteger(
      input?.id_tipo_componente,
      "id_tipo_componente"
    ),
    nombre: parseRequiredText(input?.nombre, "nombre"),
    descripcion: parseOptionalText(input?.descripcion),
    css_url: parseOptionalText(input?.css_url),
    js_url: parseOptionalText(input?.js_url),
    html: parseOptionalText(input?.html),
  };

  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "POST",
    url: `${beBase}/tipos-variacion`,
    headers,
    body: payload,
  });

  return normalizeApiData(response);
};
