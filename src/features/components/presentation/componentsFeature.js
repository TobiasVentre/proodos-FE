import { HttpError } from "../../../shared/infrastructure/httpClient.js";
import { createLogger } from "../../../shared/infrastructure/logger.js";

const logger = createLogger("componentsFeature");

export const createComponentsFeature = ({
  elements,
  screen,
  componentCatalogService,
  componentManagementService,
  componentPreviewService,
  onOpenVariationCatalog = async () => {},
  onOpenPlanCatalog = async () => {},
  onOpenLandingCatalog = async () => {},
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

  const createState = {
    baseOptionsLoaded: false,
    baseOptionsLoading: false,
    submitting: false,
    tiposComponente: [],
    planes: [],
    variacionesByTipo: new Map(),
    selectedTipoComponenteId: null,
    selectedTipoVariacionId: null,
    selectedPlanId: null,
  };

  const editState = {
    requestId: 0,
    loading: false,
    componentId: null,
    tipoComponenteId: null,
    tiposVariacion: [],
    planes: [],
    selectedTipoVariacionId: null,
    selectedPlanId: null,
    originalTipoVariacionId: null,
    originalPlanId: null,
    landings: [],
    selectedLandingId: null,
    associatedLandingIds: [],
    landingEditEnabled: false,
    children: [],
    childComponents: [],
    selectedChildId: null,
    associatedChildIds: [],
    childEditEnabled: false,
    originalSelectorHijos: null,
    selectedSelectorHijos: null,
    tiposElemento: [],
    selectedTipoElementoId: null,
    elementEditEnabled: false,
    elementSelectorsById: new Map(),
    elementSelectorSubmittingIds: new Set(),
    variationSubmitting: false,
    planSubmitting: false,
    landingSubmitting: false,
    childSubmitting: false,
    selectorSubmitting: false,
    elementSubmitting: false,
  };

  const parsePositiveInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  };

  const parseNullablePositiveInteger = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    return parsePositiveInteger(value);
  };

  const getFirstValidId = (items, key) => {
    const candidate = Array.isArray(items) ? items[0]?.[key] : null;
    return parsePositiveInteger(candidate);
  };

  const setEditControlsLoading = () => {
    const loading =
      editState.loading ||
      editState.variationSubmitting ||
      editState.planSubmitting ||
      editState.landingSubmitting ||
      editState.childSubmitting ||
      editState.selectorSubmitting ||
      editState.elementSelectorSubmittingIds.size > 0 ||
      editState.elementSubmitting;
    screen.setComponentVariationEditLoading(loading);
    screen.setComponentPlanEditLoading(loading);
    screen.setComponentLandingAssignLoading(loading);
    screen.setComponentChildAssignLoading(loading);
    screen.setComponentChildrenSelectorEditLoading(loading);
    screen.setComponentElementCreateLoading(loading);
    editState.elementSelectorsById.forEach((_, elementId) => {
      screen.setComponentElementSelectorEditLoading(elementId, loading);
    });
  };

  const resetEditState = () => {
    editState.requestId += 1;
    editState.loading = false;
    editState.componentId = null;
    editState.tipoComponenteId = null;
    editState.tiposVariacion = [];
    editState.planes = [];
    editState.selectedTipoVariacionId = null;
    editState.selectedPlanId = null;
    editState.originalTipoVariacionId = null;
    editState.originalPlanId = null;
    editState.landings = [];
    editState.selectedLandingId = null;
    editState.associatedLandingIds = [];
    editState.landingEditEnabled = false;
    editState.children = [];
    editState.childComponents = [];
    editState.selectedChildId = null;
    editState.associatedChildIds = [];
    editState.childEditEnabled = false;
    editState.originalSelectorHijos = null;
    editState.selectedSelectorHijos = null;
    editState.tiposElemento = [];
    editState.selectedTipoElementoId = null;
    editState.elementEditEnabled = false;
    editState.elementSelectorsById = new Map();
    editState.elementSelectorSubmittingIds = new Set();
    editState.variationSubmitting = false;
    editState.planSubmitting = false;
    editState.landingSubmitting = false;
    editState.childSubmitting = false;
    editState.selectorSubmitting = false;
    editState.elementSubmitting = false;
    screen.renderComponentVariationEditOptions({
      tiposVariacion: [],
      selectedTipoVariacionId: null,
    });
    screen.renderComponentPlanEditOptions({
      planes: [],
      selectedPlanId: null,
    });
    screen.renderComponentLandingAssignOptions({
      landings: [],
      selectedLandingId: null,
    });
    screen.renderComponentChildAssignOptions({
      componentes: [],
      selectedChildId: null,
    });
    screen.renderComponentElementCreateOptions({
      tiposElemento: [],
      selectedTipoElementoId: null,
    });
    screen.setComponentVariationEditStatus("");
    screen.setComponentPlanEditStatus("");
    screen.setComponentLandingAssignStatus("");
    screen.setComponentChildAssignStatus("");
    screen.setComponentChildrenSelectorEditStatus("");
    screen.setComponentElementCreateStatus("");
    screen.setComponentLandingAssignVisible(false);
    screen.setComponentChildAssignVisible(false);
    screen.setComponentElementCreateVisible(false);
    setEditControlsLoading();
  };

  const renderEditForms = () => {
    screen.renderComponentVariationEditOptions({
      tiposVariacion: editState.tiposVariacion,
      selectedTipoVariacionId: editState.selectedTipoVariacionId,
    });
    screen.renderComponentPlanEditOptions({
      planes: editState.planes,
      selectedPlanId: editState.selectedPlanId,
    });
    screen.renderComponentLandingAssignOptions({
      landings: editState.landings,
      selectedLandingId: editState.selectedLandingId,
    });
    screen.renderComponentChildAssignOptions({
      componentes: editState.childComponents,
      selectedChildId: editState.selectedChildId,
    });
    screen.renderComponentElementCreateOptions({
      tiposElemento: editState.tiposElemento,
      selectedTipoElementoId: editState.selectedTipoElementoId,
    });
  };

  const showListView = ({ cancelPending = false } = {}) => {
    if (cancelPending) {
      detailState.requestId += 1;
      detailState.loading = false;
    }

    resetEditState();
    logger.debug("view:list", {
      selectedId: detailState.selectedId,
      cancelPending,
    });
    screen.showComponentsListView();
    screen.setComponentCreateLoading(false);
    screen.renderComponentList(catalogState.items, detailState.selectedId);
  };

  const getCurrentTipoVariaciones = () =>
    createState.variacionesByTipo.get(createState.selectedTipoComponenteId) ?? [];

  const renderCreateForm = () => {
    const availableVariaciones = getCurrentTipoVariaciones();
    const hasSelectedVariacion = availableVariaciones.some(
      (item) => String(item?.id_tipo_variacion ?? "") === String(createState.selectedTipoVariacionId ?? "")
    );
    if (!hasSelectedVariacion) {
      createState.selectedTipoVariacionId = getFirstValidId(
        availableVariaciones,
        "id_tipo_variacion"
      );
    }

    const hasSelectedPlan = createState.planes.some(
      (item) => String(item?.id_plan ?? "") === String(createState.selectedPlanId ?? "")
    );
    if (!hasSelectedPlan) {
      createState.selectedPlanId = getFirstValidId(createState.planes, "id_plan");
    }

    screen.renderComponentCreateFormOptions({
      tiposComponente: createState.tiposComponente,
      tiposVariacion: availableVariaciones,
      planes: createState.planes,
      selectedTipoComponenteId: createState.selectedTipoComponenteId,
      selectedTipoVariacionId: createState.selectedTipoVariacionId,
      selectedPlanId: createState.selectedPlanId,
    });
  };

  const loadVariacionesForSelectedTipo = async ({ force = false } = {}) => {
    const tipoComponenteId = createState.selectedTipoComponenteId;
    if (!tipoComponenteId) {
      createState.variacionesByTipo.set(null, []);
      renderCreateForm();
      return [];
    }

    if (!force && createState.variacionesByTipo.has(tipoComponenteId)) {
      renderCreateForm();
      return getCurrentTipoVariaciones();
    }

    const variaciones = await componentManagementService.listTiposVariacion(tipoComponenteId);
    createState.variacionesByTipo.set(tipoComponenteId, variaciones);
    renderCreateForm();
    return variaciones;
  };

  const loadCreateBaseOptions = async () => {
    if (createState.baseOptionsLoading) {
      logger.debug("create:base-options:skip-loading");
      return;
    }

    if (createState.baseOptionsLoaded) {
      return;
    }

    logger.info("create:base-options:start");
    createState.baseOptionsLoading = true;
    screen.setComponentCreateLoading(true);
    screen.setComponentCreateStatus("Cargando datos del formulario...");

    try {
      const { tiposComponente, planes } = await componentManagementService.loadCreateFormData();
      createState.tiposComponente = tiposComponente;
      createState.planes = planes;
      createState.baseOptionsLoaded = true;
      createState.selectedTipoComponenteId = getFirstValidId(
        tiposComponente,
        "id_tipo_componente"
      );
      createState.selectedPlanId = getFirstValidId(planes, "id_plan");
      await loadVariacionesForSelectedTipo({ force: true });
      logger.info("create:base-options:success", {
        tiposComponente: tiposComponente.length,
        planes: planes.length,
      });
      screen.setComponentCreateStatus(
        "Completá los datos requeridos para crear el componente."
      );
    } catch (error) {
      const message =
        error instanceof HttpError || error instanceof Error
          ? error.message
          : "No se pudieron cargar los datos del formulario.";
      logger.error("create:base-options:error", { message });
      screen.setComponentCreateStatus(`No se pudieron cargar los datos del formulario: ${message}`);
      renderCreateForm();
    } finally {
      createState.baseOptionsLoading = false;
      screen.setComponentCreateLoading(false);
    }
  };

  const openCreateView = async () => {
    resetEditState();
    logger.info("view:create");
    screen.showComponentCreateView();
    await loadCreateBaseOptions();
    renderCreateForm();
  };

  const syncEditStateFromDetail = (detail) => {
    const component = detail?.component ?? null;

    editState.requestId += 1;
    editState.loading = true;
    editState.variationSubmitting = false;
    editState.planSubmitting = false;
    editState.componentId = parsePositiveInteger(component?.id_componente);
    editState.tipoComponenteId = parsePositiveInteger(component?.id_tipo_componente);
    editState.tiposVariacion = [];
    editState.planes = [];
    editState.originalTipoVariacionId = parsePositiveInteger(component?.id_tipo_variacion);
    editState.originalPlanId = parseNullablePositiveInteger(component?.id_plan);
    editState.selectedTipoVariacionId = editState.originalTipoVariacionId;
    editState.selectedPlanId = editState.originalPlanId;
    editState.landings = [];
    editState.selectedLandingId = null;
    editState.associatedLandingIds = Array.isArray(detail?.landings)
      ? detail.landings
          .map((landing) => parsePositiveInteger(landing?.id_landing))
          .filter(Boolean)
      : [];
    editState.landingEditEnabled = false;
    editState.children = Array.isArray(detail?.children) ? detail.children : [];
    editState.childComponents = [];
    editState.selectedChildId = null;
    editState.associatedChildIds = Array.isArray(detail?.children)
      ? detail.children
          .map((child) => parsePositiveInteger(child?.id_componente))
          .filter(Boolean)
      : [];
    editState.childEditEnabled = false;
    editState.originalSelectorHijos = String(component?.selector_hijos ?? "").trim() || null;
    editState.selectedSelectorHijos = editState.originalSelectorHijos;
    editState.tiposElemento = [];
    editState.selectedTipoElementoId = null;
    editState.elementEditEnabled = false;
    editState.elementSelectorsById = new Map(
      Array.isArray(detail?.elementos)
        ? detail.elementos
            .map((elemento) => [
              parsePositiveInteger(elemento?.id_elemento),
              String(elemento?.selector ?? "").trim() || null,
            ])
            .filter(([elementId]) => Boolean(elementId))
        : []
    );
    renderEditForms();
    screen.setComponentVariationEditStatus("Cargando opciones de edición...");
    screen.setComponentPlanEditStatus("Cargando opciones de edición...");
    screen.setComponentLandingAssignStatus("Cargando opciones de edición...");
    screen.setComponentChildAssignStatus("Cargando opciones de edición...");
    screen.setComponentChildrenSelectorEditStatus("Cargando opciones de edición...");
    screen.setComponentElementCreateStatus("Cargando opciones de edición...");
    setEditControlsLoading();

    return editState.requestId;
  };

  const loadEditOptions = async ({ detail, detailRequestId, editRequestId }) => {
    const componentId = parsePositiveInteger(detail?.component?.id_componente);
    const tipoComponenteId = parsePositiveInteger(detail?.component?.id_tipo_componente);
    if (!componentId || !tipoComponenteId) {
      logger.warn("edit:options:skip-invalid-detail", {
        componentId: detail?.component?.id_componente ?? null,
        tipoComponenteId: detail?.component?.id_tipo_componente ?? null,
      });
      editState.loading = false;
      setEditControlsLoading();
      screen.setComponentVariationEditStatus("No se pudieron preparar las opciones de edición.");
      screen.setComponentPlanEditStatus("No se pudieron preparar las opciones de edición.");
      return;
    }

    try {
      const [tiposVariacion, planes, landings, componentes, tiposElemento] = await Promise.all([
        componentManagementService.listTiposVariacion(tipoComponenteId),
        componentManagementService.listPlanes(),
        componentManagementService.listLandings(),
        componentCatalogService.listComponentes(),
        componentManagementService.listTiposElemento(),
      ]);

      if (
        detailRequestId !== detailState.requestId ||
        editRequestId !== editState.requestId ||
        componentId !== editState.componentId
      ) {
        logger.debug("edit:options:skip-stale-response", {
          componentId,
          detailRequestId,
          editRequestId,
        });
        return;
      }

      editState.tiposVariacion = tiposVariacion;
      editState.planes = planes;
      editState.landings = Array.isArray(landings)
        ? landings.filter(
            (landing) =>
              !editState.associatedLandingIds.includes(
                parsePositiveInteger(landing?.id_landing)
              )
          )
        : [];
      editState.childComponents = Array.isArray(componentes)
        ? componentes.filter((candidate) => {
            const candidateId = parsePositiveInteger(candidate?.id_componente);
            if (!candidateId) {
              return false;
            }

            if (candidateId === componentId) {
              return false;
            }

            return !editState.associatedChildIds.includes(candidateId);
          })
        : [];
      editState.tiposElemento = Array.isArray(tiposElemento) ? tiposElemento : [];

      const hasSelectedVariacion = tiposVariacion.some(
        (item) =>
          String(item?.id_tipo_variacion ?? "") === String(editState.selectedTipoVariacionId ?? "")
      );
      if (!hasSelectedVariacion) {
        editState.selectedTipoVariacionId = getFirstValidId(
          tiposVariacion,
          "id_tipo_variacion"
        );
      }

      const hasSelectedPlan =
        editState.selectedPlanId === null ||
        planes.some((item) => String(item?.id_plan ?? "") === String(editState.selectedPlanId));
      if (!hasSelectedPlan) {
        editState.selectedPlanId = null;
      }

      const hasSelectedLanding = editState.landings.some(
        (landing) => String(landing?.id_landing ?? "") === String(editState.selectedLandingId ?? "")
      );
      if (!hasSelectedLanding) {
        editState.selectedLandingId = getFirstValidId(editState.landings, "id_landing");
      }

      const hasSelectedChild = editState.childComponents.some(
        (child) => String(child?.id_componente ?? "") === String(editState.selectedChildId ?? "")
      );
      if (!hasSelectedChild) {
        editState.selectedChildId = getFirstValidId(editState.childComponents, "id_componente");
      }

      const hasSelectedTipoElemento = editState.tiposElemento.some(
        (item) =>
          String(item?.id_tipo_elemento ?? "") === String(editState.selectedTipoElementoId ?? "")
      );
      if (!hasSelectedTipoElemento) {
        editState.selectedTipoElementoId = getFirstValidId(
          editState.tiposElemento,
          "id_tipo_elemento"
        );
      }

      renderEditForms();
      screen.setComponentVariationEditStatus(
        "Elegí una variación y guardá este bloque."
      );
      screen.setComponentPlanEditStatus(
        "Elegí un plan o quitá el actual desde este bloque."
      );
      screen.setComponentLandingAssignStatus(
        editState.landings.length
          ? "Elegí una landing y asociá este componente desde este bloque."
          : "No hay landings disponibles para asociar."
      );
      screen.setComponentChildAssignStatus(
        editState.childComponents.length
          ? "Elegí un componente y agregalo como hijo desde este bloque."
          : "No hay componentes disponibles para asociar como hijos."
      );
      screen.setComponentChildrenSelectorEditStatus(
        editState.selectedSelectorHijos
          ? `Selector actual: ${editState.selectedSelectorHijos}`
          : "No hay selector de hijos configurado."
      );
      screen.setComponentElementCreateStatus(
        editState.tiposElemento.length
          ? "Completá los datos requeridos para crear un elemento asociado."
          : "No hay tipos de elemento disponibles para crear elementos."
      );
      logger.info("edit:options:success", {
        componentId,
        variaciones: tiposVariacion.length,
        planes: planes.length,
        landings: editState.landings.length,
        childComponents: editState.childComponents.length,
        tiposElemento: editState.tiposElemento.length,
      });
    } catch (error) {
      if (
        detailRequestId !== detailState.requestId ||
        editRequestId !== editState.requestId ||
        componentId !== editState.componentId
      ) {
        return;
      }

      const message =
        error instanceof HttpError || error instanceof Error
          ? error.message
          : "No se pudieron cargar las opciones de edición.";
      logger.error("edit:options:error", { componentId, message });
      renderEditForms();
      screen.setComponentVariationEditStatus(
        `No se pudieron cargar las opciones de edición: ${message}`
      );
      screen.setComponentPlanEditStatus(
        `No se pudieron cargar las opciones de edición: ${message}`
      );
      screen.setComponentLandingAssignStatus(
        `No se pudieron cargar las opciones de edición: ${message}`
      );
      screen.setComponentChildAssignStatus(
        `No se pudieron cargar las opciones de edición: ${message}`
      );
      screen.setComponentChildrenSelectorEditStatus(
        `No se pudieron cargar las opciones de edición: ${message}`
      );
      screen.setComponentElementCreateStatus(
        `No se pudieron cargar las opciones de edición: ${message}`
      );
    } finally {
      if (
        detailRequestId === detailState.requestId &&
        editRequestId === editState.requestId &&
        componentId === editState.componentId
      ) {
        editState.loading = false;
        setEditControlsLoading();
      }
    }
  };

  const getUpdateErrorMessage = (error, fallbackMessage) =>
    error instanceof HttpError || error instanceof Error
      ? error.message
      : fallbackMessage;

  const getActiveEditComponentId = () => parsePositiveInteger(detailState.selectedId);

  const refreshComponentAfterEdit = async ({ componentId, updated, successMessage }) => {
    await load({ force: true });
    await loadDetail(componentId);
    screen.setComponentsStatus(successMessage);
    screen.setResponse({
      status: "success",
      componente: updated,
    });
  };

  const submitVariationEdit = async (nextTipoVariacionId) => {
    if (
      detailState.loading ||
      editState.loading ||
      editState.variationSubmitting ||
      editState.planSubmitting ||
      editState.landingSubmitting ||
      editState.childSubmitting ||
      editState.selectorSubmitting ||
      editState.elementSelectorSubmittingIds.size > 0 ||
      editState.elementSubmitting
    ) {
      return;
    }

    const componentId = getActiveEditComponentId();
    if (!componentId) {
      screen.setComponentVariationEditStatus("No hay un componente activo para actualizar.");
      return;
    }

    editState.selectedTipoVariacionId = nextTipoVariacionId;
    if (!nextTipoVariacionId) {
      screen.setComponentVariationEditStatus("Tenés que seleccionar una variación válida.");
      return;
    }

    if (nextTipoVariacionId === editState.originalTipoVariacionId) {
      screen.setComponentVariationEditStatus("No hay cambios para guardar.");
      return;
    }

    logger.info("edit:variation:submit", {
      componentId,
      id_tipo_variacion: nextTipoVariacionId,
    });
    editState.variationSubmitting = true;
    setEditControlsLoading();
    screen.setComponentVariationEditStatus("Guardando variación...");

    try {
      const updated = await componentManagementService.updateComponenteRelations({
        id_componente: componentId,
        id_tipo_variacion: nextTipoVariacionId,
      });
      logger.info("edit:variation:success", {
        componentId,
        id_tipo_variacion: updated?.id_tipo_variacion ?? nextTipoVariacionId,
      });
      await refreshComponentAfterEdit({
        componentId,
        updated,
        successMessage: `Variación actualizada correctamente para el componente #${componentId}.`,
      });
    } catch (error) {
      const message = getUpdateErrorMessage(
        error,
        "No se pudo actualizar la variación del componente."
      );
      logger.error("edit:variation:error", { componentId, message });
      screen.setComponentVariationEditStatus(`No se pudo actualizar la variación: ${message}`);
      screen.setResponse({
        status: "error",
        componente: {
          message,
        },
      });
    } finally {
      editState.variationSubmitting = false;
      setEditControlsLoading();
    }
  };

  const submitPlanEdit = async (nextPlanId) => {
    if (
      detailState.loading ||
      editState.loading ||
      editState.variationSubmitting ||
      editState.planSubmitting ||
      editState.landingSubmitting ||
      editState.childSubmitting ||
      editState.selectorSubmitting ||
      editState.elementSelectorSubmittingIds.size > 0 ||
      editState.elementSubmitting
    ) {
      return;
    }

    const componentId = getActiveEditComponentId();
    if (!componentId) {
      screen.setComponentPlanEditStatus("No hay un componente activo para actualizar.");
      return;
    }

    editState.selectedPlanId = nextPlanId;
    if (nextPlanId === editState.originalPlanId) {
      screen.setComponentPlanEditStatus(
        nextPlanId === null
          ? "El componente ya no tiene un plan asociado."
          : "No hay cambios para guardar."
      );
      return;
    }

    const removingPlan = nextPlanId === null;
    logger.info("edit:plan:submit", {
      componentId,
      id_plan: nextPlanId,
    });
    editState.planSubmitting = true;
    setEditControlsLoading();
    screen.setComponentPlanEditStatus(
      removingPlan ? "Quitando plan..." : "Guardando plan..."
    );

    try {
      const updated = await componentManagementService.updateComponenteRelations({
        id_componente: componentId,
        id_plan: nextPlanId,
      });
      logger.info("edit:plan:success", {
        componentId,
        id_plan: updated?.id_plan ?? nextPlanId,
      });
      await refreshComponentAfterEdit({
        componentId,
        updated,
        successMessage: removingPlan
          ? `Plan quitado correctamente del componente #${componentId}.`
          : `Plan actualizado correctamente para el componente #${componentId}.`,
      });
    } catch (error) {
      const message = getUpdateErrorMessage(
        error,
        "No se pudo actualizar el plan del componente."
      );
      logger.error("edit:plan:error", { componentId, message });
      screen.setComponentPlanEditStatus(`No se pudo actualizar el plan: ${message}`);
      screen.setResponse({
        status: "error",
        componente: {
          message,
        },
      });
    } finally {
      editState.planSubmitting = false;
      setEditControlsLoading();
    }
  };

  const submitLandingAssign = async (nextLandingId) => {
    if (
      detailState.loading ||
      editState.loading ||
      editState.variationSubmitting ||
      editState.planSubmitting ||
      editState.landingSubmitting ||
      editState.childSubmitting ||
      editState.selectorSubmitting ||
      editState.elementSelectorSubmittingIds.size > 0 ||
      editState.elementSubmitting
    ) {
      return;
    }

    const componentId = getActiveEditComponentId();
    if (!componentId) {
      screen.setComponentLandingAssignStatus("No hay un componente activo para actualizar.");
      return;
    }

    editState.selectedLandingId = nextLandingId;
    if (!nextLandingId) {
      screen.setComponentLandingAssignStatus("Tenés que seleccionar una landing válida.");
      return;
    }

    if (editState.associatedLandingIds.includes(nextLandingId)) {
      screen.setComponentLandingAssignStatus(
        `El componente ya está asociado a la landing #${nextLandingId}.`
      );
      return;
    }

    logger.info("edit:landing:submit", {
      componentId,
      id_landing: nextLandingId,
    });
    editState.landingSubmitting = true;
    setEditControlsLoading();
    screen.setComponentLandingAssignStatus("Asociando landing...");

    try {
      const relation = await componentManagementService.assignComponenteToLanding({
        id_componente: componentId,
        id_landing: nextLandingId,
      });
      logger.info("edit:landing:success", {
        componentId,
        id_landing: nextLandingId,
      });
      editState.landingEditEnabled = false;
      screen.setComponentLandingAssignVisible(false);
      await refreshComponentAfterEdit({
        componentId,
        updated: relation,
        successMessage: `Componente #${componentId} asociado correctamente a la landing #${nextLandingId}.`,
      });
    } catch (error) {
      const message = getUpdateErrorMessage(
        error,
        "No se pudo asociar el componente a la landing."
      );
      logger.error("edit:landing:error", { componentId, id_landing: nextLandingId, message });
      screen.setComponentLandingAssignStatus(`No se pudo asociar la landing: ${message}`);
      screen.setResponse({
        status: "error",
        componente: {
          message,
        },
      });
    } finally {
      editState.landingSubmitting = false;
      setEditControlsLoading();
    }
  };

  const submitLandingUnassign = async (landingIdToRemove) => {
    if (
      detailState.loading ||
      editState.loading ||
      editState.variationSubmitting ||
      editState.planSubmitting ||
      editState.landingSubmitting ||
      editState.childSubmitting ||
      editState.selectorSubmitting ||
      editState.elementSelectorSubmittingIds.size > 0 ||
      editState.elementSubmitting
    ) {
      return;
    }

    const componentId = getActiveEditComponentId();
    if (!componentId) {
      screen.setComponentLandingAssignStatus("No hay un componente activo para actualizar.");
      return;
    }

    if (!landingIdToRemove) {
      screen.setComponentLandingAssignStatus("No se pudo identificar la landing a desasociar.");
      return;
    }

    logger.info("edit:landing:remove:submit", {
      componentId,
      id_landing: landingIdToRemove,
    });
    editState.landingSubmitting = true;
    setEditControlsLoading();
    screen.setComponentLandingAssignStatus("Desasociando landing...");

    try {
      const relation = await componentManagementService.unassignComponenteFromLanding({
        id_componente: componentId,
        id_landing: landingIdToRemove,
      });
      logger.info("edit:landing:remove:success", {
        componentId,
        id_landing: landingIdToRemove,
      });
      editState.landingEditEnabled = false;
      screen.setComponentLandingAssignVisible(false);
      await refreshComponentAfterEdit({
        componentId,
        updated: relation,
        successMessage: `Landing #${landingIdToRemove} desasociada correctamente del componente #${componentId}.`,
      });
    } catch (error) {
      const message = getUpdateErrorMessage(
        error,
        "No se pudo desasociar la landing del componente."
      );
      logger.error("edit:landing:remove:error", {
        componentId,
        id_landing: landingIdToRemove,
        message,
      });
      screen.setComponentLandingAssignStatus(`No se pudo desasociar la landing: ${message}`);
      screen.setResponse({
        status: "error",
        componente: {
          message,
        },
      });
    } finally {
      editState.landingSubmitting = false;
      setEditControlsLoading();
    }
  };

  const reset = () => {
    logger.debug("reset");
    catalogState.items = [];
    catalogState.loaded = false;
    catalogState.loading = false;
    detailState.selectedId = null;
    detailState.loading = false;
    detailState.requestId = 0;
    createState.baseOptionsLoaded = false;
    createState.baseOptionsLoading = false;
    createState.submitting = false;
    createState.tiposComponente = [];
    createState.planes = [];
    createState.variacionesByTipo = new Map();
    createState.selectedTipoComponenteId = null;
    createState.selectedTipoVariacionId = null;
    createState.selectedPlanId = null;
    resetEditState();
    screen.showComponentsListView();
    screen.renderComponentList([], null);
    screen.setComponentsStatus("");
    screen.setComponentsLoading(false);
    screen.setComponentDetailStatus("");
    screen.clearComponentDetail();
    screen.resetComponentCreateForm();
    screen.setComponentCreateStatus("");
    screen.renderComponentCreateFormOptions({
      tiposComponente: [],
      tiposVariacion: [],
      planes: [],
    });
    screen.setComponentCreateLoading(false);
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
        resetEditState();
        screen.showComponentsListView();
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
    resetEditState();
    screen.showComponentDetailView();
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
      const editRequestId = syncEditStateFromDetail(detail);
      void loadEditOptions({
        detail,
        detailRequestId: requestId,
        editRequestId,
      });
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
      resetEditState();
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

    elements.createComponentBtn.addEventListener("click", async () => {
      await openCreateView();
    });

    elements.componentBackBtn.addEventListener("click", () => {
      showListView({ cancelPending: true });
    });

    elements.componentCreateBackBtn.addEventListener("click", () => {
      showListView({ cancelPending: false });
    });

    elements.componentCreateTipoComponenteSelect.addEventListener("change", async (event) => {
      const nextTipoComponenteId = parsePositiveInteger(event.target.value);
      createState.selectedTipoComponenteId = nextTipoComponenteId;
      createState.selectedTipoVariacionId = null;
      screen.setComponentCreateStatus("Cargando variaciones disponibles...");

      try {
        await loadVariacionesForSelectedTipo({ force: true });
        screen.setComponentCreateStatus(
          "Completá los datos requeridos para crear el componente."
        );
      } catch (error) {
        const message =
          error instanceof HttpError || error instanceof Error
            ? error.message
            : "No se pudieron cargar las variaciones.";
        logger.error("create:variations:error", {
          tipoComponenteId: nextTipoComponenteId,
          message,
        });
        screen.setComponentCreateStatus(`No se pudieron cargar las variaciones: ${message}`);
        renderCreateForm();
      }
    });

    elements.componentCreateTipoVariacionSelect.addEventListener("change", (event) => {
      createState.selectedTipoVariacionId = parsePositiveInteger(event.target.value);
    });

    elements.componentCreatePlanSelect.addEventListener("change", (event) => {
      createState.selectedPlanId = parsePositiveInteger(event.target.value);
    });

    elements.componentCreateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (createState.submitting) {
        return;
      }

      const formData = new FormData(elements.componentCreateForm);
      const payload = {
        nombre: String(formData.get("nombre") || ""),
        id_tipo_componente: parsePositiveInteger(
          formData.get("id_tipo_componente")
        ),
        id_tipo_variacion: parsePositiveInteger(
          formData.get("id_tipo_variacion")
        ),
        id_plan: parsePositiveInteger(formData.get("id_plan")),
      };

      logger.info("create:submit", {
        nombre: payload.nombre,
        id_tipo_componente: payload.id_tipo_componente,
        id_tipo_variacion: payload.id_tipo_variacion,
        id_plan: payload.id_plan,
      });

      createState.submitting = true;
      screen.setComponentCreateLoading(true);
      screen.setComponentCreateStatus("Creando componente...");

      try {
        const created = await componentManagementService.createComponente(payload);
        logger.info("create:success", {
          id_componente: created?.id_componente ?? null,
          nombre: created?.nombre ?? payload.nombre,
        });
        screen.resetComponentCreateForm();
        createState.selectedTipoComponenteId = getFirstValidId(
          createState.tiposComponente,
          "id_tipo_componente"
        );
        createState.selectedPlanId = getFirstValidId(createState.planes, "id_plan");
        createState.selectedTipoVariacionId = null;
        await loadVariacionesForSelectedTipo();
        await load({ force: true });
        showListView({ cancelPending: false });
        screen.setComponentsStatus(
          `Componente creado correctamente: #${created?.id_componente ?? "-"} ${created?.nombre ?? payload.nombre}.`
        );
        screen.setResponse({
          status: "success",
          componente: created,
        });
      } catch (error) {
        const message =
          error instanceof HttpError || error instanceof Error
            ? error.message
            : "No se pudo crear el componente.";
        logger.error("create:error", { message });
        screen.setComponentCreateStatus(`No se pudo crear el componente: ${message}`);
        screen.setResponse({
          status: "error",
          componente: {
            message,
          },
        });
      } finally {
        createState.submitting = false;
        screen.setComponentCreateLoading(false);
        renderCreateForm();
      }
    });

    elements.componentDetailContainer.addEventListener("change", (event) => {
      if (!(event.target instanceof HTMLSelectElement)) {
        return;
      }

      if (event.target.id === "componentVariationEditSelect") {
        editState.selectedTipoVariacionId = parsePositiveInteger(event.target.value);
        screen.setComponentVariationEditStatus(
          "La variación se actualizará cuando guardes este bloque."
        );
        return;
      }

      if (event.target.id === "componentPlanEditSelect") {
        editState.selectedPlanId = parseNullablePositiveInteger(event.target.value);
        screen.setComponentPlanEditStatus(
          editState.selectedPlanId === null
            ? "El plan se quitará cuando guardes este bloque."
            : "El plan se actualizará cuando guardes este bloque."
        );
        return;
      }

      if (event.target.id === "componentLandingAssignSelect") {
        editState.selectedLandingId = parsePositiveInteger(event.target.value);
        screen.setComponentLandingAssignStatus(
          editState.selectedLandingId === null
            ? "Seleccioná una landing para asociar el componente."
            : "La landing se asociará cuando guardes este bloque."
        );
        return;
      }

      if (event.target.id === "componentChildAssignSelect") {
        editState.selectedChildId = parsePositiveInteger(event.target.value);
        screen.setComponentChildAssignStatus(
          editState.selectedChildId === null
            ? "Seleccioná un componente válido para asociar como hijo."
            : "El componente hijo se asociará cuando guardes este bloque."
        );
        return;
      }

      if (event.target.id === "componentElementCreateTipoElementoSelect") {
        editState.selectedTipoElementoId = parsePositiveInteger(event.target.value);
        screen.setComponentElementCreateStatus(
          editState.selectedTipoElementoId === null
            ? "Seleccioná un tipo de elemento válido."
            : "El elemento se creará con el tipo seleccionado."
        );
      }
    });

    const submitChildAssign = async (nextChildId) => {
      if (
        detailState.loading ||
        editState.loading ||
        editState.variationSubmitting ||
      editState.planSubmitting ||
      editState.landingSubmitting ||
      editState.childSubmitting ||
      editState.selectorSubmitting ||
      editState.elementSelectorSubmittingIds.size > 0 ||
      editState.elementSubmitting
      ) {
        return;
      }

      const componentId = getActiveEditComponentId();
      if (!componentId) {
        screen.setComponentChildAssignStatus("No hay un componente activo para actualizar.");
        return;
      }

      editState.selectedChildId = nextChildId;
      if (!nextChildId) {
        screen.setComponentChildAssignStatus("Tenés que seleccionar un componente válido.");
        return;
      }

      if (editState.associatedChildIds.includes(nextChildId)) {
        screen.setComponentChildAssignStatus(
          `El componente #${nextChildId} ya está asociado como hijo.`
        );
        return;
      }

      logger.info("edit:child:submit", {
        id_padre: componentId,
        id_hijo: nextChildId,
      });
      editState.childSubmitting = true;
      setEditControlsLoading();
      screen.setComponentChildAssignStatus("Asociando componente hijo...");

      try {
        const relation = await componentManagementService.assignComponenteHijo({
          id_padre: componentId,
          id_hijo: nextChildId,
        });
        logger.info("edit:child:success", {
          id_padre: componentId,
          id_hijo: nextChildId,
        });
        editState.childEditEnabled = false;
        screen.setComponentChildAssignVisible(false);
        await refreshComponentAfterEdit({
          componentId,
          updated: relation,
          successMessage: `Componente #${nextChildId} asociado correctamente como hijo de #${componentId}.`,
        });
      } catch (error) {
        const message = getUpdateErrorMessage(
          error,
          "No se pudo asociar el componente hijo."
        );
        logger.error("edit:child:error", {
          id_padre: componentId,
          id_hijo: nextChildId,
          message,
        });
        screen.setComponentChildAssignStatus(`No se pudo asociar el hijo: ${message}`);
        screen.setResponse({
          status: "error",
          componente: {
            message,
          },
        });
      } finally {
        editState.childSubmitting = false;
        setEditControlsLoading();
      }
    };

    const submitChildrenSelectorEdit = async (nextSelectorHijos) => {
      if (
        detailState.loading ||
        editState.loading ||
        editState.variationSubmitting ||
        editState.planSubmitting ||
        editState.landingSubmitting ||
        editState.childSubmitting ||
        editState.selectorSubmitting ||
        editState.elementSelectorSubmittingIds.size > 0 ||
        editState.elementSubmitting
      ) {
        return;
      }

      const componentId = getActiveEditComponentId();
      if (!componentId) {
        screen.setComponentChildrenSelectorEditStatus(
          "No hay un componente activo para actualizar."
        );
        return;
      }

      const normalizedSelector = String(nextSelectorHijos ?? "").trim() || null;
      if (normalizedSelector === editState.originalSelectorHijos) {
        screen.setComponentChildrenSelectorEditStatus("No hay cambios para guardar.");
        return;
      }

      editState.selectorSubmitting = true;
      setEditControlsLoading();
      screen.setComponentChildrenSelectorEditStatus("Guardando ubicación de hijos...");

      try {
        const updated = await componentManagementService.updateComponenteRelations({
          id_componente: componentId,
          selector_hijos: normalizedSelector,
        });
        editState.originalSelectorHijos = normalizedSelector;
        editState.selectedSelectorHijos = normalizedSelector;
        await refreshComponentAfterEdit({
          componentId,
          updated,
          successMessage: normalizedSelector
            ? `Ubicación de hijos actualizada en el componente #${componentId}.`
            : `Ubicación de hijos removida del componente #${componentId}.`,
        });
      } catch (error) {
        const message = getUpdateErrorMessage(
          error,
          "No se pudo actualizar la ubicación de hijos."
        );
        screen.setComponentChildrenSelectorEditStatus(
          `No se pudo actualizar la ubicación: ${message}`
        );
        screen.setResponse({
          status: "error",
          componente: {
            message,
          },
        });
      } finally {
        editState.selectorSubmitting = false;
        setEditControlsLoading();
      }
    };

    const submitElementCreate = async (formData) => {
      if (
        detailState.loading ||
        editState.loading ||
        editState.variationSubmitting ||
      editState.planSubmitting ||
      editState.landingSubmitting ||
      editState.childSubmitting ||
      editState.selectorSubmitting ||
      editState.elementSelectorSubmittingIds.size > 0 ||
      editState.elementSubmitting
      ) {
        return;
      }

      const componentId = getActiveEditComponentId();
      if (!componentId) {
        screen.setComponentElementCreateStatus("No hay un componente activo para actualizar.");
        return;
      }

      const payload = {
        id_componente: componentId,
        id_tipo_elemento: parsePositiveInteger(formData.get("id_tipo_elemento")),
        nombre: String(formData.get("nombre") ?? "").trim(),
        selector: String(formData.get("selector") ?? "").trim(),
        icono_img: String(formData.get("icono_img") ?? "").trim(),
        descripcion: String(formData.get("descripcion") ?? "").trim(),
        link: String(formData.get("link") ?? "").trim(),
        orden: Number(formData.get("orden")),
        css_url: String(formData.get("css_url") ?? "").trim(),
      };

      editState.selectedTipoElementoId = payload.id_tipo_elemento;
      logger.info("edit:element:create:submit", {
        id_componente: componentId,
        id_tipo_elemento: payload.id_tipo_elemento,
        nombre: payload.nombre,
      });
      editState.elementSubmitting = true;
      setEditControlsLoading();
      screen.setComponentElementCreateStatus("Creando elemento...");

      try {
        const created = await componentManagementService.createElementoComponente(payload);
        logger.info("edit:element:create:success", {
          id_componente: componentId,
          id_elemento: created?.id_elemento ?? null,
        });
        editState.elementEditEnabled = false;
        screen.setComponentElementCreateVisible(false);
        await load({ force: true });
        await loadDetail(componentId);
        screen.setComponentsStatus(
          `Elemento #${created?.id_elemento ?? "-"} creado correctamente para el componente #${componentId}.`
        );
        screen.setResponse({
          status: "success",
          elementoComponente: created,
        });
      } catch (error) {
        const message = getUpdateErrorMessage(
          error,
          "No se pudo crear el elemento del componente."
        );
        logger.error("edit:element:create:error", {
          id_componente: componentId,
          message,
        });
        screen.setComponentElementCreateStatus(`No se pudo crear el elemento: ${message}`);
        screen.setResponse({
          status: "error",
          elementoComponente: {
            message,
          },
        });
      } finally {
        editState.elementSubmitting = false;
        setEditControlsLoading();
      }
    };

    const submitElementSelectorEdit = async (elementId, nextSelector) => {
      if (
        detailState.loading ||
        editState.loading ||
        editState.variationSubmitting ||
        editState.planSubmitting ||
        editState.landingSubmitting ||
        editState.childSubmitting ||
        editState.selectorSubmitting ||
        editState.elementSubmitting ||
        editState.elementSelectorSubmittingIds.size > 0
      ) {
        return;
      }

      const componentId = getActiveEditComponentId();
      if (!componentId) {
        screen.setComponentElementSelectorEditStatus(
          elementId,
          "No hay un componente activo para actualizar."
        );
        return;
      }

      if (!elementId) {
        screen.setComponentElementCreateStatus("No se pudo identificar el elemento a actualizar.");
        return;
      }

      const normalizedSelector = String(nextSelector ?? "").trim() || null;
      const originalSelector = editState.elementSelectorsById.get(elementId) ?? null;
      if (normalizedSelector === originalSelector) {
        screen.setComponentElementSelectorEditStatus(elementId, "No hay cambios para guardar.");
        return;
      }

      logger.info("edit:element:selector:submit", {
        id_componente: componentId,
        id_elemento: elementId,
        selector: normalizedSelector,
      });
      editState.elementSelectorSubmittingIds.add(elementId);
      setEditControlsLoading();
      screen.setComponentElementSelectorEditStatus(elementId, "Guardando selector...");

      try {
        const updated = await componentManagementService.updateElementoComponente({
          id_elemento: elementId,
          selector: normalizedSelector,
        });
        editState.elementSelectorsById.set(elementId, normalizedSelector);
        await load({ force: true });
        await loadDetail(componentId);
        screen.setComponentsStatus(
          normalizedSelector
            ? `Selector actualizado para el elemento #${elementId}.`
            : `Selector removido del elemento #${elementId}.`
        );
        screen.setResponse({
          status: "success",
          elementoComponente: updated,
        });
      } catch (error) {
        const message = getUpdateErrorMessage(
          error,
          "No se pudo actualizar el selector del elemento."
        );
        logger.error("edit:element:selector:error", {
          id_componente: componentId,
          id_elemento: elementId,
          message,
        });
        screen.setComponentElementSelectorEditStatus(
          elementId,
          `No se pudo actualizar el selector: ${message}`
        );
        screen.setResponse({
          status: "error",
          elementoComponente: {
            message,
          },
        });
      } finally {
        editState.elementSelectorSubmittingIds.delete(elementId);
        setEditControlsLoading();
      }
    };

    elements.componentDetailContainer.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-action], #componentPlanClearBtn, #componentChildrenSelectorClearBtn")
        : null;

      if (!trigger) {
        return;
      }

      if (trigger.id === "componentPlanClearBtn") {
        if (
          detailState.loading ||
          editState.loading ||
          editState.variationSubmitting ||
          editState.planSubmitting ||
          editState.landingSubmitting ||
          editState.childSubmitting ||
          editState.selectorSubmitting ||
          editState.elementSelectorSubmittingIds.size > 0 ||
          editState.elementSubmitting
        ) {
          return;
        }

        const planSelect = document.getElementById("componentPlanEditSelect");
        if (planSelect instanceof HTMLSelectElement) {
          planSelect.value = "";
        }

        editState.selectedPlanId = null;
        void submitPlanEdit(null);
        return;
      }

      if (trigger.id === "componentChildrenSelectorClearBtn") {
        const selectorInput = document.getElementById("componentChildrenSelectorEditInput");
        if (selectorInput instanceof HTMLInputElement) {
          selectorInput.value = "";
        }
        editState.selectedSelectorHijos = null;
        void submitChildrenSelectorEdit(null);
        return;
      }

      const action = trigger.getAttribute("data-action");
      if (action === "open-variation-catalog") {
        const tipoComponenteId = parsePositiveInteger(
          trigger.getAttribute("data-tipo-componente-id")
        );
        const variationId = parsePositiveInteger(trigger.getAttribute("data-variation-id"));
        logger.info("navigation:open-variation-catalog", {
          componentId: detailState.selectedId,
          tipoComponenteId,
          variationId,
        });
        void onOpenVariationCatalog({
          tipoComponenteId,
          variationId,
          componentId: parsePositiveInteger(detailState.selectedId),
        });
        return;
      }

      if (action === "open-plan-catalog") {
        const planId = parsePositiveInteger(trigger.getAttribute("data-plan-id"));
        logger.info("navigation:open-plan-catalog", {
          componentId: detailState.selectedId,
          planId,
        });
        void onOpenPlanCatalog({
          planId,
          componentId: parsePositiveInteger(detailState.selectedId),
        });
        return;
      }

      if (action === "open-landings-catalog") {
        logger.info("navigation:open-landings-catalog", {
          componentId: detailState.selectedId,
        });
        void onOpenLandingCatalog({
          componentId: parsePositiveInteger(detailState.selectedId),
        });
        return;
      }

      if (action === "toggle-component-landing-edit") {
        editState.landingEditEnabled = !editState.landingEditEnabled;
        screen.setComponentLandingAssignVisible(editState.landingEditEnabled);
        screen.setComponentLandingAssignStatus(
          editState.landingEditEnabled
            ? (editState.landings.length
                ? "Elegí una landing y asociá este componente desde este bloque."
                : "No hay landings disponibles para asociar.")
            : ""
        );
        return;
      }

      if (action === "unassign-component-landing") {
        const landingId = parsePositiveInteger(trigger.getAttribute("data-landing-id"));
        void submitLandingUnassign(landingId);
        return;
      }

      if (action === "toggle-component-child-edit") {
        editState.childEditEnabled = !editState.childEditEnabled;
        screen.setComponentChildAssignVisible(editState.childEditEnabled);
        screen.setComponentChildAssignStatus(
          editState.childEditEnabled
            ? (editState.childComponents.length
                ? "Elegí un componente y agregalo como hijo desde este bloque."
                : "No hay componentes disponibles para asociar como hijos.")
            : ""
        );
        return;
      }

      if (action === "toggle-component-element-edit") {
        editState.elementEditEnabled = !editState.elementEditEnabled;
        screen.setComponentElementCreateVisible(editState.elementEditEnabled);
        screen.setComponentElementCreateStatus(
          editState.elementEditEnabled
            ? (editState.tiposElemento.length
                ? "Completá los datos requeridos para crear un elemento asociado."
                : "No hay tipos de elemento disponibles para crear elementos.")
            : ""
        );
        return;
      }

      if (action === "clear-element-selector") {
        const elementId = parsePositiveInteger(trigger.getAttribute("data-element-id"));
        const selectorInput = document.getElementById(
          `componentElementSelectorEditInput-${elementId}`
        );
        if (selectorInput instanceof HTMLInputElement) {
          selectorInput.value = "";
        }
        void submitElementSelectorEdit(elementId, null);
      }
    });

    elements.componentDetailContainer.addEventListener("submit", async (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (form.id === "componentVariationEditForm") {
        event.preventDefault();
        const formData = new FormData(form);
        const nextTipoVariacionId = parsePositiveInteger(formData.get("id_tipo_variacion"));
        await submitVariationEdit(nextTipoVariacionId);
        return;
      }

      if (form.id === "componentPlanEditForm") {
        event.preventDefault();
        const formData = new FormData(form);
        const nextPlanId = parseNullablePositiveInteger(formData.get("id_plan"));
        await submitPlanEdit(nextPlanId);
        return;
      }

      if (form.id === "componentLandingAssignForm") {
        event.preventDefault();
        const formData = new FormData(form);
        const nextLandingId = parsePositiveInteger(formData.get("id_landing"));
        await submitLandingAssign(nextLandingId);
        return;
      }

      if (form.id === "componentChildAssignForm") {
        event.preventDefault();
        const formData = new FormData(form);
        const nextChildId = parsePositiveInteger(formData.get("id_hijo"));
        await submitChildAssign(nextChildId);
        return;
      }

      if (form.id === "componentChildrenSelectorEditForm") {
        event.preventDefault();
        const formData = new FormData(form);
        const nextSelectorHijos = String(formData.get("selector_hijos") ?? "");
        editState.selectedSelectorHijos = nextSelectorHijos.trim() || null;
        await submitChildrenSelectorEdit(nextSelectorHijos);
        return;
      }

      if (form.id === "componentElementCreateForm") {
        event.preventDefault();
        const formData = new FormData(form);
        await submitElementCreate(formData);
        return;
      }

      if (form.dataset.elementSelectorForm === "true") {
        event.preventDefault();
        const elementId = parsePositiveInteger(form.dataset.elementId);
        const formData = new FormData(form);
        const nextSelector = String(formData.get("selector") ?? "");
        await submitElementSelectorEdit(elementId, nextSelector);
      }
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
