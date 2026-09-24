import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { firebaseDb } from "@/lib/firebase/client"
import { EMPTY_PROFILE, type UserProfile } from "./types"

const CACHE_PREFIX = "papirar_user_profile_"

export function getCachedUserProfile(uid: string): UserProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${uid}`)
    if (!raw) return null
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) } as UserProfile
  } catch {
    return null
  }
}

export function setCachedUserProfile(uid: string, profile: UserProfile): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`${CACHE_PREFIX}${uid}`, JSON.stringify(profile))
  } catch {
    // Ignora restrições de storage
  }
}

export async function loadUserProfile(uid: string): Promise<UserProfile> {
  const snapshot = await getDoc(doc(firebaseDb, "users", uid))
  if (snapshot.exists()) {
    const data = { ...EMPTY_PROFILE, ...(snapshot.data() as Partial<UserProfile>) }
    setCachedUserProfile(uid, data)
    return data
  }
  return EMPTY_PROFILE
}

export async function saveUserProfile(uid: string, profile: UserProfile) {
  setCachedUserProfile(uid, profile)
  await setDoc(doc(firebaseDb, "users", uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true })
}

