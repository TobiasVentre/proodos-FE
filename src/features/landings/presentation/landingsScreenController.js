import { escapeHtml } from "../../../shared/presentation/ui/shared/renderUtils.js";

const normalizeList = (value) => (Array.isArray(value) ? value : []);

export class LandingsScreenController {
  constructor(elements) {
    this.elements = elements;
  }

  setLandingsLoading(loading) {
    if (this.elements.loadLandingsBtn) {
      this.elements.loadLandingsBtn.disabled = loading;
    }
  }

  setLandingsStatus(message = "") {
    if (this.elements.landingsStatus) {
      this.elements.landingsStatus.textContent = message;
    }
  }

  buildSelectOptions({
    items = [],
    selectedValue = null,
    valueKey,
    labelBuilder,
    emptyLabel,
  }) {
    const normalizedItems = normalizeList(items);
    if (!normalizedItems.length) {
      return `<option value="">${escapeHtml(emptyLabel)}</option>`;
    }

    return normalizedItems
      .map((item) => {
        const value = String(item?.[valueKey] ?? "");
        const isSelected = String(selectedValue ?? "") === value;

        return `
          <option value="${escapeHtml(value)}" ${isSelected ? "selected" : ""}>
            ${escapeHtml(labelBuilder(item))}
          </option>
        `;
      })
      .join("");
  }

  renderLandingList(payload = []) {
    if (!this.elements.landingListContainer) {
      return;
    }

    const model = Array.isArray(payload) ? { landings: payload } : payload ?? {};
    const landings = normalizeList(model.landings);
    const assignableComponents = normalizeList(model.assignableComponents);
    const componentsByLandingId =
      model.componentsByLandingId instanceof Map ? model.componentsByLandingId : new Map();
    const selectedComponentByLandingId =
      model.selectedComponentByLandingId instanceof Map
        ? model.selectedComponentByLandingId
        : new Map();
    const statusByLandingId =
      model.statusByLandingId instanceof Map ? model.statusByLandingId : new Map();
    const loadingByLandingId =
      model.loadingByLandingId instanceof Map ? model.loadingByLandingId : new Map();
    const editEnabledByLandingId =
      model.editEnabledByLandingId instanceof Map ? model.editEnabledByLandingId : new Map();

    if (!landings.length) {
      this.elements.landingListContainer.innerHTML = `
        <div class="landing-empty">
          <strong>No hay landings para mostrar.</strong>
        </div>
      `;
      return;
    }

    this.elements.landingListContainer.innerHTML = landings
      .map((landing) => {
        const landingId = String(landing?.id_landing ?? "");
        const url = escapeHtml(landing?.URL ?? "-");
        const estado = escapeHtml(landing?.estado ?? "-");
        const segmento = escapeHtml(landing?.segmento ?? "-");
        const associatedComponents = normalizeList(componentsByLandingId.get(landingId));
        const associatedComponentIds = new Set(
          associatedComponents.map((component) => String(component?.id_componente ?? ""))
        );
        const availableComponents = assignableComponents.filter(
          (component) => !associatedComponentIds.has(String(component?.id_componente ?? ""))
        );
        const selectedComponentId =
          String(selectedComponentByLandingId.get(landingId) ?? "") ||
          String(availableComponents[0]?.id_componente ?? "");
        const inlineStatus = escapeHtml(statusByLandingId.get(landingId) ?? "");
        const loading = Boolean(loadingByLandingId.get(landingId));
        const editEnabled = Boolean(editEnabledByLandingId.get(landingId));

        const associatedMarkup = associatedComponents.length
          ? `
            <div class="landing-associated-list">
              ${associatedComponents
                .map(
                  (component) => `
                    <article class="landing-associated-item">
                      <div class="landing-associated-top">
                        <div class="detail-inline">
                          <span class="landing-badge">#${escapeHtml(component?.id_componente ?? "")}</span>
                          <span class="landing-chip">${escapeHtml(component?.estado ?? "-")}</span>
                          <span class="landing-chip">Tipo ${escapeHtml(component?.id_tipo_componente ?? "-")}</span>
                          <span class="landing-chip">Variación ${escapeHtml(component?.id_tipo_variacion ?? "-")}</span>
                        </div>
                        ${
                          editEnabled
                            ? `
                              <div class="landing-associated-actions">
                                <button
                                  type="button"
                                  class="secondary"
                                  data-action="unassign-component"
                                  data-landing-id="${escapeHtml(landingId)}"
                                  data-component-id="${escapeHtml(component?.id_componente ?? "")}"
                                  ${loading ? "disabled" : ""}
                                >
                                  Desasociar
                                </button>
                              </div>
                            `
                            : ""
                        }
                      </div>
                      <strong>${escapeHtml(component?.nombre ?? "-")}</strong>
                    </article>
                  `
                )
                .join("")}
            </div>
          `
          : `
            <div class="landing-associated-empty">
              <strong>La landing no tiene componentes asociados.</strong>
            </div>
          `;

        const assignOptions = this.buildSelectOptions({
          items: availableComponents,
          selectedValue: selectedComponentId,
          valueKey: "id_componente",
          labelBuilder: (component) =>
            `#${component.id_componente} · ${component.nombre ?? "-"} · Tipo ${component.id_tipo_componente ?? "-"}`,
          emptyLabel: "No hay componentes disponibles para asociar",
        });

        return `
          <article class="landing-item" data-landing-id="${escapeHtml(landingId)}">
            <div class="landing-item-main">
              <div class="landing-item-top">
                <span class="landing-badge">#${escapeHtml(landingId)}</span>
                <span class="landing-chip">${estado}</span>
                <span class="landing-chip">${segmento}</span>
              </div>
              <p class="landing-url">${url}</p>
            </div>
            <div class="landing-actions">
              <button
                type="button"
                class="secondary"
                data-action="open-preview"
                data-landing-id="${escapeHtml(landingId)}"
              >
                Abrir en preview
              </button>
            </div>
            <section class="landing-component-panel">
              <h4>Componentes asociados</h4>
              ${associatedMarkup}
              <div class="landing-association-toolbar">
                <button
                  type="button"
                  class="secondary"
                  data-action="toggle-component-assignment"
                  data-landing-id="${escapeHtml(landingId)}"
                >
                  ${editEnabled ? "Cancelar edición" : "Editar componentes"}
                </button>
              </div>
              ${
                editEnabled
                  ? `
                    <form class="form landing-association-form" data-action="assign-component-form" data-landing-id="${escapeHtml(landingId)}">
                      <label>
                        Asociar componente
                        <select
                          name="id_componente"
                          data-action="select-component-to-assign"
                          data-landing-id="${escapeHtml(landingId)}"
                          ${loading || !availableComponents.length ? "disabled" : ""}
                        >
                          ${assignOptions}
                        </select>
                      </label>
                      <div class="landing-association-actions">
                        <button
                          type="submit"
                          ${loading || !availableComponents.length ? "disabled" : ""}
                        >
                          Asociar componente
                        </button>
                      </div>
                      <p class="status landing-inline-status">${inlineStatus}</p>
                    </form>
                  `
                  : inlineStatus
                    ? `<p class="status landing-inline-status">${inlineStatus}</p>`
                    : ""
              }
            </section>
          </article>
        `;
      })
      .join("");
  }
}
