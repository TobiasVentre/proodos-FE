import { HttpError } from "../../core/httpClient.js";
import { createLogger } from "../../core/logger.js";

const logger = createLogger("componentsFeature");

export const createComponentsFeature = ({
  elements,
  screen,
  componentCatalogService,
  componentPreviewService,
}) => {
  const catalogState = {
    items: [],
    loaded: false,
    loading: false,
  };

  const detailState = {
    selectedId: null,
    loading: false,
    requestId: 0,
  };

  const reset = () => {
    logger.debug("reset");
    catalogState.items = [];
    catalogState.loaded = false;
    catalogState.loading = false;
    detailState.selectedId = null;
    detailState.loading = false;
    detailState.requestId = 0;
    screen.renderComponentList([], null);
    screen.setComponentsStatus("");
    screen.setComponentsLoading(false);
    screen.setComponentDetailStatus("");
    screen.clearComponentDetail();
    screen.setComponentPreviewStatus("");
    screen.setComponentPreviewDocument("");
  };

  const load = async ({ force = false } = {}) => {
    if (catalogState.loading) {
      logger.debug("catalog:skip-loading");
      return;
    }

    if (catalogState.loaded && !force) {
      logger.debug("catalog:skip-cached", { count: catalogState.items.length });
      return;
    }

    logger.info("catalog:load:start", { force });
    catalogState.loading = true;
    screen.setComponentsLoading(true);
    screen.setComponentsStatus("Cargando componentes...");

    try {
      const componentes = await componentCatalogService.listComponentes();
      catalogState.items = componentes;
      catalogState.loaded = true;
      logger.info("catalog:load:success", { count: componentes.length });
      const selectedStillExists = componentes.some(
        (componente) => String(componente?.id_componente ?? "") === String(detailState.selectedId ?? "")
      );

      if (!selectedStillExists) {
        detailState.selectedId = null;
        screen.setComponentDetailStatus("");
        screen.clearComponentDetail();
      }

      screen.renderComponentList(componentes, detailState.selectedId);
      screen.setComponentsStatus(`Componentes cargados: ${componentes.length}.`);
    } catch (error) {
      const message =
        error instanceof HttpError || error instanceof Error
          ? error.message
          : "No se pudo cargar el listado de componentes.";
      logger.error("catalog:load:error", { message });
      screen.renderComponentList([]);
      screen.setComponentsStatus(`No se pudo cargar el listado: ${message}`);
    } finally {
      catalogState.loading = false;
      screen.setComponentsLoading(false);
    }
  };

  const loadDetail = async (componentIdInput) => {
    const componentId = Number(componentIdInput);
    if (!Number.isInteger(componentId) || componentId <= 0) {
      logger.warn("detail:skip-invalid-id", { componentIdInput });
      return;
    }

    const requestId = ++detailState.requestId;
    logger.info("detail:load:start", { componentId, requestId });
    detailState.selectedId = componentId;
    detailState.loading = true;
    screen.renderComponentList(catalogState.items, detailState.selectedId);
    screen.setComponentDetailStatus(`Cargando detalle del componente #${componentId}...`);
    screen.clearComponentDetail("Cargando detalle del componente...");
    screen.setComponentPreviewStatus("");
    screen.setComponentPreviewDocument("");

    try {
      const detail = await componentCatalogService.getComponenteDetail(componentId);
      if (requestId !== detailState.requestId) {
        logger.debug("detail:skip-stale-response", { componentId, requestId });
        return;
      }

      logger.info("detail:load:success", {
        componentId,
        warningCount: Array.isArray(detail?.warnings) ? detail.warnings.length : 0,
      });
      screen.renderComponentList(catalogState.items, detailState.selectedId);
      screen.renderComponentDetail(detail);
      screen.setComponentDetailStatus(`Detalle cargado para el componente #${componentId}.`);

      try {
        logger.info("preview:generate:start", { componentId, requestId });
        screen.setComponentPreviewStatus("Generando preview del componente...");
        const preview = await componentPreviewService.generate(detail);
        if (requestId !== detailState.requestId) {
          logger.debug("preview:skip-stale-response", { componentId, requestId });
          return;
        }

        logger.info("preview:generate:success", {
          componentId,
          warnings: preview?.summary?.warnings ?? 0,
        });
        screen.setComponentPreviewDocument(preview.document);
        screen.setComponentPreviewStatus(
          `Preview generado. Advertencias: ${preview.summary.warnings}.`
        );
      } catch (error) {
        if (requestId !== detailState.requestId) {
          return;
        }

        const previewMessage =
          error instanceof HttpError || error instanceof Error
            ? error.message
            : "No se pudo generar el preview del componente.";
        logger.error("preview:generate:error", {
          componentId,
          requestId,
          message: previewMessage,
        });
        screen.setComponentPreviewDocument("");
        screen.setComponentPreviewStatus(`No se pudo generar el preview: ${previewMessage}`);
      }
    } catch (error) {
      if (requestId !== detailState.requestId) {
        logger.debug("detail:skip-stale-error", { componentId, requestId });
        return;
      }

      const message =
        error instanceof HttpError || error instanceof Error
          ? error.message
          : "No se pudo cargar el detalle del componente.";
      logger.error("detail:load:error", { componentId, requestId, message });
      screen.renderComponentList(catalogState.items, detailState.selectedId);
      screen.setComponentDetailStatus(`No se pudo cargar el detalle: ${message}`);
      screen.clearComponentDetail(`No se pudo cargar el detalle del componente #${componentId}.`);
      screen.setComponentPreviewStatus("");
      screen.setComponentPreviewDocument("");
    } finally {
      if (requestId === detailState.requestId) {
        detailState.loading = false;
      }
    }
  };

  const bind = () => {
    elements.loadComponentsBtn.addEventListener("click", async () => {
      await load({ force: true });
    });

    elements.componentListContainer.addEventListener("click", async (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-component-id]")
        : null;

      if (!trigger) {
        return;
      }

      const componentId = trigger.getAttribute("data-component-id");
      if (!componentId) {
        return;
      }

      await loadDetail(componentId);
    });
  };

  return {
    bind,
    load,
    reset,
  };
};
