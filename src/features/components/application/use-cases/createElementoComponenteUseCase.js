import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

const parseRequiredOrderInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${fieldName} debe ser un entero mayor o igual a cero.`);
  }

  return parsed;
};

const parseRequiredString = (value, fieldName) => {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw new Error(`${fieldName} es obligatorio.`);
  }

  return normalized;
};

const parseOptionalNullableString = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized || null;
};

export const executeCreateElementoComponenteUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const payload = {
    id_componente: parseRequiredPositiveInteger(input?.id_componente, "id_componente"),
    id_tipo_elemento: parseRequiredPositiveInteger(
      input?.id_tipo_elemento,
      "id_tipo_elemento"
    ),
    nombre: parseRequiredString(input?.nombre, "nombre"),
    selector: parseOptionalNullableString(input?.selector),
    icono_img: parseOptionalNullableString(input?.icono_img),
    descripcion: parseOptionalNullableString(input?.descripcion),
    link: parseOptionalNullableString(input?.link),
    orden: parseRequiredOrderInteger(input?.orden, "orden"),
    css_url: parseOptionalNullableString(input?.css_url),
  };

  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "POST",
    url: `${beBase}/elementos-componente`,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: payload,
  });

  return normalizeApiData(response);
};
