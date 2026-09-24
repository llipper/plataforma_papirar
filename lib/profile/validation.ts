import type { UserProfile } from "./types"
export function validateProfile(profile: UserProfile) {
  if (profile.displayName.trim().length < 2 || profile.displayName.trim().length > 80) return false
  if (profile.bio.length > 500 || profile.phone.length > 30 || profile.career.length > 100) return false
  if (profile.instagram.length > 80 || profile.tiktok.length > 80) return false
  return ["private", "basic", "public"].includes(profile.visibility)
}
