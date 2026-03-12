import { PreviewEngine } from "./preview/previewEngine.js";
import { executeGenerateComponentPreviewUseCase } from "../use-cases/preview/generateComponentPreviewUseCase.js";

export class ComponentPreviewService {
  constructor(config) {
    this.previewEngine = new PreviewEngine(config);
  }

  async generate(detail) {
    return executeGenerateComponentPreviewUseCase({
      detail,
      previewEngine: this.previewEngine,
    });
  }
}
