import { HttpError } from "../../../shared/infrastructure/httpClient.js";
import { createLogger } from "../../../shared/infrastructure/logger.js";

const logger = createLogger("plansFeature");

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

const parsePositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const normalizeNullableText = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : null;
};

const normalizeNullableNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error("Los campos numéricos deben tener valores válidos.");
  }

  return parsed;
};

const buildSegmentKey = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized || "";
};

const buildEditableSnapshot = (plan) => ({
  segmento: normalizeNullableText(plan?.segmento),
  producto: normalizeNullableText(plan?.producto),
  bonete: normalizeNullableText(plan?.bonete),
  nombre: normalizeNullableText(plan?.nombre),
  nombre_plan: normalizeNullableText(plan?.nombre_plan),
  capacidad_plan: normalizeNullableText(plan?.capacidad_plan),
  capacidad: plan?.capacidad === null || plan?.capacidad === undefined ? null : Number(plan.capacidad),
  capacidad_anterior:
    plan?.capacidad_anterior === null || plan?.capacidad_anterior === undefined
      ? null
      : Number(plan.capacidad_anterior),
  precio_oferta:
    plan?.precio_oferta === null || plan?.precio_oferta === undefined
      ? null
      : Number(plan.precio_oferta),
  precio_full_price:
    plan?.precio_full_price === null || plan?.precio_full_price === undefined
      ? null
      : Number(plan.precio_full_price),
  precio_sin_iva:
    plan?.precio_sin_iva === null || plan?.precio_sin_iva === undefined
      ? null
      : Number(plan.precio_sin_iva),
  aumento: plan?.aumento === null || plan?.aumento === undefined ? null : Number(plan.aumento),
});

const buildPlanDraftFromFormData = (formData) => {
  const draft = {};

  for (const field of TEXT_FIELDS) {
    draft[field] = normalizeNullableText(formData.get(field));
  }

  for (const field of NUMBER_FIELDS) {
    draft[field] = normalizeNullableNumber(formData.get(field));
  }

  return draft;
};

const buildPlanChanges = (nextDraft, currentDraft) => {
  const changes = {};
  const fields = [...TEXT_FIELDS, ...NUMBER_FIELDS];

  for (const field of fields) {
    if (nextDraft[field] !== currentDraft[field]) {
      changes[field] = nextDraft[field];
    }
  }

  return changes;
};

const getErrorMessage = (error, fallbackMessage) =>
  error instanceof HttpError || error instanceof Error
    ? error.message
    : fallbackMessage;

export const createPlansFeature = ({
  elements,
  screen,
  planCatalogService,
  planManagementService,
}) => {
  const state = {
    items: [],
    loaded: false,
    loading: false,
    selectedSegmentKey: "",
    selectedPlanId: null,
    detail: null,
    detailLoading: false,
    detailRequestId: 0,
    editing: false,
    submitting: false,
  };

  const buildSegmentOptions = () => {
    const byKey = new Map();

    for (const plan of state.items) {
      const key = buildSegmentKey(plan?.segmento);
      if (!key || byKey.has(key)) {
        continue;
      }

      byKey.set(key, {
        key,
        label: String(plan?.segmento ?? "").trim(),
      });
    }

    return Array.from(byKey.values()).sort((left, right) =>
      left.label.localeCompare(right.label, "es", { sensitivity: "base" })
    );
  };

  const getFilteredItems = () => {
    if (!state.selectedSegmentKey) {
      return state.items;
    }

    return state.items.filter(
      (plan) => buildSegmentKey(plan?.segmento) === state.selectedSegmentKey
    );
  };

  const syncSegmentFilterFromDetail = () => {
    const nextKey = buildSegmentKey(state.detail?.segmento);
    if (!nextKey) {
      return;
    }

    state.selectedSegmentKey = nextKey;
  };

  const renderFilters = () => {
    screen.renderPlanSegmentFilterOptions({
      segmentos: buildSegmentOptions(),
      selectedSegmentKey: state.selectedSegmentKey,
    });
  };

  const ensureSelectedSegmentKey = () => {
    if (!state.selectedSegmentKey) {
      return;
    }

    const exists = state.items.some(
      (plan) => buildSegmentKey(plan?.segmento) === state.selectedSegmentKey
    );

    if (!exists) {
      state.selectedSegmentKey = "";
    }
  };

  const renderList = () => {
    screen.renderPlanList({
      planes: getFilteredItems(),
      selectedPlanId: state.selectedPlanId,
    });
  };

  const showListView = () => {
    state.editing = false;
    screen.showPlansListView();
    renderFilters();
    renderList();
  };

  const updateCatalogItem = (plan) => {
    const normalizedId = String(plan?.id_plan ?? "");
    const existingIndex = state.items.findIndex(
      (item) => String(item?.id_plan ?? "") === normalizedId
    );

    if (existingIndex === -1) {
      state.items = [plan, ...state.items];
      return;
    }

    state.items = state.items.map((item, index) => (index === existingIndex ? plan : item));
  };

  const loadDetail = async (planIdInput) => {
    const planId = parsePositiveInteger(planIdInput);
    if (!planId) {
      return;
    }

    const requestId = ++state.detailRequestId;
    state.selectedPlanId = planId;
    state.detailLoading = true;
    state.editing = false;
    screen.showPlanDetailView();
    screen.setPlanDetailStatus(`Cargando detalle del plan #${planId}...`);
    screen.clearPlanDetail("Cargando detalle del plan...");
    renderList();

    try {
      const plan = await planCatalogService.getPlanById(planId);
      if (requestId !== state.detailRequestId) {
        return;
      }

      state.detail = plan;
      updateCatalogItem(plan);
      syncSegmentFilterFromDetail();
      renderFilters();
      renderList();
      screen.renderPlanDetail({
        plan,
        editing: false,
      });
      screen.setPlanDetailStatus(`Detalle cargado para el plan #${planId}.`);
      logger.info("detail:load:success", { planId });
    } catch (error) {
      if (requestId !== state.detailRequestId) {
        return;
      }

      const message = getErrorMessage(error, "No se pudo cargar el detalle del plan.");
      logger.error("detail:load:error", { planId, message });
      state.detail = null;
      screen.clearPlanDetail(`No se pudo cargar el detalle del plan #${planId}.`);
      screen.setPlanDetailStatus(`No se pudo cargar el detalle: ${message}`);
    } finally {
      if (requestId === state.detailRequestId) {
        state.detailLoading = false;
      }
    }
  };

  const loadCatalog = async ({ force = false } = {}) => {
    if (state.loading) {
      logger.debug("catalog:skip-loading");
      return;
    }

    if (state.loaded && !force) {
      logger.debug("catalog:skip-cached", { count: state.items.length });
      renderFilters();
      renderList();
      screen.setPlansStatus(`Planes cargados: ${getFilteredItems().length}.`);
      return;
    }

    logger.info("catalog:load:start", { force });
    state.loading = true;
    screen.setPlansLoading(true);
    screen.setPlansStatus("Cargando planes...");

    try {
      const planes = await planCatalogService.listPlans();
      state.items = planes;
      state.loaded = true;
      ensureSelectedSegmentKey();
      renderFilters();
      renderList();
      screen.setPlansStatus(`Planes cargados: ${getFilteredItems().length}.`);
      logger.info("catalog:load:success", { count: planes.length });
    } catch (error) {
      const message = getErrorMessage(error, "No se pudo cargar el listado de planes.");
      logger.error("catalog:load:error", { message });
      state.items = [];
      ensureSelectedSegmentKey();
      renderFilters();
      renderList();
      screen.setPlansStatus(`No se pudo cargar el listado: ${message}`);
    } finally {
      state.loading = false;
      screen.setPlansLoading(false);
    }
  };

  const load = async ({ force = false } = {}) => {
    await loadCatalog({ force });

    if (state.selectedPlanId) {
      await loadDetail(state.selectedPlanId);
      return;
    }

    showListView();
  };

  const reset = () => {
    logger.debug("reset");
    state.items = [];
    state.loaded = false;
    state.loading = false;
    state.selectedSegmentKey = "";
    state.selectedPlanId = null;
    state.detail = null;
    state.detailLoading = false;
    state.detailRequestId = 0;
    state.editing = false;
    state.submitting = false;
    screen.showPlansListView();
    renderFilters();
    renderList();
    screen.setPlansStatus("");
    screen.setPlansLoading(false);
    screen.setPlanDetailStatus("");
    screen.clearPlanDetail();
  };

  const openContext = ({ planId = null } = {}) => {
    state.selectedPlanId = parsePositiveInteger(planId);
    state.detail = null;
    state.editing = false;

    if (!state.selectedPlanId) {
      showListView();
      return;
    }

    renderFilters();
    renderList();
  };

  const startEdit = () => {
    if (!state.detail || state.detailLoading || state.submitting) {
      return;
    }

    state.editing = true;
    screen.renderPlanDetail({
      plan: state.detail,
      editing: true,
    });
  };

  const cancelEdit = () => {
    if (!state.detail || state.submitting) {
      return;
    }

    state.editing = false;
    screen.renderPlanDetail({
      plan: state.detail,
      editing: false,
    });
  };

  const submitEdit = async (form) => {
    if (!state.detail || state.detailLoading || state.submitting) {
      return;
    }

    let nextDraft;
    try {
      nextDraft = buildPlanDraftFromFormData(new FormData(form));
    } catch (error) {
      screen.setPlanEditStatus(getErrorMessage(error, "No se pudieron validar los datos."));
      return;
    }

    const currentDraft = buildEditableSnapshot(state.detail);
    const changes = buildPlanChanges(nextDraft, currentDraft);
    if (Object.keys(changes).length === 0) {
      screen.setPlanEditStatus("No hay cambios para guardar.");
      return;
    }

    const planId = state.detail.id_plan;
    logger.info("edit:submit", { planId, changes });
    state.submitting = true;
    screen.setPlanEditLoading(true);
    screen.setPlanEditStatus("Guardando cambios...");

    try {
      const updated = await planManagementService.updatePlan({
        id_plan: planId,
        ...changes,
      });

      state.detail = updated;
      state.editing = false;
      updateCatalogItem(updated);
      syncSegmentFilterFromDetail();
      renderFilters();
      renderList();
      screen.renderPlanDetail({
        plan: updated,
        editing: false,
      });
      screen.setPlansStatus(`Plan actualizado correctamente: #${planId}.`);
      screen.setPlanDetailStatus(`Detalle actualizado para el plan #${planId}.`);
      screen.setResponse({
        status: "success",
        plan: updated,
      });
      logger.info("edit:success", { planId });
    } catch (error) {
      const message = getErrorMessage(error, "No se pudo actualizar el plan.");
      logger.error("edit:error", { planId, message });
      screen.setPlanEditStatus(`No se pudo actualizar el plan: ${message}`);
      screen.setResponse({
        status: "error",
        plan: {
          message,
        },
      });
    } finally {
      state.submitting = false;
      screen.setPlanEditLoading(false);
    }
  };

  const bind = () => {
    elements.loadPlansBtn.addEventListener("click", async () => {
      await loadCatalog({ force: true });
      if (state.selectedPlanId) {
        await loadDetail(state.selectedPlanId);
        return;
      }

      showListView();
    });

    elements.planSegmentFilter.addEventListener("change", (event) => {
      state.selectedSegmentKey = buildSegmentKey(event.target.value);
      renderFilters();
      renderList();
      screen.setPlansStatus(`Planes cargados: ${getFilteredItems().length}.`);
    });

    elements.planListContainer.addEventListener("click", async (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-action='view-plan-detail'][data-plan-id]")
        : null;

      if (!trigger) {
        return;
      }

      const planId = trigger.getAttribute("data-plan-id");
      await loadDetail(planId);
    });

    elements.planBackBtn.addEventListener("click", () => {
      state.editing = false;
      screen.setPlanDetailStatus("");
      showListView();
    });

    elements.planDetailContainer.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-action]")
        : null;

      if (!trigger) {
        return;
      }

      const action = trigger.getAttribute("data-action");
      if (action === "start-plan-edit") {
        startEdit();
        return;
      }

      if (action === "cancel-plan-edit") {
        cancelEdit();
      }
    });

    elements.planDetailContainer.addEventListener("submit", async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.id !== "planDetailEditForm") {
        return;
      }

      event.preventDefault();
      await submitEdit(form);
    });
  };

  return {
    bind,
    load,
    openContext,
    reset,
  };
};
