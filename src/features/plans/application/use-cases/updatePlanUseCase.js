import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { normalizePlanRecord } from "../../../../shared/application/normalizePlanRecord.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const TEXT_FIELDS = [
  "segmento",
  "producto",
  "bonete",
  "nombre",
  "nombre_plan",
  "capacidad_plan",
];

const NUMBER_FIELDS = [
  "capacidad",
  "capacidad_anterior",
  "precio_oferta",
  "precio_full_price",
  "precio_sin_iva",
  "aumento",
];

const hasOwnField = (value, key) => Object.prototype.hasOwnProperty.call(value ?? {}, key);

const parsePlanId = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("El ID de plan es obligatorio.");
  }

  return parsed;
};

const parseNullableText = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : null;
};

const parseNullableNumber = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`El campo ${fieldName} debe ser numérico.`);
  }

  return parsed;
};

export const executeUpdatePlanUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const idPlan = parsePlanId(input?.id_plan);
  const payload = {};

  for (const field of TEXT_FIELDS) {
    if (hasOwnField(input, field)) {
      payload[field] = parseNullableText(input?.[field]);
    }
  }

  for (const field of NUMBER_FIELDS) {
    if (hasOwnField(input, field)) {
      payload[field] = parseNullableNumber(input?.[field], field);
    }
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("No hay cambios para guardar.");
  }

  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "PATCH",
    url: `${beBase}/planes/${idPlan}/full`,
    headers,
    body: payload,
  });

  return normalizePlanRecord(normalizeApiData(response));
};
