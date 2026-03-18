import {
  escapeHtml,
  formatValue,
  renderFieldGrid,
  renderLinkOrText,
} from "../../../shared/presentation/ui/shared/renderUtils.js";

export class ComponentsScreenController {
  constructor(elements) {
    this.elements = elements;
  }

  showComponentsListView() {
    if (this.elements.componentsListSection) {
      this.elements.componentsListSection.classList.remove("hidden");
    }

    if (this.elements.componentDetailSection) {
      this.elements.componentDetailSection.classList.add("hidden");
    }

    if (this.elements.componentCreateSection) {
      this.elements.componentCreateSection.classList.add("hidden");
    }
  }

  showComponentDetailView() {
    if (this.elements.componentsListSection) {
      this.elements.componentsListSection.classList.add("hidden");
    }

    if (this.elements.componentDetailSection) {
      this.elements.componentDetailSection.classList.remove("hidden");
    }

    if (this.elements.componentCreateSection) {
      this.elements.componentCreateSection.classList.add("hidden");
    }
  }

  showComponentCreateView() {
    if (this.elements.componentsListSection) {
      this.elements.componentsListSection.classList.add("hidden");
    }

    if (this.elements.componentDetailSection) {
      this.elements.componentDetailSection.classList.add("hidden");
    }

    if (this.elements.componentCreateSection) {
      this.elements.componentCreateSection.classList.remove("hidden");
    }
  }

  setComponentsLoading(loading) {
    if (this.elements.loadComponentsBtn) {
      this.elements.loadComponentsBtn.disabled = loading;
    }
  }

  setComponentsStatus(message = "") {
    if (this.elements.componentsStatus) {
      this.elements.componentsStatus.textContent = message;
    }
  }

  renderComponentList(componentes = [], selectedComponentId = null) {
    if (!this.elements.componentListContainer) {
      return;
    }

    if (!Array.isArray(componentes) || componentes.length === 0) {
      this.elements.componentListContainer.innerHTML = `
        <div class="component-empty">
          <strong>No hay componentes para mostrar.</strong>
        </div>
      `;
      return;
    }

    this.elements.componentListContainer.innerHTML = componentes
      .map((componente) => {
        const componentId = escapeHtml(componente?.id_componente ?? "");
        const nombre = escapeHtml(componente?.nombre ?? "-");
        const estado = escapeHtml(componente?.estado ?? "-");
        const tipoComponente = escapeHtml(componente?.id_tipo_componente ?? "-");
        const tipoVariacion = escapeHtml(componente?.id_tipo_variacion ?? "-");
        const planId = escapeHtml(componente?.id_plan ?? "-");
        const isSelected = String(componente?.id_componente ?? "") === String(selectedComponentId ?? "");

        return `
          <article class="component-item ${isSelected ? "is-selected" : ""}" data-component-id="${componentId}">
            <div class="component-item-top">
              <span class="landing-badge">#${componentId}</span>
              <span class="landing-chip">${estado}</span>
              <span class="landing-chip">Tipo ${tipoComponente}</span>
              <span class="landing-chip">Variación ${tipoVariacion}</span>
              <span class="landing-chip">Plan ${planId}</span>
            </div>
            <p class="component-name">${nombre}</p>
          </article>
        `;
      })
      .join("");
  }

  setComponentDetailStatus(message = "") {
    if (this.elements.componentDetailStatus) {
      this.elements.componentDetailStatus.textContent = message;
    }
  }

  clearComponentDetail(message = "Seleccioná un componente para ver su detalle.") {
    if (!this.elements.componentDetailContainer) {
      return;
    }

    this.elements.componentDetailContainer.innerHTML = `
      <div class="component-detail-empty">
        <strong>${escapeHtml(message)}</strong>
      </div>
    `;
  }

  renderComponentCreateFormOptions({
    tiposComponente = [],
    tiposVariacion = [],
    planes = [],
    selectedTipoComponenteId = null,
    selectedTipoVariacionId = null,
    selectedPlanId = null,
  } = {}) {
    if (this.elements.componentCreateTipoComponenteSelect) {
      this.elements.componentCreateTipoComponenteSelect.innerHTML = this.buildSelectOptions({
        items: tiposComponente,
        selectedValue: selectedTipoComponenteId,
        valueKey: "id_tipo_componente",
        labelBuilder: (item) => `#${item.id_tipo_componente} · ${item.nombre ?? "-"}`,
        emptyLabel: "No hay tipos de componente disponibles",
      });
    }

    if (this.elements.componentCreateTipoVariacionSelect) {
      this.elements.componentCreateTipoVariacionSelect.innerHTML = this.buildSelectOptions({
        items: tiposVariacion,
        selectedValue: selectedTipoVariacionId,
        valueKey: "id_tipo_variacion",
        labelBuilder: (item) => `#${item.id_tipo_variacion} · ${item.nombre ?? "-"}`,
        emptyLabel: "No hay variaciones para el tipo seleccionado",
      });
    }

    if (this.elements.componentCreatePlanSelect) {
      this.elements.componentCreatePlanSelect.innerHTML = this.buildSelectOptions({
        items: planes,
        selectedValue: selectedPlanId,
        valueKey: "id_plan",
        labelBuilder: (item) =>
          `#${item.id_plan} · ${item.nombre_display ?? item.nombre ?? item.nombre_plan ?? "-"} · ${item.producto ?? "-"}`,
        emptyLabel: "No hay planes disponibles",
      });
    }
  }

  renderComponentVariationEditOptions({
    tiposVariacion = [],
    selectedTipoVariacionId = null,
  } = {}) {
    const tipoVariacionSelect = document.getElementById("componentVariationEditSelect");
    if (tipoVariacionSelect) {
      tipoVariacionSelect.innerHTML = this.buildSelectOptions({
        items: tiposVariacion,
        selectedValue: selectedTipoVariacionId,
        valueKey: "id_tipo_variacion",
        labelBuilder: (item) => `#${item.id_tipo_variacion} · ${item.nombre ?? "-"}`,
        emptyLabel: "No hay variaciones disponibles para este componente",
      });
    }
  }

  renderComponentPlanEditOptions({
    planes = [],
    selectedPlanId = null,
  } = {}) {
    const planSelect = document.getElementById("componentPlanEditSelect");
    if (planSelect) {
      planSelect.innerHTML = this.buildSelectOptions({
        items: planes,
        selectedValue: selectedPlanId,
        valueKey: "id_plan",
        labelBuilder: (item) =>
          `#${item.id_plan} · ${item.nombre_display ?? item.nombre ?? item.nombre_plan ?? "-"} · ${item.producto ?? "-"}`,
        emptyLabel: "No hay planes disponibles",
        allowEmptyOption: true,
        emptyOptionLabel: "Sin plan",
      });
    }
  }

  renderComponentLandingAssignOptions({
    landings = [],
    selectedLandingId = null,
  } = {}) {
    const landingSelect = document.getElementById("componentLandingAssignSelect");
    if (landingSelect) {
      landingSelect.innerHTML = this.buildSelectOptions({
        items: landings,
        selectedValue: selectedLandingId,
        valueKey: "id_landing",
        labelBuilder: (item) =>
          `#${item.id_landing} · ${item.segmento ?? "-"} · ${item.URL ?? "-"}`,
        emptyLabel: "No hay landings disponibles para asociar",
      });
    }
  }

  renderComponentChildAssignOptions({
    componentes = [],
    selectedChildId = null,
  } = {}) {
    const childSelect = document.getElementById("componentChildAssignSelect");
    if (childSelect) {
      childSelect.innerHTML = this.buildSelectOptions({
        items: componentes,
        selectedValue: selectedChildId,
        valueKey: "id_componente",
        labelBuilder: (item) =>
          `#${item.id_componente} · ${item.nombre ?? "-"} · Tipo ${item.id_tipo_componente ?? "-"} · Variación ${item.id_tipo_variacion ?? "-"}`,
        emptyLabel: "No hay componentes disponibles para asociar como hijos",
      });
    }
  }

  renderComponentElementCreateOptions({
    tiposElemento = [],
    selectedTipoElementoId = null,
  } = {}) {
    const tipoElementoSelect = document.getElementById("componentElementCreateTipoElementoSelect");
    if (tipoElementoSelect) {
      tipoElementoSelect.innerHTML = this.buildSelectOptions({
        items: tiposElemento,
        selectedValue: selectedTipoElementoId,
        valueKey: "id_tipo_elemento",
        labelBuilder: (item) => `#${item.id_tipo_elemento} · ${item.nombre ?? "-"}`,
        emptyLabel: "No hay tipos de elemento disponibles",
      });
    }
  }

  setComponentCreateStatus(message = "") {
    if (this.elements.componentCreateStatus) {
      this.elements.componentCreateStatus.textContent = message;
    }
  }

  setComponentCreateLoading(loading) {
    if (this.elements.createComponentBtn) {
      this.elements.createComponentBtn.disabled = loading;
    }

    if (this.elements.componentCreateSubmitBtn) {
      this.elements.componentCreateSubmitBtn.disabled = loading;
    }

    if (this.elements.componentCreateTipoComponenteSelect) {
      this.elements.componentCreateTipoComponenteSelect.disabled = loading;
    }

    if (this.elements.componentCreateTipoVariacionSelect) {
      this.elements.componentCreateTipoVariacionSelect.disabled = loading;
    }

    if (this.elements.componentCreatePlanSelect) {
      this.elements.componentCreatePlanSelect.disabled = loading;
    }

    if (this.elements.componentCreateNameInput) {
      this.elements.componentCreateNameInput.disabled = loading;
    }
  }

  resetComponentCreateForm() {
    if (this.elements.componentCreateForm) {
      this.elements.componentCreateForm.reset();
    }

    this.setComponentCreateStatus("");
  }

  setComponentVariationEditStatus(message = "") {
    const statusNode = document.getElementById("componentVariationEditStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentPlanEditStatus(message = "") {
    const statusNode = document.getElementById("componentPlanEditStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentLandingAssignStatus(message = "") {
    const statusNode = document.getElementById("componentLandingAssignStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentChildAssignStatus(message = "") {
    const statusNode = document.getElementById("componentChildAssignStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentChildrenSelectorEditStatus(message = "") {
    const statusNode = document.getElementById("componentChildrenSelectorEditStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentElementCreateStatus(message = "") {
    const statusNode = document.getElementById("componentElementCreateStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentElementSelectorEditStatus(elementId, message = "") {
    const statusNode = document.getElementById(
      `componentElementSelectorEditStatus-${elementId}`
    );
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentDetailEditLoading(formId, loading) {
    const form = document.getElementById(formId);
    if (form instanceof HTMLFormElement) {
      const controls = form.querySelectorAll("input, select, textarea, button");
      controls.forEach((control) => {
        control.disabled = loading;
      });
    }
  }

  setComponentVariationEditLoading(loading) {
    this.setComponentDetailEditLoading("componentVariationEditForm", loading);
  }

  setComponentPlanEditLoading(loading) {
    this.setComponentDetailEditLoading("componentPlanEditForm", loading);
  }

  setComponentLandingAssignLoading(loading) {
    this.setComponentDetailEditLoading("componentLandingAssignForm", loading);
    const unassignButtons = this.elements.componentDetailContainer?.querySelectorAll(
      "[data-action='unassign-component-landing']"
    );
    if (unassignButtons) {
      unassignButtons.forEach((button) => {
        button.disabled = loading;
      });
    }
  }

  setComponentChildAssignLoading(loading) {
    this.setComponentDetailEditLoading("componentChildAssignForm", loading);
  }

  setComponentChildrenSelectorEditLoading(loading) {
    this.setComponentDetailEditLoading("componentChildrenSelectorEditForm", loading);
  }

  setComponentElementCreateLoading(loading) {
    this.setComponentDetailEditLoading("componentElementCreateForm", loading);
  }

  setComponentElementSelectorEditLoading(elementId, loading) {
    this.setComponentDetailEditLoading(
      `componentElementSelectorEditForm-${elementId}`,
      loading
    );
  }

  setComponentLandingAssignVisible(visible) {
    const panel = document.getElementById("componentLandingAssignPanel");
    const toggleButton = document.getElementById("componentLandingAssignToggleBtn");
    const unassignButtons = this.elements.componentDetailContainer?.querySelectorAll(
      ".component-landing-unassign-btn"
    );
    if (panel) {
      panel.classList.toggle("hidden", !visible);
    }

    if (toggleButton) {
      toggleButton.textContent = visible ? "Cancelar edición" : "Editar asociaciones";
    }

    if (unassignButtons) {
      unassignButtons.forEach((button) => {
        button.classList.toggle("hidden", !visible);
      });
    }
  }

  setComponentChildAssignVisible(visible) {
    const panel = document.getElementById("componentChildAssignPanel");
    const toggleButton = document.getElementById("componentChildAssignToggleBtn");
    if (panel) {
      panel.classList.toggle("hidden", !visible);
    }

    if (toggleButton) {
      toggleButton.textContent = visible ? "Cancelar" : "Agregar hijo";
    }
  }

  setComponentElementCreateVisible(visible) {
    const panel = document.getElementById("componentElementCreatePanel");
    const toggleButton = document.getElementById("componentElementCreateToggleBtn");
    if (panel) {
      panel.classList.toggle("hidden", !visible);
    }

    if (toggleButton) {
      toggleButton.textContent = visible ? "Cancelar" : "Agregar elemento";
    }
  }

  renderComponentDetail(detail) {
    if (!this.elements.componentDetailContainer) {
      return;
    }

    if (!detail || !detail.component) {
      this.clearComponentDetail();
      return;
    }

    const {
      component,
      tipoComponente,
      tipoVariacion,
      plan,
      elementos,
      landings,
      children,
      warnings,
    } = detail;
    const warningMarkup = Array.isArray(warnings) && warnings.length
      ? `
        <section class="detail-section">
          <h5>Advertencias</h5>
          <ul class="detail-warning-list">
            ${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
          </ul>
        </section>
      `
      : "";

    const tipoComponenteMarkup = tipoComponente
      ? `
        <section class="detail-section">
          <h5>Tipo de componente</h5>
          ${renderFieldGrid([
            { label: "ID", value: tipoComponente.id_tipo_componente },
            { label: "Nombre", value: tipoComponente.nombre },
            { label: "Estado", value: tipoComponente.estado },
          ])}
        </section>
      `
      : `
        <section class="detail-section">
          <h5>Tipo de componente</h5>
          <div class="component-detail-empty"><strong>No hay detalle disponible.</strong></div>
        </section>
      `;

    const currentTipoVariacionLabel = tipoVariacion
      ? `#${formatValue(tipoVariacion.id_tipo_variacion ?? component.id_tipo_variacion)} · ${formatValue(tipoVariacion.nombre)}`
      : `#${formatValue(component.id_tipo_variacion)} · Sin detalle cargado`;
    const tipoVariacionMarkup = `
      <section class="detail-section">
        <h5>Tipo de variación</h5>
        ${
          tipoVariacion
            ? renderFieldGrid([
              { label: "ID", value: tipoVariacion.id_tipo_variacion },
              { label: "Tipo componente", value: tipoVariacion.id_tipo_componente },
              { label: "Nombre", value: tipoVariacion.nombre },
              { label: "Descripción", value: tipoVariacion.descripcion },
              { label: "HTML", value: tipoVariacion.html },
              { label: "CSS", value: tipoVariacion.css_url },
              { label: "JS", value: tipoVariacion.js_url },
            ])
            : '<div class="component-detail-empty"><strong>No hay detalle disponible.</strong></div>'
        }
        <div class="detail-edit-panel">
          <div class="detail-cross-actions">
            <button
              type="button"
              class="secondary"
              data-action="open-variation-catalog"
              data-variation-id="${escapeHtml(component.id_tipo_variacion ?? "")}"
              data-tipo-componente-id="${escapeHtml(component.id_tipo_componente ?? "")}"
            >
              Ver en Variaciones
            </button>
          </div>
          <p class="muted detail-edit-hint">La variación es obligatoria y se edita desde este bloque.</p>
          <form id="componentVariationEditForm" class="form detail-edit-form">
            <label>
              Variación
              <select
                id="componentVariationEditSelect"
                name="id_tipo_variacion"
                required
              >
                <option value="${escapeHtml(component.id_tipo_variacion ?? "")}">
                  ${escapeHtml(currentTipoVariacionLabel)}
                </option>
              </select>
            </label>
            <div class="detail-edit-actions">
              <button id="componentVariationEditSubmitBtn" type="submit">Guardar variación</button>
            </div>
            <p id="componentVariationEditStatus" class="status">
              Cargando opciones de edición...
            </p>
          </form>
        </div>
      </section>
    `;

    const currentPlanLabel = plan
      ? `#${formatValue(plan.id_plan ?? component.id_plan)} · ${formatValue(plan.nombre_display ?? plan.nombre ?? plan.nombre_plan)}`
      : "Sin plan";
    const planMarkup = `
      <section class="detail-section">
        <h5>Plan asociado</h5>
        ${
          plan
            ? renderFieldGrid([
              { label: "ID", value: plan.id_plan ?? component.id_plan },
              { label: "Nombre", value: plan.nombre_display ?? plan.nombre ?? plan.nombre_plan },
              { label: "Producto", value: plan.producto },
              { label: "Segmento", value: plan.segmento },
              { label: "Capacidad", value: plan.capacidad_display ?? plan.capacidad ?? plan.capacidad_plan },
              { label: "Precio oferta", value: plan.precio_oferta },
              { label: "Precio full", value: plan.precio_full_price },
              { label: "Precio sin IVA", value: plan.precio_sin_iva },
              { label: "Aumento", value: plan.aumento },
            ])
            : '<div class="component-detail-empty"><strong>El componente no tiene un plan asociado.</strong></div>'
        }
        <div class="detail-edit-panel">
          <div class="detail-cross-actions">
            <button
              type="button"
              class="secondary"
              data-action="open-plan-catalog"
              data-plan-id="${escapeHtml(component.id_plan ?? "")}"
            >
              ${component.id_plan ? "Ver en Planes" : "Ir a Planes"}
            </button>
          </div>
          <p class="muted detail-edit-hint">El plan es opcional. Podés cambiarlo o quitarlo desde este bloque.</p>
          <form id="componentPlanEditForm" class="form detail-edit-form">
            <label>
              Plan
              <select id="componentPlanEditSelect" name="id_plan">
                <option value="${escapeHtml(component.id_plan ?? "")}">
                  ${escapeHtml(currentPlanLabel)}
                </option>
              </select>
            </label>
            <div class="detail-edit-actions">
              <button id="componentPlanEditSubmitBtn" type="submit">Guardar plan</button>
              <button id="componentPlanClearBtn" type="button" class="secondary">
                Quitar plan
              </button>
            </div>
            <p id="componentPlanEditStatus" class="status">
              Cargando opciones de edición...
            </p>
          </form>
        </div>
      </section>
    `;

    const elementosListMarkup = Array.isArray(elementos) && elementos.length
      ? `
          <div class="detail-stack">
            ${elementos
              .map(
                (elemento) => `
                  <article class="detail-list-item">
                    <div class="detail-inline">
                      <span class="landing-badge">#${escapeHtml(elemento?.id_elemento ?? "")}</span>
                      <span class="landing-chip">Orden ${escapeHtml(elemento?.orden ?? "-")}</span>
                      <span class="landing-chip">Tipo ${escapeHtml(elemento?.id_tipo_elemento ?? "-")}</span>
                    </div>
                    <strong>${escapeHtml(elemento?.nombre ?? "-")}</strong>
                    <div class="detail-grid">
                      <div class="detail-field">
                        <span class="detail-label">Selector</span>
                        <strong class="detail-value">${escapeHtml(formatValue(elemento?.selector))}</strong>
                      </div>
                      <div class="detail-field">
                        <span class="detail-label">Descripción</span>
                        <strong class="detail-value">${escapeHtml(formatValue(elemento?.descripcion))}</strong>
                      </div>
                      <div class="detail-field">
                        <span class="detail-label">Link</span>
                        <strong class="detail-value">${renderLinkOrText(elemento?.link)}</strong>
                      </div>
                      <div class="detail-field">
                        <span class="detail-label">Icono / Imagen</span>
                        <strong class="detail-value">${escapeHtml(formatValue(elemento?.icono_img))}</strong>
                      </div>
                      <div class="detail-field">
                        <span class="detail-label">CSS</span>
                        <strong class="detail-value">${escapeHtml(formatValue(elemento?.css_url))}</strong>
                      </div>
                    </div>
                    <form
                      id="componentElementSelectorEditForm-${escapeHtml(elemento?.id_elemento ?? "")}"
                      class="form detail-edit-form"
                      data-element-selector-form="true"
                      data-element-id="${escapeHtml(elemento?.id_elemento ?? "")}"
                    >
                      <label>
                        Selector (contenedor)
                        <input
                          id="componentElementSelectorEditInput-${escapeHtml(elemento?.id_elemento ?? "")}"
                          name="selector"
                          type="text"
                          value="${escapeHtml(elemento?.selector ?? "")}"
                          placeholder="Ej: contenedor_hijos o {contenedor_hijos}"
                        >
                      </label>
                      <div class="detail-edit-actions">
                        <button type="submit">Guardar selector</button>
                        <button
                          type="button"
                          class="secondary"
                          data-action="clear-element-selector"
                          data-element-id="${escapeHtml(elemento?.id_elemento ?? "")}"
                        >
                          Quitar selector
                        </button>
                      </div>
                      <p
                        id="componentElementSelectorEditStatus-${escapeHtml(elemento?.id_elemento ?? "")}"
                        class="status"
                      >
                        Selector opcional para placeholder de contenedor.
                      </p>
                    </form>
                  </article>
                `
              )
              .join("")}
          </div>
        `
      : '<div class="component-detail-empty"><strong>No hay elementos asociados.</strong></div>';
    const elementosMarkup = `
      <section class="detail-section">
        <h5>Elementos asociados</h5>
        ${elementosListMarkup}
        <div class="detail-edit-panel">
          <div class="detail-cross-actions">
            <button
              id="componentElementCreateToggleBtn"
              type="button"
              class="secondary"
              data-action="toggle-component-element-edit"
            >
              Agregar elemento
            </button>
          </div>
          <div id="componentElementCreatePanel" class="hidden">
            <p class="muted detail-edit-hint">Creá un nuevo elemento asociado a este componente. Sólo tipo, nombre y orden son obligatorios.</p>
            <form id="componentElementCreateForm" class="form detail-edit-form">
              <div class="grid2">
                <label>
                  Tipo de elemento
                  <select id="componentElementCreateTipoElementoSelect" name="id_tipo_elemento" required>
                    <option value="">Seleccioná un tipo</option>
                  </select>
                </label>
                <label>
                  Orden
                  <input
                    id="componentElementCreateOrdenInput"
                    name="orden"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ej: 1"
                    required
                  >
                </label>
              </div>
              <div class="grid2">
                <label>
                  Nombre
                  <input
                    id="componentElementCreateNombreInput"
                    name="nombre"
                    type="text"
                    placeholder="Ej: CTA principal"
                    required
                  >
                </label>
                <label>
                  Selector (opcional)
                  <input
                    id="componentElementCreateSelectorInput"
                    name="selector"
                    type="text"
                    placeholder="Ej: contenedor_hijos o {contenedor_hijos}"
                  >
                </label>
              </div>
              <div class="grid2">
                <label>
                  Icono / Imagen (opcional)
                  <input
                    id="componentElementCreateIconoInput"
                    name="icono_img"
                    type="text"
                    placeholder="Ej: /assets/iconos/cta.svg"
                  >
                </label>
                <label>
                  Link (opcional)
                  <input
                    id="componentElementCreateLinkInput"
                    name="link"
                    type="text"
                    placeholder="Ej: https://www.movistar.com.ar"
                  >
                </label>
              </div>
              <label>
                Descripción (opcional)
                <textarea
                  id="componentElementCreateDescripcionInput"
                  name="descripcion"
                  rows="3"
                  placeholder="Descripción del elemento"
                ></textarea>
              </label>
              <div class="grid2">
                <label>
                  CSS URL (opcional)
                  <input
                    id="componentElementCreateCssInput"
                    name="css_url"
                    type="text"
                    placeholder="Ej: /preview-assets/componentes/cta.css"
                  >
                </label>
              </div>
              <div class="detail-edit-actions">
                <button id="componentElementCreateSubmitBtn" type="submit">Crear elemento</button>
              </div>
              <p id="componentElementCreateStatus" class="status">
                Cargando opciones de edición...
              </p>
            </form>
          </div>
        </div>
      </section>
    `;

    const childrenMarkup = `
      <section class="detail-section">
        <h5>Componentes hijos</h5>
        ${
          Array.isArray(children) && children.length
            ? `
              <div class="detail-stack">
                ${children
                  .map(
                    (child) => `
                      <article class="detail-list-item">
                        <div class="detail-inline">
                          <span class="landing-badge">#${escapeHtml(child?.id_componente ?? "")}</span>
                          <span class="landing-chip">${escapeHtml(child?.estado ?? "-")}</span>
                          <span class="landing-chip">Tipo ${escapeHtml(child?.id_tipo_componente ?? "-")}</span>
                          <span class="landing-chip">Variación ${escapeHtml(child?.id_tipo_variacion ?? "-")}</span>
                        </div>
                        <strong>${escapeHtml(child?.nombre ?? "-")}</strong>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            `
            : '<div class="component-detail-empty"><strong>Este componente no tiene hijos asociados.</strong></div>'
        }
        <div class="detail-edit-panel">
          <p class="muted detail-edit-hint">Definí dónde insertar hijos en el HTML del padre usando un selector CSS (#id o .clase).</p>
          <form id="componentChildrenSelectorEditForm" class="form detail-edit-form">
            <label>
              Selector de hijos
              <input
                id="componentChildrenSelectorEditInput"
                name="selector_hijos"
                type="text"
                placeholder="Ej: #contenedor-hijos o .children-slot"
                value="${escapeHtml(component?.selector_hijos ?? "")}"
              >
            </label>
            <div class="detail-edit-actions">
              <button id="componentChildrenSelectorEditSubmitBtn" type="submit">Guardar ubicación</button>
              <button id="componentChildrenSelectorClearBtn" type="button" class="secondary">
                Quitar ubicación
              </button>
            </div>
            <p id="componentChildrenSelectorEditStatus" class="status">
              El selector es opcional.
            </p>
          </form>
        </div>
        <div class="detail-edit-panel">
          <div class="detail-cross-actions">
            <button
              id="componentChildAssignToggleBtn"
              type="button"
              class="secondary"
              data-action="toggle-component-child-edit"
            >
              Agregar hijo
            </button>
          </div>
          <div id="componentChildAssignPanel" class="hidden">
            <p class="muted detail-edit-hint">Elegí un componente del catálogo para asociarlo como hijo.</p>
            <form id="componentChildAssignForm" class="form detail-edit-form">
              <label>
                Componente hijo
                <select id="componentChildAssignSelect" name="id_hijo">
                  <option value="">Seleccioná un componente</option>
                </select>
              </label>
              <div class="detail-edit-actions">
                <button id="componentChildAssignSubmitBtn" type="submit">Asociar hijo</button>
              </div>
              <p id="componentChildAssignStatus" class="status">
                Cargando opciones de edición...
              </p>
            </form>
          </div>
        </div>
      </section>
    `;

    const landingsListMarkup = Array.isArray(landings) && landings.length
      ? `
        <div class="detail-stack">
          ${landings
            .map(
              (landing) => `
                <article class="detail-list-item">
                  <div class="detail-list-item-top">
                    <div class="detail-inline">
                      <span class="landing-badge">#${escapeHtml(landing?.id_landing ?? "")}</span>
                      <span class="landing-chip">${escapeHtml(landing?.estado ?? "-")}</span>
                      <span class="landing-chip">${escapeHtml(landing?.segmento ?? "-")}</span>
                    </div>
                    <div class="detail-list-item-actions">
                      <button
                        type="button"
                        class="secondary component-landing-unassign-btn hidden"
                        data-action="unassign-component-landing"
                        data-landing-id="${escapeHtml(landing?.id_landing ?? "")}"
                      >
                        Desasociar
                      </button>
                    </div>
                  </div>
                  <strong>${renderLinkOrText(landing?.URL)}</strong>
                </article>
              `
            )
            .join("")}
        </div>
      `
      : `
        <div class="component-detail-empty"><strong>No hay landings asociadas.</strong></div>
      `;
    const landingsMarkup = `
      <section class="detail-section">
        <h5>Landings asociadas</h5>
        ${landingsListMarkup}
        <div class="detail-edit-panel">
          <div class="detail-cross-actions">
            <button
              type="button"
              class="secondary"
              data-action="open-landings-catalog"
            >
              Ir a Landings
            </button>
            <button
              id="componentLandingAssignToggleBtn"
              type="button"
              class="secondary"
              data-action="toggle-component-landing-edit"
            >
              Editar asociaciones
            </button>
          </div>
          <div id="componentLandingAssignPanel" class="hidden">
            <p class="muted detail-edit-hint">Podés asociar este componente a una landing desde este bloque.</p>
            <form id="componentLandingAssignForm" class="form detail-edit-form">
              <label>
                Landing
                <select id="componentLandingAssignSelect" name="id_landing">
                  <option value="">Seleccioná una landing</option>
                </select>
              </label>
              <div class="detail-edit-actions">
                <button id="componentLandingAssignSubmitBtn" type="submit">Asociar landing</button>
              </div>
              <p id="componentLandingAssignStatus" class="status">
                Cargando opciones de edición...
              </p>
            </form>
          </div>
        </div>
      </section>
    `;

    this.elements.componentDetailContainer.innerHTML = `
      ${warningMarkup}
      <section class="detail-section">
        <h5>Resumen</h5>
        ${renderFieldGrid([
          { label: "ID componente", value: component.id_componente },
          { label: "Nombre", value: component.nombre },
          { label: "Estado", value: component.estado },
          { label: "Fecha creación", value: component.fecha_creacion },
          { label: "Fecha baja", value: component.fecha_baja },
          { label: "Tipo componente", value: component.id_tipo_componente },
          { label: "Tipo variación", value: component.id_tipo_variacion },
          { label: "Plan asociado", value: component.id_plan },
          { label: "Selector hijos", value: component.selector_hijos },
        ])}
      </section>
      ${tipoComponenteMarkup}
      ${tipoVariacionMarkup}
      ${planMarkup}
      ${elementosMarkup}
      ${childrenMarkup}
      ${landingsMarkup}
      <section class="detail-section">
        <h5>Preview del componente</h5>
        <p id="componentPreviewStatus" class="status"></p>
        <div class="component-preview-shell">
          <iframe
            id="componentPreviewFrame"
            class="component-preview-frame"
            title="Preview del componente"
            loading="lazy"
            sandbox=""
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
      </section>
    `;
  }

  buildSelectOptions({
    items = [],
    selectedValue = null,
    valueKey,
    labelBuilder,
    emptyLabel,
    allowEmptyOption = false,
    emptyOptionLabel = "Seleccionar",
  }) {
    const options = [];
    if (allowEmptyOption) {
      const isSelected =
        selectedValue === null || selectedValue === undefined || selectedValue === "";
      options.push(`
        <option value="" ${isSelected ? "selected" : ""}>
          ${escapeHtml(emptyOptionLabel)}
        </option>
      `);
    }

    if (!Array.isArray(items) || items.length === 0) {
      if (options.length > 0) {
        return options.join("");
      }

      return `<option value="">${escapeHtml(emptyLabel)}</option>`;
    }

    return options
      .concat(items.map((item) => {
        const value = String(item?.[valueKey] ?? "");
        const isSelected = String(selectedValue ?? "") === value;

        return `
          <option value="${escapeHtml(value)}" ${isSelected ? "selected" : ""}>
            ${escapeHtml(labelBuilder(item))}
          </option>
        `;
      }))
      .join("");
  }
}
