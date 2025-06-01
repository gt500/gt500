"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { folderPermissions } from "@/app/login/page"

export interface User {
  email: string
  name: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("vault-user")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("vault-user")
        router.push("/login")
      }
    } else {
      router.push("/login")
    }

    setLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem("vault-user")
    setUser(null)
    router.push("/login")
  }

  const checkFolderAccess = (folderName: string): boolean => {
    if (!user) return false

    // Check if folder has specific permissions
    const restrictedUsers = folderPermissions[folderName]

    // If folder doesn't have specific permissions, allow access
    if (!restrictedUsers) return true

    // Check if user's email is in the list of allowed users
    return restrictedUsers.includes(user.email)
  }

  return { user, loading, logout, checkFolderAccess }
}
