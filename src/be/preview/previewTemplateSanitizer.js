const BLOCKED_SELECTORS = [
  "script",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "link",
  "meta",
  "base",
];

const URL_ATTRIBUTES = ["href", "src", "action", "formaction", "xlink:href"];

const isSafeUrlValue = (value) => {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return true;
  }

  if (normalized.startsWith("#")) {
    return true;
  }

  if (/^(https?:|\/|\.\/|\.\.\/)/i.test(normalized)) {
    return true;
  }

  if (/^(mailto:|tel:)/i.test(normalized)) {
    return true;
  }

  if (/^data:image\//i.test(normalized)) {
    return true;
  }

  return false;
};

const sanitizeNodeAttributes = (element) => {
  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase();
    const value = attribute.value;

    if (name.startsWith("on")) {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (URL_ATTRIBUTES.includes(name) && !isSafeUrlValue(value)) {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (name === "target") {
      element.setAttribute("rel", "noopener noreferrer");
    }
  }
};

export const sanitizePreviewTemplate = (templateHtml) => {
  const rawTemplate = String(templateHtml ?? "");

  if (typeof DOMParser === "undefined") {
    return rawTemplate;
  }

  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(`<body>${rawTemplate}</body>`, "text/html");

  documentFragment.querySelectorAll(BLOCKED_SELECTORS.join(",")).forEach((node) => {
    node.remove();
  });

  documentFragment.body.querySelectorAll("*").forEach((element) => {
    sanitizeNodeAttributes(element);
  });

  return documentFragment.body.innerHTML;
};
