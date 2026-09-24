"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authErrorMessage, loginWithGoogle, signupWithEmail } from "@/lib/auth/firebase-client"
import { AUTH_CONSTANTS } from "@/lib/auth/constants"

function firebaseCode(error: unknown) { return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : "" }

export function SignupForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true)
    try {
      await signupWithEmail(email.trim().toLowerCase(), password)
      window.location.assign(AUTH_CONSTANTS.routes.dashboard)
    } catch (cause) { setError(authErrorMessage(firebaseCode(cause))) } finally { setLoading(false) }
  }
  async function handleGoogle() { setError(""); setLoading(true); try { await loginWithGoogle(); window.location.assign(AUTH_CONSTANTS.routes.dashboard) } catch (cause) { setError(authErrorMessage(firebaseCode(cause))) } finally { setLoading(false) } }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("flex w-full flex-col gap-7", className)}
    >
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <FieldGroup className="gap-5">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-2 flex flex-col items-center text-center"
          >
            <Link href="/" className="mb-5">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <Image
                  src="/logo.svg"
                  alt="Papirar"
                  width={44}
                  height={44}
                  priority
                  className="h-11 w-11 object-contain dark:invert"
                />
              </motion.div>
            </Link>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Crie sua conta
            </h1>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Comece agora e organize seus estudos no Papirar.
            </p>

            <FieldDescription className="mt-2">
              Já possui uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              >
                Entrar
              </Link>
            </FieldDescription>
          </motion.div>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10"
            />
          </Field>

          {/* Senha */}
          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </Field>

          <label className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-1 size-3.5 shrink-0 accent-foreground"
              required
            />
            <span>
              Concordo com os{" "}
              <Link href="/termos" className="text-foreground underline underline-offset-2">
                Termos de Uso
              </Link>{" "}
              e reconheço a{" "}
              <Link href="/privacidade" className="text-foreground underline underline-offset-2">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>

          {/* Criar conta */}
          <Field className="pt-1">
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                disabled={loading || !acceptedTerms}
                className="h-10 w-full font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Criando..." : "Criar conta"}
              </Button>
            </motion.div>
          </Field>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          <FieldSeparator className="my-1 [&_[data-slot=field-separator-content]]:rounded-full">
  ou continue com
</FieldSeparator>

          {/* Social */}
          <Field>
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="h-10 w-full"
              >
                <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Google</title><g clip-path="url(#clip0_95_488)"><path d="M24.2663 12.7764C24.2663 11.9607 24.2001 11.1406 24.059 10.3381H12.7402V14.9591H19.222C18.953 16.4494 18.0888 17.7678 16.8233 18.6056V21.6039H20.6903C22.9611 19.5139 24.2663 16.4274 24.2663 12.7764Z" fill="#4285F4"></path><path d="M12.7401 24.5008C15.9766 24.5008 18.7059 23.4382 20.6945 21.6039L16.8276 18.6055C15.7517 19.3375 14.3627 19.752 12.7445 19.752C9.61388 19.752 6.95946 17.6399 6.00705 14.8003H2.0166V17.8912C4.05371 21.9434 8.2029 24.5008 12.7401 24.5008Z" fill="#34A853"></path><path d="M6.00277 14.8003C5.50011 13.3099 5.50011 11.6961 6.00277 10.2057V7.11481H2.01674C0.314734 10.5056 0.314734 14.5004 2.01674 17.8912L6.00277 14.8003Z" fill="#FBBC04"></path><path d="M12.7401 5.24966C14.4509 5.2232 16.1044 5.86697 17.3434 7.04867L20.7695 3.62262C18.6001 1.5855 15.7208 0.465534 12.7401 0.500809C8.2029 0.500809 4.05371 3.05822 2.0166 7.11481L6.00264 10.2058C6.95064 7.36173 9.60947 5.24966 12.7401 5.24966Z" fill="#EA4335"></path></g><defs><clipPath id="clip0_95_488"><rect width="24" height="24" fill="white" transform="translate(0.5 0.5)"></rect></clipPath></defs></svg>

                Google
              </Button>
            </motion.div>
          </Field>
        </FieldGroup>
      </form>

    </motion.div>
  )
}
