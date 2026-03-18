import { buildBearerHeaders } from "../../../../shared/application/requireValidToken.js";

const parseRequiredPositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} debe ser un entero positivo.`);
  }

  return parsed;
};

export const executeUnassignComponenteFromLandingUseCase = async ({
  input,
  httpClient,
  authService,
  beBase,
}) => {
  const id_landing = parseRequiredPositiveInteger(input?.id_landing, "id_landing");
  const id_componente = parseRequiredPositiveInteger(input?.id_componente, "id_componente");
  const headers = await buildBearerHeaders(authService);

  await httpClient.request({
    method: "DELETE",
    url: `${beBase}/landings/${id_landing}/componentes/${id_componente}`,
    headers,
  });

  return {
    id_landing,
    id_componente,
  };
};
