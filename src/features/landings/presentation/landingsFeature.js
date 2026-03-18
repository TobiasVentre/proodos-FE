import { HttpError } from "../../../shared/infrastructure/httpClient.js";
import { createLogger } from "../../../shared/infrastructure/logger.js";

const logger = createLogger("landingsFeature");

const getErrorMessage = (error, fallbackMessage) =>
  error instanceof HttpError || error instanceof Error ? error.message : fallbackMessage;

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const createLandingsFeature = ({
  elements,
  screen,
  landingCatalogService,
  landingManagementService,
  onOpenPreview,
}) => {
  const state = {
    items: [],
    loaded: false,
    loading: false,
    assignableComponents: [],
    componentsByLandingId: new Map(),
    selectedComponentByLandingId: new Map(),
    statusByLandingId: new Map(),
    loadingByLandingId: new Map(),
    editEnabledByLandingId: new Map(),
  };

  const renderLandingList = () => {
    screen.renderLandingList({
      landings: state.items,
      assignableComponents: state.assignableComponents,
      componentsByLandingId: state.componentsByLandingId,
      selectedComponentByLandingId: state.selectedComponentByLandingId,
      statusByLandingId: state.statusByLandingId,
      loadingByLandingId: state.loadingByLandingId,
      editEnabledByLandingId: state.editEnabledByLandingId,
    });
  };

  const syncSelectedComponents = () => {
    const nextSelected = new Map();

    state.items.forEach((landing) => {
      const landingId = String(landing?.id_landing ?? "");
      const associatedComponents = Array.isArray(state.componentsByLandingId.get(landingId))
        ? state.componentsByLandingId.get(landingId)
        : [];
      const associatedComponentIds = new Set(
        associatedComponents.map((component) => String(component?.id_componente ?? ""))
      );
      const availableComponents = state.assignableComponents.filter(
        (component) => !associatedComponentIds.has(String(component?.id_componente ?? ""))
      );
      const currentSelection = String(state.selectedComponentByLandingId.get(landingId) ?? "");
      const selectionStillExists = availableComponents.some(
        (component) => String(component?.id_componente ?? "") === currentSelection
      );

      nextSelected.set(
        landingId,
        selectionStillExists ? currentSelection : String(availableComponents[0]?.id_componente ?? "")
      );
    });

    state.selectedComponentByLandingId = nextSelected;
  };

  const loadLandingComponentsByLanding = async (landings) => {
    const relations = await Promise.all(
      landings.map(async (landing) => {
        const landingId = parsePositiveInteger(landing?.id_landing);
        const landingKey = String(landingId ?? "");
        if (!landingId) {
          return [landingKey, []];
        }

        try {
          const components = await landingManagementService.listLandingComponentes(landingId);
          return [landingKey, components];
        } catch (error) {
          const message = getErrorMessage(
            error,
            "No se pudieron cargar los componentes asociados."
          );
          state.statusByLandingId.set(
            landingKey,
            `No se pudieron cargar los componentes asociados: ${message}`
          );
          logger.error("associations:load:error", { landingId, message });
          return [landingKey, []];
        }
      })
    );

    state.componentsByLandingId = new Map(relations);
    syncSelectedComponents();
  };

  const reset = () => {
    logger.debug("reset");
    state.items = [];
    state.loaded = false;
    state.loading = false;
    state.assignableComponents = [];
    state.componentsByLandingId = new Map();
    state.selectedComponentByLandingId = new Map();
    state.statusByLandingId = new Map();
    state.loadingByLandingId = new Map();
    state.editEnabledByLandingId = new Map();
    screen.renderLandingList({
      landings: [],
      assignableComponents: [],
      componentsByLandingId: new Map(),
      selectedComponentByLandingId: new Map(),
      statusByLandingId: new Map(),
      loadingByLandingId: new Map(),
      editEnabledByLandingId: new Map(),
    });
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
      const [landings, assignableComponents] = await Promise.all([
        landingCatalogService.listLandings(),
        landingManagementService.listAssignableComponentes(),
      ]);

      state.items = Array.isArray(landings) ? landings : [];
      state.assignableComponents = Array.isArray(assignableComponents) ? assignableComponents : [];
      state.componentsByLandingId = new Map();
      state.selectedComponentByLandingId = new Map();
      state.statusByLandingId = new Map();
      state.loadingByLandingId = new Map();
      state.editEnabledByLandingId = new Map(
        state.items.map((landing) => [String(landing?.id_landing ?? ""), false])
      );

      await loadLandingComponentsByLanding(state.items);
      state.loaded = true;
      renderLandingList();
      logger.info("load:success", {
        landings: state.items.length,
        assignableComponents: state.assignableComponents.length,
      });
      screen.setLandingsStatus(`Landings cargadas: ${state.items.length}.`);
    } catch (error) {
      const message = getErrorMessage(error, "No se pudo cargar el listado de landings.");
      logger.error("load:error", { message });
      state.items = [];
      state.assignableComponents = [];
      state.componentsByLandingId = new Map();
      state.selectedComponentByLandingId = new Map();
      state.statusByLandingId = new Map();
      state.loadingByLandingId = new Map();
      state.editEnabledByLandingId = new Map();
      renderLandingList();
      screen.setLandingsStatus(`No se pudo cargar el listado: ${message}`);
    } finally {
      state.loading = false;
      screen.setLandingsLoading(false);
    }
  };

  const assignComponentToLanding = async ({ landingIdInput, componentIdInput }) => {
    const landingId = parsePositiveInteger(landingIdInput);
    const componentId = parsePositiveInteger(componentIdInput);
    const landingKey = String(landingId ?? "");

    if (!landingId) {
      return;
    }

    if (!componentId) {
      state.statusByLandingId.set(landingKey, "Seleccioná un componente válido para asociar.");
      renderLandingList();
      return;
    }

    const associatedComponents = Array.isArray(state.componentsByLandingId.get(landingKey))
      ? state.componentsByLandingId.get(landingKey)
      : [];
    const alreadyAssociated = associatedComponents.some(
      (component) => String(component?.id_componente ?? "") === String(componentId)
    );
    if (alreadyAssociated) {
      state.statusByLandingId.set(
        landingKey,
        `El componente #${componentId} ya está asociado a la landing #${landingId}.`
      );
      renderLandingList();
      return;
    }

    logger.info("association:submit", { landingId, componentId });
    state.loadingByLandingId.set(landingKey, true);
    state.statusByLandingId.set(landingKey, "Asociando componente...");
    renderLandingList();

    try {
      await landingManagementService.assignComponenteToLanding({
        id_landing: landingId,
        id_componente: componentId,
      });

      const components = await landingManagementService.listLandingComponentes(landingId);
      state.componentsByLandingId.set(landingKey, components);
      syncSelectedComponents();
      state.statusByLandingId.set(
        landingKey,
        `Componente #${componentId} asociado correctamente a la landing #${landingId}.`
      );
      state.editEnabledByLandingId.set(landingKey, false);
      screen.setLandingsStatus(
        `Componente #${componentId} asociado correctamente a la landing #${landingId}.`
      );
      logger.info("association:success", { landingId, componentId });
    } catch (error) {
      const message = getErrorMessage(
        error,
        "No se pudo asociar el componente a la landing."
      );
      logger.error("association:error", {
        landingId,
        componentId,
        message,
      });
      state.statusByLandingId.set(
        landingKey,
        `No se pudo asociar el componente: ${message}`
      );
    } finally {
      state.loadingByLandingId.set(landingKey, false);
      renderLandingList();
    }
  };

  const unassignComponentFromLanding = async ({ landingIdInput, componentIdInput }) => {
    const landingId = parsePositiveInteger(landingIdInput);
    const componentId = parsePositiveInteger(componentIdInput);
    const landingKey = String(landingId ?? "");

    if (!landingId || !componentId) {
      return;
    }

    logger.info("association:remove:submit", { landingId, componentId });
    state.loadingByLandingId.set(landingKey, true);
    state.statusByLandingId.set(landingKey, "Desasociando componente...");
    renderLandingList();

    try {
      await landingManagementService.unassignComponenteFromLanding({
        id_landing: landingId,
        id_componente: componentId,
      });

      const components = await landingManagementService.listLandingComponentes(landingId);
      state.componentsByLandingId.set(landingKey, components);
      syncSelectedComponents();
      state.statusByLandingId.set(
        landingKey,
        `Componente #${componentId} desasociado correctamente de la landing #${landingId}.`
      );
      state.editEnabledByLandingId.set(landingKey, false);
      screen.setLandingsStatus(
        `Componente #${componentId} desasociado correctamente de la landing #${landingId}.`
      );
      logger.info("association:remove:success", { landingId, componentId });
    } catch (error) {
      const message = getErrorMessage(
        error,
        "No se pudo desasociar el componente de la landing."
      );
      logger.error("association:remove:error", {
        landingId,
        componentId,
        message,
      });
      state.statusByLandingId.set(
        landingKey,
        `No se pudo desasociar el componente: ${message}`
      );
    } finally {
      state.loadingByLandingId.set(landingKey, false);
      renderLandingList();
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

    elements.landingListContainer.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-action='toggle-component-assignment']")
        : null;

      if (!trigger) {
        return;
      }

      const landingId = trigger.getAttribute("data-landing-id");
      if (!landingId) {
        return;
      }

      const currentEnabled = Boolean(state.editEnabledByLandingId.get(landingId));
      state.editEnabledByLandingId.set(landingId, !currentEnabled);
      state.statusByLandingId.set(
        landingId,
        !currentEnabled
          ? "Edición habilitada para asociar componentes."
          : ""
      );
      renderLandingList();
    });

    elements.landingListContainer.addEventListener("click", async (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-action='unassign-component']")
        : null;

      if (!trigger) {
        return;
      }

      const landingId = trigger.getAttribute("data-landing-id");
      const componentId = trigger.getAttribute("data-component-id");
      await unassignComponentFromLanding({
        landingIdInput: landingId,
        componentIdInput: componentId,
      });
    });

    elements.landingListContainer.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }

      if (target.getAttribute("data-action") !== "select-component-to-assign") {
        return;
      }

      const landingId = target.getAttribute("data-landing-id");
      if (!landingId) {
        return;
      }

      state.selectedComponentByLandingId.set(landingId, target.value);
    });

    elements.landingListContainer.addEventListener("submit", async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (form.getAttribute("data-action") !== "assign-component-form") {
        return;
      }

      event.preventDefault();
      const landingId = form.getAttribute("data-landing-id");
      const componentId = new FormData(form).get("id_componente");
      await assignComponentToLanding({
        landingIdInput: landingId,
        componentIdInput: componentId,
      });
    });
  };

  return {
    bind,
    load,
    reset,
  };
};
