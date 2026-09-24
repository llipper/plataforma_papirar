import { SignupForm } from "@/components/signup-form"
import { AuthGate } from "@/components/auth-gate"

export default function SignupPage() {
  return (
    <AuthGate>
      <main
        className="
          relative flex min-h-svh items-center justify-center overflow-hidden
          bg-[url('/bg-white.png')]
          bg-cover bg-center bg-no-repeat
          p-6
          dark:bg-[url('/bg.png')]
          md:p-10
        "
      >
        <div className="relative z-10 w-full max-w-sm">
          <SignupForm />
        </div>
      </main>
    </AuthGate>
  )
}