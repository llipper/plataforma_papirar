import { browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"
import { firebaseAuth } from "@/lib/firebase/client"

export async function loginWithEmail(email: string, password: string) {
  await setPersistence(firebaseAuth, browserLocalPersistence)
  return signInWithEmailAndPassword(firebaseAuth, email, password)
}
export async function signupWithEmail(email: string, password: string) {
  await setPersistence(firebaseAuth, browserLocalPersistence)
  return createUserWithEmailAndPassword(firebaseAuth, email, password)
}
export async function loginWithGoogle() {
  await setPersistence(firebaseAuth, browserLocalPersistence)
  return signInWithPopup(firebaseAuth, new GoogleAuthProvider())
}
export function authErrorMessage(code: string) {
  const errors: Record<string, string> = { "auth/invalid-credential": "E-mail ou senha inválidos.", "auth/email-already-in-use": "Este e-mail já está cadastrado.", "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.", "auth/popup-closed-by-user": "O login com Google foi cancelado." }
  return errors[code] ?? "Não foi possível concluir a autenticação."
}
