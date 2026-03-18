import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { normalizePlanRecord } from "../../../../shared/application/normalizePlanRecord.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

export const executeListPlansUseCase = async ({
  httpClient,
  authService,
  beBase,
}) => {
  const headers = await buildBearerHeaders(authService);
  const response = await httpClient.request({
    method: "GET",
    url: `${beBase}/planes`,
    headers,
  });

  const payload = normalizeApiData(response);
  return Array.isArray(payload)
    ? payload.map((plan) => normalizePlanRecord(plan)).filter(Boolean)
    : [];
};
