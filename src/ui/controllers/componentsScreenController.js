import {
  escapeHtml,
  formatValue,
  renderFieldGrid,
  renderLinkOrText,
} from "../shared/renderUtils.js";

export class ComponentsScreenController {
  constructor(elements) {
    this.elements = elements;
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

  renderComponentDetail(detail) {
    if (!this.elements.componentDetailContainer) {
      return;
    }

    if (!detail || !detail.component) {
      this.clearComponentDetail();
      return;
    }

    const { component, tipoComponente, tipoVariacion, plan, elementos, landings, warnings } = detail;
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

    const tipoVariacionMarkup = tipoVariacion
      ? `
        <section class="detail-section">
          <h5>Tipo de variación</h5>
          ${renderFieldGrid([
            { label: "ID", value: tipoVariacion.id_tipo_variacion },
            { label: "Tipo componente", value: tipoVariacion.id_tipo_componente },
            { label: "Nombre", value: tipoVariacion.nombre },
            { label: "Descripción", value: tipoVariacion.descripcion },
            { label: "HTML", value: tipoVariacion.html },
            { label: "CSS", value: tipoVariacion.css_url },
            { label: "JS", value: tipoVariacion.js_url },
          ])}
        </section>
      `
      : `
        <section class="detail-section">
          <h5>Tipo de variación</h5>
          <div class="component-detail-empty"><strong>No hay detalle disponible.</strong></div>
        </section>
      `;

    const planMarkup = plan
      ? `
        <section class="detail-section">
          <h5>Plan asociado</h5>
          ${renderFieldGrid([
            { label: "ID", value: plan.id_plan ?? component.id_plan },
            { label: "Nombre", value: plan.nombre ?? plan.nombre_plan },
            { label: "Producto", value: plan.producto },
            { label: "Segmento", value: plan.segmento },
            { label: "Capacidad", value: plan.capacidad ?? plan.capacidad_plan },
            { label: "Precio oferta", value: plan.precio_oferta },
            { label: "Precio full", value: plan.precio_full_price },
            { label: "Precio sin IVA", value: plan.precio_sin_iva },
            { label: "Aumento", value: plan.aumento },
          ])}
        </section>
      `
      : `
        <section class="detail-section">
          <h5>Plan asociado</h5>
          <div class="component-detail-empty"><strong>El componente no tiene un plan asociado.</strong></div>
        </section>
      `;

    const elementosMarkup = Array.isArray(elementos) && elementos.length
      ? `
        <section class="detail-section">
          <h5>Elementos asociados</h5>
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
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
      : `
        <section class="detail-section">
          <h5>Elementos asociados</h5>
          <div class="component-detail-empty"><strong>No hay elementos asociados.</strong></div>
        </section>
      `;

    const landingsMarkup = Array.isArray(landings) && landings.length
      ? `
        <section class="detail-section">
          <h5>Landings asociadas</h5>
          <div class="detail-stack">
            ${landings
              .map(
                (landing) => `
                  <article class="detail-list-item">
                    <div class="detail-inline">
                      <span class="landing-badge">#${escapeHtml(landing?.id_landing ?? "")}</span>
                      <span class="landing-chip">${escapeHtml(landing?.estado ?? "-")}</span>
                      <span class="landing-chip">${escapeHtml(landing?.segmento ?? "-")}</span>
                    </div>
                    <strong>${renderLinkOrText(landing?.URL)}</strong>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
      : `
        <section class="detail-section">
          <h5>Landings asociadas</h5>
          <div class="component-detail-empty"><strong>No hay landings asociadas.</strong></div>
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
        ])}
      </section>
      ${tipoComponenteMarkup}
      ${tipoVariacionMarkup}
      ${planMarkup}
      ${elementosMarkup}
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
}
