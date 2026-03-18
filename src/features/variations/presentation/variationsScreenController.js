import { escapeHtml } from "../../../shared/presentation/ui/shared/renderUtils.js";

const getInputValue = (value) => (value === null || value === undefined ? "" : String(value));

export class VariationsScreenController {
  constructor(elements) {
    this.elements = elements;
  }

  setVariationsLoading(loading) {
    if (this.elements.loadVariationsBtn) {
      this.elements.loadVariationsBtn.disabled = loading;
    }

    if (this.elements.createVariationBtn) {
      this.elements.createVariationBtn.disabled = loading;
    }

    if (this.elements.variationTipoComponenteFilter) {
      this.elements.variationTipoComponenteFilter.disabled = loading;
    }
  }

  setVariationsStatus(message = "") {
    if (this.elements.variationsStatus) {
      this.elements.variationsStatus.textContent = message;
    }
  }

  setVariationCreateVisible(visible) {
    if (this.elements.variationCreateSection) {
      this.elements.variationCreateSection.classList.toggle("hidden", !visible);
    }
  }

  renderVariationFilterOptions({
    tiposComponente = [],
    selectedTipoComponenteId = null,
  } = {}) {
    if (!this.elements.variationTipoComponenteFilter) {
      return;
    }

    const selectedValue =
      selectedTipoComponenteId === null || selectedTipoComponenteId === undefined
        ? ""
        : String(selectedTipoComponenteId);
    const options = [
      `
        <option value="" ${selectedValue === "" ? "selected" : ""}>
          Todos los tipos de componente
        </option>
      `,
      ...this.buildTipoComponenteOptions({
        tiposComponente,
        selectedValue,
      }),
    ];

    this.elements.variationTipoComponenteFilter.innerHTML = options.join("");
  }

  renderVariationCreateFormOptions({
    tiposComponente = [],
    selectedTipoComponenteId = null,
  } = {}) {
    if (!this.elements.variationCreateTipoComponenteSelect) {
      return;
    }

    if (!Array.isArray(tiposComponente) || tiposComponente.length === 0) {
      this.elements.variationCreateTipoComponenteSelect.innerHTML = `
        <option value="">No hay tipos de componente disponibles</option>
      `;
      return;
    }

    const selectedValue =
      selectedTipoComponenteId === null || selectedTipoComponenteId === undefined
        ? String(tiposComponente[0]?.id_tipo_componente ?? "")
        : String(selectedTipoComponenteId);

    this.elements.variationCreateTipoComponenteSelect.innerHTML = this.buildTipoComponenteOptions({
      tiposComponente,
      selectedValue,
    }).join("");
  }

  setVariationCreateStatus(message = "") {
    if (this.elements.variationCreateStatus) {
      this.elements.variationCreateStatus.textContent = message;
    }
  }

  setVariationCreateLoading(loading) {
    if (this.elements.variationCreateForm instanceof HTMLFormElement) {
      const controls = this.elements.variationCreateForm.querySelectorAll(
        "input, select, textarea, button"
      );
      controls.forEach((control) => {
        control.disabled = loading;
      });
    }
  }

  resetVariationCreateForm() {
    if (this.elements.variationCreateForm) {
      this.elements.variationCreateForm.reset();
    }

    this.setVariationCreateStatus("");
  }

  renderVariationList({
    variaciones = [],
    tiposComponente = [],
    editingVariationId = null,
    focusedVariationId = null,
  } = {}) {
    if (!this.elements.variationListContainer) {
      return;
    }

    if (!Array.isArray(variaciones) || variaciones.length === 0) {
      this.elements.variationListContainer.innerHTML = `
        <div class="landing-empty">
          <strong>No hay variaciones para mostrar.</strong>
        </div>
      `;
      return;
    }

    this.elements.variationListContainer.innerHTML = variaciones
      .map((variacion) => {
        const variationId = String(variacion?.id_tipo_variacion ?? "");
        const isEditing = variationId === String(editingVariationId ?? "");
        const isFocused = variationId === String(focusedVariationId ?? "");
        const tipoComponenteId = getInputValue(variacion?.id_tipo_componente);
        const nombre = getInputValue(variacion?.nombre);
        const descripcion = getInputValue(variacion?.descripcion);
        const html = getInputValue(variacion?.html);
        const cssUrl = getInputValue(variacion?.css_url);
        const jsUrl = getInputValue(variacion?.js_url);

        return `
          <article class="variation-item ${isEditing ? "is-editing" : ""} ${isFocused ? "is-focused" : ""}">
            <form class="variation-edit-form" data-variation-form data-variation-id="${escapeHtml(variationId)}">
              <div class="variation-item-top">
                <span class="landing-badge">#${escapeHtml(variationId || "-")}</span>
                <span class="landing-chip">Tipo ${escapeHtml(tipoComponenteId || "-")}</span>
              </div>

              <div class="variation-form-grid">
                <label class="variation-form-field">
                  <span class="detail-label">Tipo de componente</span>
                  <select
                    class="variation-select"
                    name="id_tipo_componente"
                    ${isEditing ? "" : "disabled"}
                  >
                    ${this.buildTipoComponenteOptions({
                      tiposComponente,
                      selectedValue: tipoComponenteId,
                    }).join("")}
                  </select>
                </label>

                <label class="variation-form-field">
                  <span class="detail-label">Nombre</span>
                  <input
                    class="variation-input"
                    name="nombre"
                    type="text"
                    value="${escapeHtml(nombre)}"
                    ${isEditing ? "" : "readonly"}
                    required
                  >
                </label>
              </div>

              <label class="variation-form-field">
                <span class="detail-label">Descripción</span>
                <textarea
                  class="variation-textarea"
                  name="descripcion"
                  rows="3"
                  ${isEditing ? "" : "readonly"}
                >${escapeHtml(descripcion)}</textarea>
              </label>

              <div class="variation-form-grid">
                <label class="variation-form-field">
                  <span class="detail-label">HTML</span>
                  <input
                    class="variation-input"
                    name="html"
                    type="text"
                    value="${escapeHtml(html)}"
                    ${isEditing ? "" : "readonly"}
                  >
                </label>

                <label class="variation-form-field">
                  <span class="detail-label">CSS URL</span>
                  <input
                    class="variation-input"
                    name="css_url"
                    type="text"
                    value="${escapeHtml(cssUrl)}"
                    ${isEditing ? "" : "readonly"}
                  >
                </label>
              </div>

              <label class="variation-form-field">
                <span class="detail-label">JS URL</span>
                <input
                  class="variation-input"
                  name="js_url"
                  type="text"
                  value="${escapeHtml(jsUrl)}"
                  ${isEditing ? "" : "readonly"}
                >
              </label>

              <div class="variation-card-actions">
                ${
                  isEditing
                    ? `
                      <button type="submit">Guardar cambios</button>
                      <button
                        type="button"
                        class="secondary"
                        data-action="cancel-variation-edit"
                        data-variation-id="${escapeHtml(variationId)}"
                      >
                        Cancelar
                      </button>
                    `
                    : `
                      <button
                        type="button"
                        class="secondary"
                        data-action="edit-variation"
                        data-variation-id="${escapeHtml(variationId)}"
                      >
                        Editar
                      </button>
                    `
                }
              </div>

              <p class="status variation-inline-status" data-variation-status="${escapeHtml(variationId)}">
                ${isEditing ? "Editá los campos y guardá los cambios." : ""}
              </p>
            </form>
          </article>
        `;
      })
      .join("");
  }

  setVariationEditStatus(variationId, message = "") {
    const normalizedVariationId = String(variationId ?? "");
    const statusNode = document.querySelector(
      `[data-variation-status="${normalizedVariationId}"]`
    );
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setVariationEditLoading(variationId, loading) {
    const normalizedVariationId = String(variationId ?? "");
    const form = document.querySelector(
      `[data-variation-form][data-variation-id="${normalizedVariationId}"]`
    );
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const controls = form.querySelectorAll("input, select, textarea, button");
    controls.forEach((control) => {
      control.disabled = loading;
    });
  }

  buildTipoComponenteOptions({
    tiposComponente = [],
    selectedValue = "",
  } = {}) {
    if (!Array.isArray(tiposComponente) || tiposComponente.length === 0) {
      return [
        `
          <option value="">
            No hay tipos de componente disponibles
          </option>
        `,
      ];
    }

    return tiposComponente.map((tipoComponente) => {
      const value = String(tipoComponente?.id_tipo_componente ?? "");
      const isSelected = value === String(selectedValue ?? "");

      return `
        <option value="${escapeHtml(value)}" ${isSelected ? "selected" : ""}>
          ${escapeHtml(`#${tipoComponente?.id_tipo_componente ?? "-"} · ${tipoComponente?.nombre ?? "-"}`)}
        </option>
      `;
    });
  }
}
