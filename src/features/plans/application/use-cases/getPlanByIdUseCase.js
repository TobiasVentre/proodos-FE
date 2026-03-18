import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { normalizePlanRecord } from "../../../../shared/application/normalizePlanRecord.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

export const executeGetPlanByIdUseCase = async ({
  planIdInput,
  httpClient,
  authService,
  beBase,
}) => {
  const planId = Number(planIdInput);
  if (!Number.isInteger(planId) || planId <= 0) {
    throw new Error("El ID de plan debe ser un entero positivo.");
  }

  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/planes/${planId}`,
    headers,
  });

  return normalizePlanRecord(normalizeApiData(response));
};
