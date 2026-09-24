import { LoginForm } from "@/components/login-form"
import { AuthGate } from "@/components/auth-gate"

export default function LoginPage() {
  return (
    <AuthGate>
      <div
        className="
          flex min-h-svh flex-col items-center justify-center gap-6
          bg-[url('/bg-white.png')]
          bg-cover bg-center bg-no-repeat
          p-6
          dark:bg-[url('/bg.png')]
          md:p-10
        "
      >
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </AuthGate>
  )
}