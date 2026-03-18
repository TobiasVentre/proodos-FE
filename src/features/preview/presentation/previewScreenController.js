export class PreviewScreenController {
  constructor(elements) {
    this.elements = elements;
  }

  togglePreviewPanels({ hasDocument = false, hasExportCode = false } = {}) {
    const previewContainer = this.elements.previewFrame?.closest(".preview-container");
    const exportContainer = this.elements.previewExportOutput?.closest(".preview-export");

    if (previewContainer) {
      previewContainer.classList.toggle("hidden", !hasDocument);
    }

    if (exportContainer) {
      exportContainer.classList.toggle("hidden", !hasExportCode);
    }
  }

  setPreviewLoading(loading) {
    this.elements.previewBtn.disabled = loading;
    if (this.elements.previewExportBtn) {
      this.elements.previewExportBtn.disabled = loading;
    }
  }

  setPreviewStatus(message = "") {
    this.elements.previewStatus.textContent = message;
  }

  setPreviewDocument(documentHtml) {
    this.elements.previewFrame.setAttribute("sandbox", "");
    this.elements.previewFrame.setAttribute("referrerpolicy", "no-referrer");
    this.elements.previewFrame.srcdoc = documentHtml;
    this.togglePreviewPanels({
      hasDocument: Boolean(String(documentHtml ?? "").trim()),
      hasExportCode: Boolean(
        this.elements.previewExportOutput?.textContent &&
          this.elements.previewExportOutput.textContent.trim()
      ),
    });
  }

  setPreviewExportCode(documentHtml = "") {
    if (!this.elements.previewExportOutput) {
      return;
    }

    this.elements.previewExportOutput.textContent = String(documentHtml ?? "");
    this.togglePreviewPanels({
      hasDocument: Boolean(
        this.elements.previewFrame?.srcdoc && this.elements.previewFrame.srcdoc.trim()
      ),
      hasExportCode: Boolean(String(documentHtml ?? "").trim()),
    });
  }

  setPreviewDebug(payload) {
    if (!this.elements.previewDebugOutput) {
      return;
    }

    this.elements.previewDebugOutput.textContent =
      typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  }

  setComponentPreviewStatus(message = "") {
    const statusNode = document.getElementById("componentPreviewStatus");
    if (statusNode) {
      statusNode.textContent = message;
    }
  }

  setComponentPreviewDocument(documentHtml = "") {
    const frame = document.getElementById("componentPreviewFrame");
    if (frame) {
      frame.setAttribute("sandbox", "");
      frame.setAttribute("referrerpolicy", "no-referrer");
      frame.srcdoc = documentHtml;
    }
  }
}
