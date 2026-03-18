import { HttpError } from "../../../../shared/infrastructure/httpClient.js";
import { createLogger } from "../../../../shared/infrastructure/logger.js";
import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const logger = createLogger("landingExportUseCase");

class LandingExportError extends Error {
  constructor(message, debugLogs = [], details = null) {
    super(message);
    this.name = "LandingExportError";
    this.debugLogs = debugLogs;
    this.details = details;
  }
}

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

export const executeGenerateLandingExportUseCase = async ({
  landingIdInput,
  httpClient,
  authService,
  beBase,
}) => {
  const debugLogs = [];
  const log = (stage, details = {}) => {
    const entry = {
      timestamp: new Date().toISOString(),
      stage,
      details,
    };
    debugLogs.push(entry);
    logger.debug(stage, details);
  };

  try {
    log("export:start", { landingIdInput });

    const landingId = Number(landingIdInput);
    log("export:landing-id", {
      landingId,
      valid: isPositiveInteger(landingId),
    });

    if (!isPositiveInteger(landingId)) {
      throw new Error("El ID de landing debe ser un entero positivo.");
    }

    const headers = await buildBearerHeaders(authService);
    log("auth:headers-ready", {
      hasAuthorization: Boolean(headers.Authorization),
    });

    const exportUrl = `${beBase}/landings/${landingId}/export-index`;
    log("api:export-index:request", { url: exportUrl });
    const response = await httpClient.request({
      method: "GET",
      url: exportUrl,
      headers,
    });

    const payload = normalizeApiData(response) ?? {};
    const indexHtml = String(payload?.index_html ?? "");
    const componentes = Array.isArray(payload?.componentes) ? payload.componentes : [];
    const warnings = Array.isArray(payload?.warnings) ? payload.warnings : [];
    const cssHrefs = Array.isArray(payload?.css_hrefs) ? payload.css_hrefs : [];
    const landing = payload?.landing && typeof payload.landing === "object" ? payload.landing : null;

    if (!indexHtml.trim()) {
      throw new Error("El endpoint devolvió un index_html vacío.");
    }

    log("api:export-index:response", {
      landingId: landing?.id_landing ?? landingId,
      componentCount: componentes.length,
      warnings: warnings.length,
      cssCount: cssHrefs.length,
      htmlLength: indexHtml.length,
    });

    return {
      indexHtml,
      summary: {
        landingId: landing?.id_landing ?? landingId,
        landingUrl: landing?.URL ?? null,
        componentCount: componentes.length,
        warnings: warnings.length,
        cssCount: cssHrefs.length,
      },
      payload,
      debugLogs,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo consultar el index.html exportado.";
    const details = {};

    if (error instanceof HttpError) {
      details.status = error.status;
      details.response = error.details;
    } else if (error instanceof LandingExportError && error.details) {
      Object.assign(details, error.details);
    }

    log("export:error", {
      name: error instanceof Error ? error.name : "UnknownError",
      message,
      ...details,
    });

    if (error instanceof LandingExportError) {
      error.debugLogs = debugLogs;
      throw error;
    }

    throw new LandingExportError(
      message,
      debugLogs,
      Object.keys(details).length > 0 ? details : null
    );
  }
};
