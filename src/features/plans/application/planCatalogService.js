import { executeGetPlanByIdUseCase } from "./use-cases/getPlanByIdUseCase.js";
import { executeListPlansUseCase } from "./use-cases/listPlansUseCase.js";

export class PlanCatalogService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async listPlans() {
    return executeListPlansUseCase({
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async getPlanById(planIdInput) {
    return executeGetPlanByIdUseCase({
      planIdInput,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
