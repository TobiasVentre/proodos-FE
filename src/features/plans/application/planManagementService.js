import { executeUpdatePlanUseCase } from "./use-cases/updatePlanUseCase.js";

export class PlanManagementService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async updatePlan(input) {
    return executeUpdatePlanUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
