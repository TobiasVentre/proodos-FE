export const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  return String(value);
};

export const renderLinkOrText = (value) => {
  const normalized = formatValue(value);
  if (/^https?:\/\//i.test(normalized)) {
    return `<a class="detail-link" href="${escapeHtml(normalized)}" target="_blank" rel="noreferrer">${escapeHtml(normalized)}</a>`;
  }

  return escapeHtml(normalized);
};

export const renderFieldGrid = (fields) => `
  <div class="detail-grid">
    ${fields
      .map(
        (field) => `
          <div class="detail-field">
            <span class="detail-label">${escapeHtml(field.label)}</span>
            <strong class="detail-value">${field.isLink ? renderLinkOrText(field.value) : escapeHtml(formatValue(field.value))}</strong>
          </div>
        `
      )
      .join("")}
  </div>
`;
