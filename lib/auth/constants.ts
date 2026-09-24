export const AUTH_CONSTANTS = {
  sessionCookie: "papirar_session",
  sessionTtlSeconds: 60 * 60 * 24 * 7,
  maxNameLength: 80,
  minPasswordLength: 8,
  routes: { dashboard: "/dashboard" },
} as const

export const AUTH_ERRORS = {
  invalidCredentials: "E-mail ou senha inválidos.",
  invalidInput: "Confira os dados informados.",
  generic: "Não foi possível concluir a operação.",
} as const
