export type ProfileVisibility = "private" | "basic" | "public"
export type UserProfile = {
  displayName: string
  bio: string
  phone: string
  career: string
  instagram: string
  tiktok: string
  visibility: ProfileVisibility
}
export const EMPTY_PROFILE: UserProfile = { displayName: "", bio: "", phone: "", career: "", instagram: "", tiktok: "", visibility: "private" }
