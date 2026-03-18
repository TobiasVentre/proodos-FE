import { PreviewEngine } from "../infrastructure/previewEngine.js";
import { executeGenerateLandingPreviewUseCase } from "./use-cases/generateLandingPreviewUseCase.js";

export class LandingPreviewService {
  constructor(httpClient, authService, config) {
    this.httpClient = httpClient;
    this.authService = authService;
    this.beBase = config.BE_API_BASE.replace(/\/+$/, "");
    this.previewEngine = new PreviewEngine(config);
  }

  async generate(landingIdInput) {
    return executeGenerateLandingPreviewUseCase({
      landingIdInput,
      httpClient: this.httpClient,
      authService: this.authService,
      beBase: this.beBase,
      previewEngine: this.previewEngine,
    });
  }
}
