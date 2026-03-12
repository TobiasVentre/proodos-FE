import { HttpError } from "../../core/httpClient.js";
import { createLogger } from "../../core/logger.js";
import { escapeHtml } from "../../be/preview/previewEngine.js";
import { normalizeApiData } from "../shared/normalizeApiData.js";

const FALLBACK_BUTTON_LABEL = "Continuar";
const logger = createLogger("landingPreviewUseCase");

class PreviewGenerationError extends Error {
  constructor(message, debugLogs = [], details = null) {
    super(message);
    this.name = "PreviewGenerationError";
    this.debugLogs = debugLogs;
    this.details = details;
  }
}

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const buildLoggedAuthHeaders = async ({ authService, log }) => {
  const existingToken = authService.getToken();
  log?.("auth:token:read", { hasToken: Boolean(existingToken) });

  let token = null;
  try {
    token = await authService.getValidToken();
    log?.("auth:token:resolved", {
      hasToken: Boolean(token),
      reusedToken: Boolean(existingToken && token === existingToken),
    });
  } catch (error) {
    log?.("auth:refresh:error", {
      message: error instanceof Error ? error.message : "Fallo desconocido al refrescar token.",
    });
    throw error;
  }

  if (!token) {
    log?.("auth:missing-session", {});
    throw new Error("No hay una sesión activa para consultar el BE.");
  }

  return { Authorization: `Bearer ${token}` };
};

const buildLandingComponentMarkup = ({
  previewEngine,
  component,
  tipoVariacion,
  landing,
  template,
}) => {
  const placeholders = {
    tag: landing?.segmento || tipoVariacion?.nombre || "Preview",
    title: component?.nombre || tipoVariacion?.nombre || "Componente",
    description:
      tipoVariacion?.descripcion || `Vista previa del componente ${component?.nombre || ""}`.trim(),
    btn: FALLBACK_BUTTON_LABEL,
  };

  const hydratedTemplate = previewEngine.hydrateTemplate(template, placeholders);

  return `
      <section class="preview-component" data-component-id="${escapeHtml(component.id_componente)}">
        ${hydratedTemplate}
      </section>
    `;
};

const buildLandingDocument = ({
  previewEngine,
  landing,
  componentsMarkup,
  cssUrls,
  warnings,
}) => {
  const title = landing?.URL || `Landing ${landing?.id_landing ?? ""}`.trim();
  const contentMarkup =
    componentsMarkup ||
    `
        <section class="preview-empty">
          <h2>No hay contenido para renderizar</h2>
          <p>La landing seleccionada no tiene componentes listos para preview.</p>
        </section>
      `;

  return previewEngine.buildDocument({
    title,
    subtitle: `Segmento: ${landing?.segmento || "-"} | Estado: ${landing?.estado || "-"}`,
    cssUrls,
    warnings,
    shellClass: "preview-shell",
    headerClass: "preview-header",
    contentClass: "preview-components",
    alertClass: "preview-alert",
    contentMarkup,
    shellStyles: `
            max-width: 1440px;
            margin: 0 auto;
            padding: 32px 24px 48px;
          `,
    headerStyles: "backdrop-filter: blur(10px);",
    extraStyles: `
          .preview-component {
            background: #ffffff;
            border: 1px solid rgba(15, 122, 95, 0.1);
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 18px 36px rgba(18, 55, 43, 0.08);
          }

          .preview-empty {
            padding: 48px 28px;
            text-align: center;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 18px;
            border: 1px dashed rgba(15, 122, 95, 0.25);
          }
        `,
  });
};

export const executeGenerateLandingPreviewUseCase = async ({
  landingIdInput,
  httpClient,
  authService,
  beBase,
  previewEngine,
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
    log("preview:start", { landingIdInput });

    const landingId = Number(landingIdInput);
    log("preview:landing-id", {
      landingId,
      valid: isPositiveInteger(landingId),
    });

    if (!isPositiveInteger(landingId)) {
      throw new Error("El ID de landing debe ser un entero positivo.");
    }

    const headers = await buildLoggedAuthHeaders({ authService, log });
    log("auth:headers-ready", {
      hasAuthorization: Boolean(headers.Authorization),
    });

    const landingUrl = `${beBase}/landings/${landingId}`;
    log("api:landing:request", { url: landingUrl });
    const landingResponse = await httpClient.request({
      method: "GET",
      url: landingUrl,
      headers,
    });
    const landing = normalizeApiData(landingResponse);
    log("api:landing:response", {
      id_landing: landing?.id_landing ?? null,
      url: landing?.URL ?? null,
      estado: landing?.estado ?? null,
      segmento: landing?.segmento ?? null,
    });

    const landingComponentesUrl = `${beBase}/landings/${landingId}/componentes`;
    log("api:landing-componentes:request", { url: landingComponentesUrl });
    const landingComponentesResponse = await httpClient.request({
      method: "GET",
      url: landingComponentesUrl,
      headers,
    });
    const componentsResponse = normalizeApiData(landingComponentesResponse);
    const components = Array.isArray(componentsResponse) ? componentsResponse : [];
    log("api:landing-componentes:response", {
      componentCount: components.length,
      componentIds: components.map((component) => component?.id_componente ?? null),
    });

    if (components.length === 0) {
      const summary = {
        landingId,
        landingUrl: landing?.URL ?? null,
        componentCount: 0,
        warnings: 1,
      };
      log("preview:empty", summary);

      return {
        document: buildLandingDocument({
          previewEngine,
          landing,
          componentsMarkup: "",
          cssUrls: [],
          warnings: ["La landing no tiene componentes asociados."],
        }),
        summary,
        debugLogs,
      };
    }

    log("preview:components:normalized", {
      count: components.length,
      components: components.map((component) => ({
        id_componente: component?.id_componente ?? null,
        nombre: component?.nombre ?? null,
        id_tipo_variacion: component?.id_tipo_variacion ?? null,
      })),
    });

    const tipoVariacionById = new Map();
    for (const component of components) {
      const componentId = Number(component?.id_componente);
      const tipoVariacionId = Number(component?.id_tipo_variacion);

      if (!isPositiveInteger(tipoVariacionId)) {
        log("api:tipo-variacion:skip-invalid", {
          componentId,
          tipoVariacionId: component?.id_tipo_variacion ?? null,
        });
        continue;
      }

      if (tipoVariacionById.has(tipoVariacionId)) {
        log("api:tipo-variacion:skip-duplicate", {
          componentId,
          tipoVariacionId,
        });
        continue;
      }

      const tipoVariacionUrl = `${beBase}/tipos-variacion/${tipoVariacionId}`;
      log("api:tipo-variacion:request", {
        componentId,
        tipoVariacionId,
        url: tipoVariacionUrl,
      });
      const tipoVariacionResponse = await httpClient.request({
        method: "GET",
        url: tipoVariacionUrl,
        headers,
      });
      const tipoVariacion = normalizeApiData(tipoVariacionResponse);
      tipoVariacionById.set(tipoVariacionId, tipoVariacion);
      log("api:tipo-variacion:response", {
        componentId,
        tipoVariacionId,
        nombre: tipoVariacion?.nombre ?? null,
        html: tipoVariacion?.html ?? null,
        css_url: tipoVariacion?.css_url ?? null,
        js_url: tipoVariacion?.js_url ?? null,
      });
    }

    const warnings = [];
    const cssUrls = new Set();
    const componentsMarkup = [];

    for (const component of components) {
      const componentId = Number(component?.id_componente);
      const tipoVariacionId = Number(component?.id_tipo_variacion);
      const tipoVariacion = tipoVariacionById.get(tipoVariacionId);

      if (!tipoVariacion) {
        const warning = `No se encontró la variación del componente ${component.nombre}.`;
        warnings.push(warning);
        log("component:skip-missing-variation", {
          componentId,
          tipoVariacionId,
          warning,
        });
        continue;
      }

      const templateUrl = previewEngine.resolveAssetUrl(tipoVariacion.html, { assetType: "html" });
      const cssUrl = previewEngine.resolveAssetUrl(tipoVariacion.css_url, { assetType: "css" });
      const jsUrl = tipoVariacion.js_url || null;
      log("asset:resolved", {
        componentId,
        tipoVariacionId,
        templatePath: tipoVariacion?.html ?? null,
        templateUrl,
        cssPath: tipoVariacion?.css_url ?? null,
        cssUrl,
        jsPath: tipoVariacion?.js_url ?? null,
        jsUrl,
      });

      if (!templateUrl) {
        const warning = `La variación ${tipoVariacion.nombre} no tiene ruta HTML configurada.`;
        warnings.push(warning);
        log("component:skip-missing-template", {
          componentId,
          tipoVariacionId,
          warning,
        });
        continue;
      }

      if (cssUrl) {
        cssUrls.add(cssUrl);
      }

      try {
        const template = await previewEngine.loadTemplate(templateUrl, {
          log,
          context: {
            componentId,
            tipoVariacionId,
          },
        });
        componentsMarkup.push(
          buildLandingComponentMarkup({
            previewEngine,
            component,
            tipoVariacion,
            landing,
            template,
          })
        );
        log("component:rendered", {
          componentId,
          tipoVariacionId,
          templateLength: template.length,
          renderedCount: componentsMarkup.length,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No se pudo cargar el template del componente.";
        const warning = `No se pudo cargar el template del componente ${component.nombre}: ${message}`;
        warnings.push(warning);
        log("component:template-error", {
          componentId,
          tipoVariacionId,
          message,
        });
      }
    }

    const summary = {
      landingId,
      landingUrl: landing?.URL ?? null,
      componentCount: componentsMarkup.length,
      warnings: warnings.length,
    };
    log("preview:complete", {
      ...summary,
      cssUrls: Array.from(cssUrls),
      warningMessages: warnings,
    });

    return {
      document: buildLandingDocument({
        previewEngine,
        landing,
        componentsMarkup: componentsMarkup.join("\n"),
        cssUrls: Array.from(cssUrls),
        warnings,
      }),
      summary,
      debugLogs,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo generar el preview.";
    const details = {};

    if (error instanceof HttpError) {
      details.status = error.status;
      details.response = error.details;
    } else if (error instanceof PreviewGenerationError && error.details) {
      Object.assign(details, error.details);
    }

    log("preview:error", {
      name: error instanceof Error ? error.name : "UnknownError",
      message,
      ...details,
    });

    if (error instanceof PreviewGenerationError) {
      error.debugLogs = debugLogs;
      throw error;
    }

    throw new PreviewGenerationError(
      message,
      debugLogs,
      Object.keys(details).length > 0 ? details : null
    );
  }
};
