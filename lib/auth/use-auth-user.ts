"use client"
import { onAuthStateChanged, type User } from "firebase/auth"
import { useEffect, useState } from "react"
import { firebaseAuth } from "@/lib/firebase/client"
export function useAuthUser() { const [user, setUser] = useState<User | null>(firebaseAuth.currentUser); useEffect(() => onAuthStateChanged(firebaseAuth, setUser), []); return user }
