import { HttpError } from "../../core/httpClient.js";
import { createLogger } from "../../core/logger.js";

const logger = createLogger("landingsFeature");

export const createLandingsFeature = ({
  elements,
  screen,
  landingCatalogService,
  onOpenPreview,
}) => {
  const state = {
    items: [],
    loaded: false,
    loading: false,
  };

  const reset = () => {
    logger.debug("reset");
    state.items = [];
    state.loaded = false;
    state.loading = false;
    screen.renderLandingList([]);
    screen.setLandingsStatus("");
    screen.setLandingsLoading(false);
  };

  const load = async ({ force = false } = {}) => {
    if (state.loading) {
      logger.debug("load:skip-loading");
      return;
    }

    if (state.loaded && !force) {
      logger.debug("load:skip-cached", { itemCount: state.items.length });
      return;
    }

    logger.info("load:start", { force });
    state.loading = true;
    screen.setLandingsLoading(true);
    screen.setLandingsStatus("Cargando landings...");

    try {
      const landings = await landingCatalogService.listLandings();
      state.items = landings;
      state.loaded = true;
      logger.info("load:success", { count: landings.length });
      screen.renderLandingList(landings);
      screen.setLandingsStatus(`Landings cargadas: ${landings.length}.`);
    } catch (error) {
      const message =
        error instanceof HttpError || error instanceof Error
          ? error.message
          : "No se pudo cargar el listado de landings.";
      logger.error("load:error", { message });
      screen.renderLandingList([]);
      screen.setLandingsStatus(`No se pudo cargar el listado: ${message}`);
    } finally {
      state.loading = false;
      screen.setLandingsLoading(false);
    }
  };

  const bind = () => {
    elements.loadLandingsBtn.addEventListener("click", async () => {
      await load({ force: true });
    });

    elements.landingListContainer.addEventListener("click", async (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-action='open-preview']")
        : null;

      if (!trigger) {
        return;
      }

      const landingId = trigger.getAttribute("data-landing-id");
      if (!landingId) {
        return;
      }

      logger.info("preview:open", { landingId });
      await onOpenPreview(landingId);
    });
  };

  return {
    bind,
    load,
    reset,
  };
};
