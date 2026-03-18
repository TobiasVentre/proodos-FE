import { HttpError } from "../../../shared/infrastructure/httpClient.js";
import { createLogger } from "../../../shared/infrastructure/logger.js";

const logger = createLogger("landingPreviewFeature");

export const createLandingPreviewFeature = ({
  elements,
  screen,
  landingExportService,
  landingPreviewService,
}) => {
  const reset = () => {
    logger.debug("reset");
    if (elements.landingIdInput) {
      elements.landingIdInput.value = "";
    }
    screen.setPreviewLoading(false);
    screen.setPreviewStatus("");
    screen.setPreviewDocument("");
    screen.setPreviewExportCode("");
    screen.setPreviewDebug("");
  };

  const setIdleState = () => {
    logger.debug("set-idle-state");
    screen.setPreviewLoading(false);
    screen.setPreviewStatus("Ingresá un ID de landing para generar el preview.");
    screen.setPreviewDocument("");
    screen.setPreviewExportCode("");
    screen.setPreviewDebug({ message: "Esperando generación de preview." });
  };

  const setLandingId = (landingId) => {
    if (elements.landingIdInput) {
      elements.landingIdInput.value = String(landingId ?? "");
    }
  };

  const markReadyForLanding = (landingId) => {
    logger.info("ready-for-landing", { landingId });
    setLandingId(landingId);
    screen.setPreviewStatus(`Landing ${landingId} lista para generar preview.`);
    screen.setPreviewDocument("");
    screen.setPreviewExportCode("");
    screen.setPreviewDebug({
      message: "Esperando generación de preview.",
      landingId: String(landingId),
    });
  };

  const bind = () => {
    elements.previewForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      logger.info("generate:start", { landingId: elements.landingIdInput.value });
      screen.setPreviewLoading(true);
      screen.setPreviewStatus("Generando preview...");
      screen.setPreviewDebug({
        message: "Iniciando generación de preview...",
        landingId: elements.landingIdInput.value,
      });

      try {
        const preview = await landingPreviewService.generate(elements.landingIdInput.value);
        logger.info("generate:success", {
          landingId: elements.landingIdInput.value,
          componentCount: preview?.summary?.componentCount ?? 0,
          warnings: preview?.summary?.warnings ?? 0,
        });
        screen.setPreviewExportCode("");
        screen.setPreviewDocument(preview.document);
        screen.setPreviewStatus(
          `Preview generado. Componentes renderizados: ${preview.summary.componentCount}. Advertencias: ${preview.summary.warnings}.`
        );
        screen.setPreviewDebug(preview.debugLogs ?? []);
        screen.setResponse({
          status: "success",
          preview: preview.summary,
        });
      } catch (error) {
        const message =
          error instanceof HttpError || error instanceof Error
            ? error.message
            : "No se pudo generar el preview.";
        logger.error("generate:error", {
          landingId: elements.landingIdInput.value,
          message,
        });
        screen.setPreviewDocument("");
        screen.setPreviewStatus(`No se pudo generar el preview: ${message}`);
        screen.setPreviewDebug(
          error && typeof error === "object" && "debugLogs" in error
            ? error.debugLogs
            : [
                {
                  timestamp: new Date().toISOString(),
                  stage: "ui:preview:error",
                  details: {
                    message,
                    status: error instanceof HttpError ? error.status : null,
                    response: error instanceof HttpError ? error.details : null,
                  },
                },
              ]
        );
        screen.setResponse({
          status: "error",
          preview: {
            message,
          },
        });
      } finally {
        screen.setPreviewLoading(false);
      }
    });

    elements.previewExportBtn.addEventListener("click", async () => {
      logger.info("export:start", { landingId: elements.landingIdInput.value });
      screen.setPreviewLoading(true);
      screen.setPreviewStatus("Consultando index.html exportado...");
      screen.setPreviewDebug({
        message: "Iniciando consulta de export-index...",
        landingId: elements.landingIdInput.value,
      });

      try {
        const exportResult = await landingExportService.generate(elements.landingIdInput.value);
        logger.info("export:success", {
          landingId: elements.landingIdInput.value,
          componentCount: exportResult?.summary?.componentCount ?? 0,
          warnings: exportResult?.summary?.warnings ?? 0,
          cssCount: exportResult?.summary?.cssCount ?? 0,
        });
        screen.setPreviewDocument("");
        screen.setPreviewExportCode(exportResult.indexHtml);
        screen.setPreviewStatus(
          `Index.html consultado. Componentes: ${exportResult.summary.componentCount}. CSS: ${exportResult.summary.cssCount}. Advertencias: ${exportResult.summary.warnings}.`
        );
        screen.setPreviewDebug(exportResult.debugLogs ?? []);
        screen.setResponse(exportResult.indexHtml);
      } catch (error) {
        const message =
          error instanceof HttpError || error instanceof Error
            ? error.message
            : "No se pudo consultar el index.html exportado.";
        logger.error("export:error", {
          landingId: elements.landingIdInput.value,
          message,
        });
        screen.setPreviewDocument("");
        screen.setPreviewExportCode("");
        screen.setPreviewStatus(`No se pudo consultar el index.html exportado: ${message}`);
        screen.setPreviewDebug(
          error && typeof error === "object" && "debugLogs" in error
            ? error.debugLogs
            : [
                {
                  timestamp: new Date().toISOString(),
                  stage: "ui:export:error",
                  details: {
                    message,
                    status: error instanceof HttpError ? error.status : null,
                    response: error instanceof HttpError ? error.details : null,
                  },
                },
              ]
        );
        screen.setResponse({
          status: "error",
          exportIndex: {
            message,
          },
        });
      } finally {
        screen.setPreviewLoading(false);
      }
    });
  };

  return {
    bind,
    markReadyForLanding,
    reset,
    setIdleState,
  };
};
