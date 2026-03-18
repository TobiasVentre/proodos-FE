import { HttpError } from "../../../shared/infrastructure/httpClient.js";
import { createLogger } from "../../../shared/infrastructure/logger.js";

const logger = createLogger("variationsFeature");

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const normalizeOptionalText = (value) => {
  const parsed = String(value ?? "").trim();
  return parsed ? parsed : null;
};

const normalizeRequiredText = (value, fieldName) => {
  const parsed = String(value ?? "").trim();
  if (!parsed) {
    throw new Error(`El campo ${fieldName} es obligatorio.`);
  }

  return parsed;
};

const buildVariationSnapshot = (variation) => ({
  id_tipo_componente: parsePositiveInteger(variation?.id_tipo_componente),
  nombre: String(variation?.nombre ?? "").trim(),
  descripcion: normalizeOptionalText(variation?.descripcion),
  html: normalizeOptionalText(variation?.html),
  css_url: normalizeOptionalText(variation?.css_url),
  js_url: normalizeOptionalText(variation?.js_url),
});

const buildVariationDraftFromFormData = (formData) => {
  const idTipoComponente = parsePositiveInteger(formData.get("id_tipo_componente"));
  if (!idTipoComponente) {
    throw new Error("Tenés que seleccionar un tipo de componente válido.");
  }

  return {
    id_tipo_componente: idTipoComponente,
    nombre: normalizeRequiredText(formData.get("nombre"), "nombre"),
    descripcion: normalizeOptionalText(formData.get("descripcion")),
    html: normalizeOptionalText(formData.get("html")),
    css_url: normalizeOptionalText(formData.get("css_url")),
    js_url: normalizeOptionalText(formData.get("js_url")),
  };
};

const buildVariationChanges = (nextDraft, currentDraft) => {
  const fields = [
    "id_tipo_componente",
    "nombre",
    "descripcion",
    "html",
    "css_url",
    "js_url",
  ];
  const changes = {};

  for (const field of fields) {
    if (nextDraft[field] !== currentDraft[field]) {
      changes[field] = nextDraft[field];
    }
  }

  return changes;
};

export const createVariationsFeature = ({
  elements,
  screen,
  variationCatalogService,
  variationManagementService,
}) => {
  const state = {
    itemsByFilter: new Map(),
    tiposComponente: [],
    selectedTipoComponenteId: null,
    focusedVariationId: null,
    filtersLoaded: false,
    filtersLoading: false,
    filtersLoadPromise: null,
    loading: false,
    createVisible: false,
    createSubmitting: false,
    createSelectedTipoComponenteId: null,
    editingVariationId: null,
    editSubmittingVariationId: null,
  };

  const getErrorMessage = (error, fallbackMessage) =>
    error instanceof HttpError || error instanceof Error
      ? error.message
      : fallbackMessage;

  const getFilterKey = () => String(state.selectedTipoComponenteId ?? "all");

  const getCurrentItems = () => state.itemsByFilter.get(getFilterKey()) ?? [];

  const setToolbarLoading = () => {
    screen.setVariationsLoading(
      state.filtersLoading ||
        state.loading ||
        state.createSubmitting ||
        state.editSubmittingVariationId !== null
    );
  };

  const syncCreateSelectedTipoComponenteId = () => {
    if (!Array.isArray(state.tiposComponente) || state.tiposComponente.length === 0) {
      state.createSelectedTipoComponenteId = null;
      return;
    }

    const hasSelectedCreateTipo = state.tiposComponente.some(
      (item) =>
        String(item?.id_tipo_componente ?? "") ===
        String(state.createSelectedTipoComponenteId ?? "")
    );
    if (hasSelectedCreateTipo) {
      return;
    }

    const hasSelectedFilterTipo = state.tiposComponente.some(
      (item) =>
        String(item?.id_tipo_componente ?? "") ===
        String(state.selectedTipoComponenteId ?? "")
    );

    state.createSelectedTipoComponenteId = hasSelectedFilterTipo
      ? state.selectedTipoComponenteId
      : parsePositiveInteger(state.tiposComponente[0]?.id_tipo_componente);
  };

  const renderFilters = () => {
    screen.renderVariationFilterOptions({
      tiposComponente: state.tiposComponente,
      selectedTipoComponenteId: state.selectedTipoComponenteId,
    });
  };

  const renderCreateForm = () => {
    syncCreateSelectedTipoComponenteId();
    screen.setVariationCreateVisible(state.createVisible);
    screen.renderVariationCreateFormOptions({
      tiposComponente: state.tiposComponente,
      selectedTipoComponenteId: state.createSelectedTipoComponenteId,
    });
  };

  const renderList = (variaciones = getCurrentItems()) => {
    const canKeepEditing =
      state.editingVariationId !== null &&
      variaciones.some(
        (variation) =>
          String(variation?.id_tipo_variacion ?? "") ===
          String(state.editingVariationId ?? "")
      );
    if (!canKeepEditing) {
      state.editingVariationId = null;
    }

    screen.renderVariationList({
      variaciones,
      tiposComponente: state.tiposComponente,
      editingVariationId: state.editingVariationId,
      focusedVariationId: state.focusedVariationId,
    });
  };

  const getSelectedTipoComponenteLabel = () => {
    if (!state.selectedTipoComponenteId) {
      return "todos los tipos";
    }

    const selected = state.tiposComponente.find(
      (item) =>
        String(item?.id_tipo_componente ?? "") === String(state.selectedTipoComponenteId)
    );

    if (!selected) {
      return `tipo #${state.selectedTipoComponenteId}`;
    }

    return `${selected.nombre ?? "Tipo"} (#${selected.id_tipo_componente})`;
  };

  const invalidateListCache = () => {
    state.itemsByFilter = new Map();
  };

  const closeCreateForm = () => {
    state.createVisible = false;
    screen.resetVariationCreateForm();
    screen.setVariationCreateVisible(false);
    screen.setVariationCreateStatus("");
    syncCreateSelectedTipoComponenteId();
    screen.renderVariationCreateFormOptions({
      tiposComponente: state.tiposComponente,
      selectedTipoComponenteId: state.createSelectedTipoComponenteId,
    });
    screen.setVariationCreateLoading(false);
  };

  const openCreateForm = async () => {
    try {
      await ensureFiltersLoaded();
    } catch {
      if (!state.filtersLoaded) {
        return;
      }
    }

    const canUseSelectedFilter = state.tiposComponente.some(
      (item) =>
        String(item?.id_tipo_componente ?? "") === String(state.selectedTipoComponenteId ?? "")
    );
    if (canUseSelectedFilter) {
      state.createSelectedTipoComponenteId = state.selectedTipoComponenteId;
    }

    state.createVisible = true;
    renderCreateForm();
    screen.setVariationCreateStatus("Completá los datos para crear la variación.");
  };

  const ensureFiltersLoaded = async () => {
    if (state.filtersLoaded) {
      renderFilters();
      renderCreateForm();
      return;
    }

    if (!state.filtersLoadPromise) {
      logger.info("filters:load:start");
      state.filtersLoading = true;
      setToolbarLoading();
      screen.setVariationsStatus("Cargando tipos de componente...");

      state.filtersLoadPromise = variationCatalogService
        .loadFilters()
        .then(({ tiposComponente }) => {
          state.tiposComponente = tiposComponente;
          state.filtersLoaded = true;
          syncCreateSelectedTipoComponenteId();
          renderFilters();
          renderCreateForm();
          logger.info("filters:load:success", { count: tiposComponente.length });
        })
        .catch((error) => {
          const message = getErrorMessage(
            error,
            "No se pudieron cargar los tipos de componente."
          );
          logger.error("filters:load:error", { message });
          renderFilters();
          renderCreateForm();
          screen.setVariationsStatus(`No se pudieron cargar los filtros: ${message}`);
          throw error;
        })
        .finally(() => {
          state.filtersLoading = false;
          state.filtersLoadPromise = null;
          setToolbarLoading();
        });
    }

    await state.filtersLoadPromise;
  };

  const reset = () => {
    logger.debug("reset");
    state.itemsByFilter = new Map();
    state.tiposComponente = [];
    state.selectedTipoComponenteId = null;
    state.focusedVariationId = null;
    state.filtersLoaded = false;
    state.filtersLoading = false;
    state.filtersLoadPromise = null;
    state.loading = false;
    state.createVisible = false;
    state.createSubmitting = false;
    state.createSelectedTipoComponenteId = null;
    state.editingVariationId = null;
    state.editSubmittingVariationId = null;
    renderFilters();
    renderCreateForm();
    screen.resetVariationCreateForm();
    screen.setVariationCreateVisible(false);
    screen.renderVariationList({
      variaciones: [],
      tiposComponente: [],
      editingVariationId: null,
      focusedVariationId: null,
    });
    screen.setVariationsStatus("");
    screen.setVariationCreateStatus("");
    screen.setVariationCreateLoading(false);
    setToolbarLoading();
  };

  const load = async ({ force = false } = {}) => {
    try {
      await ensureFiltersLoaded();
    } catch {
      if (!state.filtersLoaded) {
        return;
      }
    }

    if (state.loading) {
      logger.debug("load:skip-loading", {
        filterKey: getFilterKey(),
      });
      return;
    }

    const filterKey = getFilterKey();
    if (!force && state.itemsByFilter.has(filterKey)) {
      const cachedItems = state.itemsByFilter.get(filterKey) ?? [];
      logger.debug("load:skip-cached", {
        filterKey,
        count: cachedItems.length,
      });
      renderList(cachedItems);
      screen.setVariationsStatus(
        `Variaciones cargadas para ${getSelectedTipoComponenteLabel()}: ${cachedItems.length}.`
      );
      return;
    }

    logger.info("load:start", {
      force,
      filterKey,
      id_tipo_componente: state.selectedTipoComponenteId,
    });
    state.loading = true;
    setToolbarLoading();
    screen.setVariationsStatus(
      state.selectedTipoComponenteId
        ? `Cargando variaciones para ${getSelectedTipoComponenteLabel()}...`
        : "Cargando variaciones..."
    );

    try {
      const variaciones = await variationCatalogService.listVariations(
        state.selectedTipoComponenteId
      );
      state.itemsByFilter.set(filterKey, variaciones);
      logger.info("load:success", {
        filterKey,
        count: variaciones.length,
      });
      renderList(variaciones);
      screen.setVariationsStatus(
        `Variaciones cargadas para ${getSelectedTipoComponenteLabel()}: ${variaciones.length}.`
      );
    } catch (error) {
      const message = getErrorMessage(
        error,
        "No se pudo cargar el listado de variaciones."
      );
      logger.error("load:error", {
        filterKey,
        message,
      });
      if (!state.itemsByFilter.has(filterKey)) {
        renderList([]);
      }
      screen.setVariationsStatus(`No se pudo cargar el listado: ${message}`);
    } finally {
      state.loading = false;
      setToolbarLoading();
    }
  };

  const submitCreate = async () => {
    if (state.createSubmitting || state.loading || state.editSubmittingVariationId !== null) {
      return;
    }

    let payload;
    try {
      const formData = new FormData(elements.variationCreateForm);
      payload = buildVariationDraftFromFormData(formData);
    } catch (error) {
      screen.setVariationCreateStatus(
        getErrorMessage(error, "No se pudieron validar los datos de la variación.")
      );
      return;
    }

    state.createSelectedTipoComponenteId = payload.id_tipo_componente;
    logger.info("create:submit", payload);
    state.createSubmitting = true;
    setToolbarLoading();
    screen.setVariationCreateLoading(true);
    screen.setVariationCreateStatus("Creando variación...");

    try {
      const created = await variationManagementService.createVariation(payload);
      logger.info("create:success", {
        id_tipo_variacion: created?.id_tipo_variacion ?? null,
        nombre: created?.nombre ?? payload.nombre,
      });
      invalidateListCache();
      state.editingVariationId = null;
      await load({ force: true });
      closeCreateForm();
      screen.setVariationsStatus(
        `Variación creada correctamente: #${created?.id_tipo_variacion ?? "-"} ${created?.nombre ?? payload.nombre}.`
      );
      screen.setResponse({
        status: "success",
        variacion: created,
      });
    } catch (error) {
      const message = getErrorMessage(
        error,
        "No se pudo crear la variación."
      );
      logger.error("create:error", { message });
      screen.setVariationCreateStatus(`No se pudo crear la variación: ${message}`);
      screen.setResponse({
        status: "error",
        variacion: {
          message,
        },
      });
    } finally {
      state.createSubmitting = false;
      setToolbarLoading();
      screen.setVariationCreateLoading(false);
    }
  };

  const startEditVariation = (variationId) => {
    if (
      state.loading ||
      state.createSubmitting ||
      state.editSubmittingVariationId !== null
    ) {
      return;
    }

    state.editingVariationId = variationId;
    renderList();
    screen.setVariationEditStatus(
      variationId,
      "Editá los campos y guardá los cambios."
    );
  };

  const cancelEditVariation = () => {
    if (state.editSubmittingVariationId !== null) {
      return;
    }

    state.editingVariationId = null;
    renderList();
  };

  const submitEditVariation = async (form) => {
    if (
      state.loading ||
      state.createSubmitting ||
      state.editSubmittingVariationId !== null
    ) {
      return;
    }

    const variationId = parsePositiveInteger(form.dataset.variationId);
    if (!variationId) {
      return;
    }

    const currentVariation = getCurrentItems().find(
      (item) => String(item?.id_tipo_variacion ?? "") === String(variationId)
    );
    if (!currentVariation) {
      screen.setVariationEditStatus(
        variationId,
        "No se pudo encontrar la variación para editar."
      );
      return;
    }

    let nextDraft;
    try {
      nextDraft = buildVariationDraftFromFormData(new FormData(form));
    } catch (error) {
      screen.setVariationEditStatus(
        variationId,
        getErrorMessage(error, "No se pudieron validar los datos de la variación.")
      );
      return;
    }

    const currentDraft = buildVariationSnapshot(currentVariation);
    const changes = buildVariationChanges(nextDraft, currentDraft);
    if (Object.keys(changes).length === 0) {
      screen.setVariationEditStatus(variationId, "No hay cambios para guardar.");
      return;
    }

    logger.info("edit:submit", {
      id_tipo_variacion: variationId,
      changes,
    });
    state.editSubmittingVariationId = variationId;
    setToolbarLoading();
    screen.setVariationEditLoading(variationId, true);
    screen.setVariationEditStatus(variationId, "Guardando cambios...");

    try {
      const updated = await variationManagementService.updateVariation({
        id_tipo_variacion: variationId,
        ...changes,
      });
      logger.info("edit:success", {
        id_tipo_variacion: variationId,
      });
      state.editingVariationId = null;
      invalidateListCache();
      await load({ force: true });
      screen.setVariationsStatus(`Variación actualizada correctamente: #${variationId}.`);
      screen.setResponse({
        status: "success",
        variacion: updated,
      });
    } catch (error) {
      const message = getErrorMessage(
        error,
        "No se pudo actualizar la variación."
      );
      logger.error("edit:error", {
        id_tipo_variacion: variationId,
        message,
      });
      screen.setVariationEditStatus(
        variationId,
        `No se pudo actualizar la variación: ${message}`
      );
      screen.setResponse({
        status: "error",
        variacion: {
          message,
        },
      });
    } finally {
      state.editSubmittingVariationId = null;
      setToolbarLoading();
      screen.setVariationEditLoading(variationId, false);
    }
  };

  const bind = () => {
    elements.loadVariationsBtn.addEventListener("click", async () => {
      await load({ force: true });
    });

    elements.createVariationBtn.addEventListener("click", async () => {
      if (state.createVisible) {
        closeCreateForm();
        return;
      }

      await openCreateForm();
    });

    elements.variationCreateCancelBtn.addEventListener("click", () => {
      if (state.createSubmitting) {
        return;
      }

      closeCreateForm();
    });

    elements.variationCreateTipoComponenteSelect.addEventListener("change", (event) => {
      state.createSelectedTipoComponenteId = parsePositiveInteger(event.target.value);
    });

    elements.variationCreateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await submitCreate();
    });

    elements.variationTipoComponenteFilter.addEventListener("change", async (event) => {
      state.selectedTipoComponenteId = parsePositiveInteger(event.target.value);
      state.focusedVariationId = null;
      state.editingVariationId = null;
      renderFilters();
      renderCreateForm();
      await load();
    });

    elements.variationListContainer.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-action][data-variation-id]")
        : null;

      if (!trigger) {
        return;
      }

      const variationId = parsePositiveInteger(trigger.getAttribute("data-variation-id"));
      if (!variationId) {
        return;
      }

      const action = trigger.getAttribute("data-action");
      if (action === "edit-variation") {
        startEditVariation(variationId);
        return;
      }

      if (action === "cancel-variation-edit") {
        cancelEditVariation();
      }
    });

    elements.variationListContainer.addEventListener("submit", async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-variation-form")) {
        return;
      }

      event.preventDefault();
      await submitEditVariation(form);
    });
  };

  return {
    bind,
    load,
    openContext: ({
      tipoComponenteId = null,
      variationId = null,
    } = {}) => {
      state.selectedTipoComponenteId = parsePositiveInteger(tipoComponenteId);
      state.focusedVariationId = parsePositiveInteger(variationId);
      state.editingVariationId = null;
      renderFilters();
      renderCreateForm();
      renderList();
    },
    reset,
  };
};
