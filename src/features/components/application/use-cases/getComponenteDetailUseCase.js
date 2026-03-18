import { normalizeApiData } from "../../../../shared/application/normalizeApiData.js";
import { normalizePlanRecord } from "../../../../shared/application/normalizePlanRecord.js";
import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const getErrorMessage = (error, fallbackMessage) =>
  error instanceof Error ? error.message : fallbackMessage;

const requestGet = async ({ httpClient, beBase, path, headers }) =>
  httpClient.request({
    method: "GET",
    url: `${beBase}${path}`,
    headers,
  });

export const executeGetComponenteDetailUseCase = async ({
  componentIdInput,
  httpClient,
  authService,
  beBase,
}) => {
  const componentId = Number(componentIdInput);
  if (!isPositiveInteger(componentId)) {
    throw new Error("El ID de componente debe ser un entero positivo.");
  }

  const headers = await buildBearerHeaders(authService);
  const warnings = [];
  const component = normalizeApiData(
    await requestGet({
      httpClient,
      beBase,
      path: `/componentes/${componentId}`,
      headers,
    })
  );

  const componentPlan = normalizePlanRecord(
    component?.plan && typeof component.plan === "object" ? component.plan : null
  );

  const landingRelationsPromise = requestGet({
    httpClient,
    beBase,
    path: `/componentes/${componentId}/landings`,
    headers,
  })
    .then((response) => normalizeApiData(response))
    .then((payload) => (Array.isArray(payload) ? payload : []))
    .then((relations) =>
      relations
        .map((relation) => relation?.landing ?? relation)
        .filter(Boolean)
    )
    .catch((error) => {
      warnings.push(
        `No se pudieron cargar las landings asociadas: ${getErrorMessage(
          error,
          "error desconocido"
        )}`
      );
      return [];
    });

  const elementosPromise = requestGet({
    httpClient,
    beBase,
    path: `/elementos-componente?id_componente=${componentId}`,
    headers,
  })
    .then((response) => normalizeApiData(response))
    .then((payload) => (Array.isArray(payload) ? payload : []))
    .catch((error) => {
      warnings.push(
        `No se pudieron cargar los elementos asociados: ${getErrorMessage(
          error,
          "error desconocido"
        )}`
      );
      return [];
    });

  const componentTreePromise = requestGet({
    httpClient,
    beBase,
    path: `/componentes/${componentId}/arbol`,
    headers,
  })
    .then((response) => normalizeApiData(response))
    .catch((error) => {
      warnings.push(
        `No se pudo cargar el árbol del componente: ${getErrorMessage(
          error,
          "error desconocido"
        )}`
      );
      return null;
    });

  const tipoComponentePromise = isPositiveInteger(Number(component?.id_tipo_componente))
    ? requestGet({
        httpClient,
        beBase,
        path: `/tipos-componente/${component.id_tipo_componente}`,
        headers,
      })
        .then((response) => normalizeApiData(response))
        .catch((error) => {
          warnings.push(
            `No se pudo cargar el tipo de componente: ${getErrorMessage(
              error,
              "error desconocido"
            )}`
          );
          return null;
        })
    : Promise.resolve(null);

  const tipoVariacionPromise = isPositiveInteger(Number(component?.id_tipo_variacion))
    ? requestGet({
        httpClient,
        beBase,
        path: `/tipos-variacion/${component.id_tipo_variacion}`,
        headers,
      })
        .then((response) => normalizeApiData(response))
        .catch((error) => {
          warnings.push(
            `No se pudo cargar el tipo de variación: ${getErrorMessage(
              error,
              "error desconocido"
            )}`
          );
          return null;
        })
    : Promise.resolve(null);

  const planPromise = isPositiveInteger(Number(component?.id_plan))
    ? requestGet({
        httpClient,
        beBase,
        path: `/planes/${component.id_plan}`,
        headers,
      })
        .then((response) => normalizePlanRecord(normalizeApiData(response)))
        .catch((error) => {
          warnings.push(
            `No se pudo cargar el plan asociado: ${getErrorMessage(
              error,
              "error desconocido"
            )}`
          );
          return componentPlan;
        })
    : Promise.resolve(componentPlan);

  const [tipoComponente, tipoVariacion, plan, elementos, landings, componentTree] = await Promise.all([
    tipoComponentePromise,
    tipoVariacionPromise,
    planPromise,
    elementosPromise,
    landingRelationsPromise,
    componentTreePromise,
  ]);

  return {
    component,
    tipoComponente,
    tipoVariacion,
    plan: normalizePlanRecord(plan),
    elementos,
    landings,
    children: Array.isArray(componentTree?.hijos) ? componentTree.hijos : [],
    warnings,
  };
};
