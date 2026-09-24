import { AUTH_CONSTANTS } from "./constants"

export type LoginInput = { email: string; password: string }
export type SignupInput = LoginInput

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxEmailLength = 254

export function normalizeEmail(email: string) { return email.trim().toLowerCase() }

export function validateLogin(input: Partial<LoginInput>) {
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : ""
  const password = typeof input.password === "string" ? input.password : ""
  return email.length <= maxEmailLength && emailPattern.test(email) && password.length >= AUTH_CONSTANTS.minPasswordLength && password.length <= 128
    ? { ok: true as const, data: { email, password } }
    : { ok: false as const }
}

export function validateSignup(input: Partial<SignupInput>) {
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : ""
  const password = typeof input.password === "string" ? input.password : ""
  return email.length <= maxEmailLength && emailPattern.test(email) && password.length >= AUTH_CONSTANTS.minPasswordLength && password.length <= 128
    ? { ok: true as const, data: { email, password } }
    : { ok: false as const }
}
