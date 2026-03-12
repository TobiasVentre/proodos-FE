export class AppShellScreenController {
  constructor(elements) {
    this.elements = elements;
  }

  showLogin(message = "") {
    this.elements.loginScreen.classList.remove("hidden");
    this.elements.appScreen.classList.add("hidden");
    this.elements.loginMessage.textContent = message;
  }

  showApp(user) {
    this.elements.loginScreen.classList.add("hidden");
    this.elements.appScreen.classList.remove("hidden");
    const roles = Array.isArray(user.roles) ? user.roles.join(", ") : "";
    this.elements.userInfo.textContent = `Usuario: ${user.username} | Roles: ${roles}`;
    this.elements.loginMessage.textContent = "";
  }

  setActiveView(viewName) {
    const views = [
      { key: "api-tester", element: this.elements.apiTesterView, nav: this.elements.navApiTesterBtn },
      { key: "landings", element: this.elements.landingsView, nav: this.elements.navLandingsBtn },
      { key: "componentes", element: this.elements.componentsView, nav: this.elements.navComponentsBtn },
      { key: "preview-landing", element: this.elements.previewView, nav: null },
    ];

    for (const view of views) {
      if (view.element) {
        view.element.classList.toggle("hidden", view.key !== viewName);
      }

      if (view.nav) {
        view.nav.classList.toggle("is-active", view.key === viewName);
      }
    }
  }

  setAvailableViews(viewNames = []) {
    const visibleViews = new Set(viewNames);
    const navigation = [
      { key: "api-tester", element: this.elements.navApiTesterBtn },
      { key: "landings", element: this.elements.navLandingsBtn },
      { key: "componentes", element: this.elements.navComponentsBtn },
    ];

    for (const item of navigation) {
      if (!item.element) {
        continue;
      }

      item.element.classList.toggle("hidden", !visibleViews.has(item.key));
    }
  }

  setResponse(payload) {
    this.elements.responseOutput.textContent =
      typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  }

  setLoginLoading(loading) {
    this.elements.loginBtn.disabled = loading;
  }

  setRequestLoading(loading) {
    this.elements.requestBtn.disabled = loading;
  }
}
