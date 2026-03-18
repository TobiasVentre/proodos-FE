import {
  escapeHtml,
  formatValue,
  renderFieldGrid,
} from "../../../shared/presentation/ui/shared/renderUtils.js";

const getInputValue = (value) => (value === null || value === undefined ? "" : String(value));

export class PlansScreenController {
  constructor(elements) {
    this.elements = elements;
  }

  showPlansListView() {
    if (this.elements.plansListSection) {
      this.elements.plansListSection.classList.remove("hidden");
    }

    if (this.elements.planDetailSection) {
      this.elements.planDetailSection.classList.add("hidden");
    }
  }

  showPlanDetailView() {
    if (this.elements.plansListSection) {
      this.elements.plansListSection.classList.add("hidden");
    }

    if (this.elements.planDetailSection) {
      this.elements.planDetailSection.classList.remove("hidden");
    }
  }

  setPlansLoading(loading) {
    if (this.elements.loadPlansBtn) {
      this.elements.loadPlansBtn.disabled = loading;
    }

    if (this.elements.planSegmentFilter) {
      this.elements.planSegmentFilter.disabled = loading;
    }
  }

  setPlansStatus(message = "") {
    if (this.elements.plansStatus) {
      this.elements.plansStatus.textContent = message;
    }
  }

  renderPlanSegmentFilterOptions({
    segmentos = [],
    selectedSegmentKey = "",
  } = {}) {
    if (!this.elements.planSegmentFilter) {
      return;
    }

    const options = [
      `
        <option value="" ${selectedSegmentKey === "" ? "selected" : ""}>
          Todos los segmentos
        </option>
      `,
      ...segmentos.map((segmento) => `
        <option value="${escapeHtml(segmento.key)}" ${segmento.key === selectedSegmentKey ? "selected" : ""}>
          ${escapeHtml(segmento.label)}
        </option>
      `),
    ];

    this.elements.planSegmentFilter.innerHTML = options.join("");
  }

  renderPlanList({
    planes = [],
    selectedPlanId = null,
  } = {}) {
    if (!this.elements.planListContainer) {
      return;
    }

    if (!Array.isArray(planes) || planes.length === 0) {
      this.elements.planListContainer.innerHTML = `
        <div class="landing-empty">
          <strong>No hay planes para mostrar.</strong>
        </div>
      `;
      return;
    }

    this.elements.planListContainer.innerHTML = planes
      .map((plan) => {
        const planId = String(plan?.id_plan ?? "");
        const isFocused = planId === String(selectedPlanId ?? "");

        return `
          <article class="plan-item ${isFocused ? "is-focused" : ""}">
            <div class="plan-item-top">
              <span class="landing-badge">#${escapeHtml(planId || "-")}</span>
              <span class="landing-chip">${escapeHtml(plan?.segmento ?? "-")}</span>
              <span class="landing-chip">${escapeHtml(plan?.producto ?? "-")}</span>
            </div>
            <p class="plan-name">${escapeHtml(plan?.nombre_display ?? plan?.nombre ?? plan?.nombre_plan ?? "-")}</p>
            ${renderFieldGrid([
              { label: "Nombre plan", value: plan?.nombre_plan },
              { label: "Bonete", value: plan?.bonete },
              { label: "Capacidad", value: plan?.capacidad_display ?? plan?.capacidad ?? plan?.capacidad_plan },
              { label: "Precio oferta", value: plan?.precio_oferta },
              { label: "Precio full", value: plan?.precio_full_price },
              { label: "Precio sin IVA", value: plan?.precio_sin_iva },
            ])}
            <div class="plan-item-actions">
              <button
                type="button"
                class="secondary"
                data-action="view-plan-detail"
                data-plan-id="${escapeHtml(planId)}"
              >
                Ver detalle
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  setPlanDetailStatus(message = "") {
    if (this.elements.planDetailStatus) {
      this.elements.planDetailStatus.textContent = message;
    }
  }

  clearPlanDetail(message = "Seleccioná un plan para ver el detalle.") {
    if (!this.elements.planDetailContainer) {
      return;
    }

    this.elements.planDetailContainer.innerHTML = `
      <div class="component-detail-empty">
        <strong>${escapeHtml(message)}</strong>
      </div>
    `;
  }

  renderPlanDetail({
    plan,
    editing = false,
  } = {}) {
    if (!this.elements.planDetailContainer) {
      return;
    }

    if (!plan) {
      this.clearPlanDetail();
      return;
    }

    const readOnly = editing ? "" : "readonly";
    this.elements.planDetailContainer.innerHTML = `
      <section class="detail-section">
        <h5>Resumen</h5>
        ${renderFieldGrid([
          { label: "ID", value: plan.id_plan },
          { label: "Nombre visible", value: plan.nombre_display ?? plan.nombre ?? plan.nombre_plan },
          { label: "Segmento", value: plan.segmento },
          { label: "Producto", value: plan.producto },
          { label: "Bonete", value: plan.bonete },
        ])}
      </section>

      <section class="detail-section">
        <h5>Detalle editable</h5>
        <form id="planDetailEditForm" class="form plan-detail-form">
          <div class="grid2 plan-detail-form-grid">
            <label>
              Segmento
              <input name="segmento" type="text" value="${escapeHtml(getInputValue(plan.segmento))}" ${readOnly}>
            </label>
            <label>
              Producto
              <input name="producto" type="text" value="${escapeHtml(getInputValue(plan.producto))}" ${readOnly}>
            </label>
          </div>

          <div class="grid2 plan-detail-form-grid">
            <label>
              Bonete
              <input name="bonete" type="text" value="${escapeHtml(getInputValue(plan.bonete))}" ${readOnly}>
            </label>
            <label>
              Nombre
              <input name="nombre" type="text" value="${escapeHtml(getInputValue(plan.nombre))}" ${readOnly}>
            </label>
          </div>

          <div class="grid2 plan-detail-form-grid">
            <label>
              Nombre plan
              <input name="nombre_plan" type="text" value="${escapeHtml(getInputValue(plan.nombre_plan))}" ${readOnly}>
            </label>
            <label>
              Capacidad plan
              <input name="capacidad_plan" type="text" value="${escapeHtml(getInputValue(plan.capacidad_plan))}" ${readOnly}>
            </label>
          </div>

          <div class="grid2 plan-detail-form-grid">
            <label>
              Capacidad
              <input name="capacidad" type="number" step="any" value="${escapeHtml(getInputValue(plan.capacidad))}" ${readOnly}>
            </label>
            <label>
              Capacidad anterior
              <input name="capacidad_anterior" type="number" step="any" value="${escapeHtml(getInputValue(plan.capacidad_anterior))}" ${readOnly}>
            </label>
          </div>

          <div class="grid2 plan-detail-form-grid">
            <label>
              Precio oferta
              <input name="precio_oferta" type="number" step="any" value="${escapeHtml(getInputValue(plan.precio_oferta))}" ${readOnly}>
            </label>
            <label>
              Precio full
              <input name="precio_full_price" type="number" step="any" value="${escapeHtml(getInputValue(plan.precio_full_price))}" ${readOnly}>
            </label>
          </div>

          <div class="grid2 plan-detail-form-grid">
            <label>
              Precio sin IVA
              <input name="precio_sin_iva" type="number" step="any" value="${escapeHtml(getInputValue(plan.precio_sin_iva))}" ${readOnly}>
            </label>
            <label>
              Aumento
              <input name="aumento" type="number" step="any" value="${escapeHtml(getInputValue(plan.aumento))}" ${readOnly}>
            </label>
          </div>

          <div class="plan-detail-actions">
            ${
              editing
                ? `
                  <button type="submit">Guardar cambios</button>
                  <button type="button" class="secondary" data-action="cancel-plan-edit">Cancelar</button>
                `
                : `
                  <button type="button" data-action="start-plan-edit">Editar</button>
                `
            }
          </div>

          <p id="planEditStatus" class="status">
            ${
              editing
                ? "Editá los campos que quieras actualizar y guardá los cambios."
                : "Usá Editar para habilitar los campos."
            }
          </p>
        </form>
      </section>

      <section class="detail-section">
        <h5>Campos derivados</h5>
        ${renderFieldGrid([
          { label: "Nombre display", value: plan.nombre_display ?? "-" },
          { label: "Capacidad display", value: plan.capacidad_display ?? "-" },
          { label: "Capacidad normalizada", value: formatValue(plan.capacidad) },
        ])}
      </section>
    `;
  }

  setPlanEditStatus(message = "") {
    const statusNode = document.getElementById("planEditStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setPlanEditLoading(loading) {
    const form = document.getElementById("planDetailEditForm");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const controls = form.querySelectorAll("input, button");
    controls.forEach((control) => {
      control.disabled = loading;
    });
  }
}
