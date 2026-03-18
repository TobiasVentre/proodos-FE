import { executeGenerateLandingExportUseCase } from "./use-cases/generateLandingExportUseCase.js";

export class LandingExportService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
  }

  async generate(landingIdInput) {
    return executeGenerateLandingExportUseCase({
      landingIdInput,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
    });
  }
}
