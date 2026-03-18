import { executeCreateVariationUseCase } from "./use-cases/createVariationUseCase.js";
import { executeUpdateVariationUseCase } from "./use-cases/updateVariationUseCase.js";

export class VariationManagementService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async createVariation(input) {
    return executeCreateVariationUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }

  async updateVariation(input) {
    return executeUpdateVariationUseCase({
      input,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
