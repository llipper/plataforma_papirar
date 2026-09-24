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
import {
  authErrorMessage,
  loginWithEmail,
  loginWithGoogle,
} from "@/lib/auth/firebase-client"
import { AUTH_CONSTANTS } from "@/lib/auth/constants"

function firebaseCode(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : ""
}

export function LoginForm({ className }: { className?: string }) {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await loginWithEmail(email.trim().toLowerCase(), password)
      window.location.assign(AUTH_CONSTANTS.routes.dashboard)
    } catch (cause) {
      setError(authErrorMessage(firebaseCode(cause)))
    } finally {
      setLoading(false)
    }
  }
  async function handleGoogle() {
    setError("")
    setLoading(true)
    try {
      await loginWithGoogle()
      window.location.assign(AUTH_CONSTANTS.routes.dashboard)
    } catch (cause) {
      setError(authErrorMessage(firebaseCode(cause)))
    } finally {
      setLoading(false)
    }
  }

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
              Bem-vindo de volta
            </h1>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Entre na sua conta para continuar seus estudos.
            </p>

            <FieldDescription className="mt-2">
              Ainda não tem uma conta?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              >
                Cadastre-se
              </Link>
            </FieldDescription>
          </motion.div>

          {/* E-mail */}
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
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Senha</FieldLabel>

              <Link
                href="/esqueci-senha"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
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

          {/* Entrar */}
          <Field className="pt-1">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={loading}
                className="h-10 w-full font-medium transition-all duration-200"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </motion.div>
          </Field>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <FieldSeparator className="my-1 [&_[data-slot=field-separator-content]]:rounded-full">
  ou continue com
</FieldSeparator>

          {/* Login social */}
          <Field className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" type="button" className="h-10 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-4"
                >
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                Apple
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="h-10 w-full"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Google</title>
                  <g clip-path="url(#clip0_95_488)">
                    <path
                      d="M24.2663 12.7764C24.2663 11.9607 24.2001 11.1406 24.059 10.3381H12.7402V14.9591H19.222C18.953 16.4494 18.0888 17.7678 16.8233 18.6056V21.6039H20.6903C22.9611 19.5139 24.2663 16.4274 24.2663 12.7764Z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12.7401 24.5008C15.9766 24.5008 18.7059 23.4382 20.6945 21.6039L16.8276 18.6055C15.7517 19.3375 14.3627 19.752 12.7445 19.752C9.61388 19.752 6.95946 17.6399 6.00705 14.8003H2.0166V17.8912C4.05371 21.9434 8.2029 24.5008 12.7401 24.5008Z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M6.00277 14.8003C5.50011 13.3099 5.50011 11.6961 6.00277 10.2057V7.11481H2.01674C0.314734 10.5056 0.314734 14.5004 2.01674 17.8912L6.00277 14.8003Z"
                      fill="#FBBC04"
                    ></path>
                    <path
                      d="M12.7401 5.24966C14.4509 5.2232 16.1044 5.86697 17.3434 7.04867L20.7695 3.62262C18.6001 1.5855 15.7208 0.465534 12.7401 0.500809C8.2029 0.500809 4.05371 3.05822 2.0166 7.11481L6.00264 10.2058C6.95064 7.36173 9.60947 5.24966 12.7401 5.24966Z"
                      fill="#EA4335"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_95_488">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0.5 0.5)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
                Google
              </Button>
            </motion.div>
          </Field>
        </FieldGroup>
      </form>

      {/* Termos */}
      <FieldDescription className="px-4 text-center text-xs leading-5">
        Ao continuar, você concorda com os{" "}
        <Link
          href="/termos"
          className="text-foreground underline underline-offset-4"
        >
          Termos de Uso
        </Link>{" "}
        e a{" "}
        <Link
          href="/privacidade"
          className="text-foreground underline underline-offset-4"
        >
          Política de Privacidade
        </Link>
        .
      </FieldDescription>
    </motion.div>
  )
}
