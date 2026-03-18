const normalizeDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return value;
};

export const normalizePlanRecord = (plan) => {
  if (!plan || typeof plan !== "object") {
    return null;
  }

  const nombreDisplay = normalizeDisplayValue(plan.nombre ?? plan.nombre_plan);
  const capacidadDisplay = normalizeDisplayValue(
    plan.capacidad_plan ?? plan.capacidad
  );

  return {
    ...plan,
    nombre_display: nombreDisplay,
    capacidad_display: capacidadDisplay,
  };
};
