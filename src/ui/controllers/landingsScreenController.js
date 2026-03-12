import { escapeHtml } from "../shared/renderUtils.js";

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

  renderLandingList(landings = []) {
    if (!this.elements.landingListContainer) {
      return;
    }

    if (!Array.isArray(landings) || landings.length === 0) {
      this.elements.landingListContainer.innerHTML = `
        <div class="landing-empty">
          <strong>No hay landings para mostrar.</strong>
        </div>
      `;
      return;
    }

    this.elements.landingListContainer.innerHTML = landings
      .map((landing) => {
        const landingId = escapeHtml(landing?.id_landing ?? "");
        const url = escapeHtml(landing?.URL ?? "-");
        const estado = escapeHtml(landing?.estado ?? "-");
        const segmento = escapeHtml(landing?.segmento ?? "-");

        return `
          <article class="landing-item" data-landing-id="${landingId}">
            <div class="landing-item-main">
              <div class="landing-item-top">
                <span class="landing-badge">#${landingId}</span>
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
                data-landing-id="${landingId}"
              >
                Abrir en preview
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }
}
