import { executeAssignComponenteToLandingUseCase } from "./use-cases/assignComponenteToLandingUseCase.js";
import { executeListAssignableComponentesUseCase } from "./use-cases/listAssignableComponentesUseCase.js";
import { executeListLandingComponentesUseCase } from "./use-cases/listLandingComponentesUseCase.js";
import { executeUnassignComponenteFromLandingUseCase } from "./use-cases/unassignComponenteFromLandingUseCase.js";

export class LandingManagementService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async listAssignableComponentes() {
    return executeListAssignableComponentesUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async listLandingComponentes(landingIdInput) {
    return executeListLandingComponentesUseCase({
      landingIdInput,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async assignComponenteToLanding(input) {
    return executeAssignComponenteToLandingUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async unassignComponenteFromLanding(input) {
    return executeUnassignComponenteFromLandingUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
