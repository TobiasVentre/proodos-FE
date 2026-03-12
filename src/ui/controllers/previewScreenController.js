export class PreviewScreenController {
  constructor(elements) {
    this.elements = elements;
  }

  setPreviewLoading(loading) {
    this.elements.previewBtn.disabled = loading;
  }

  setPreviewStatus(message = "") {
    this.elements.previewStatus.textContent = message;
  }

  setPreviewDocument(documentHtml) {
    this.elements.previewFrame.setAttribute("sandbox", "");
    this.elements.previewFrame.setAttribute("referrerpolicy", "no-referrer");
    this.elements.previewFrame.srcdoc = documentHtml;
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
