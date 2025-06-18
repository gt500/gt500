"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { folderPermissions } from "@/app/login/page"

export interface User {
  email: string
  name: string
  role: string
  securityLevel: number
  sessionToken: string
  loginTime: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      // Check if user is logged in and session is valid
      const storedUser = localStorage.getItem("vault-user")
      const sessionToken = localStorage.getItem("vault-session-token")

      if (storedUser && sessionToken) {
        try {
          const userData = JSON.parse(storedUser)

          // Verify session token matches
          if (userData.sessionToken === sessionToken) {
            // Check if session is still valid (24 hours)
            const loginTime = new Date(userData.loginTime)
            const now = new Date()
            const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

            if (hoursDiff < 24) {
              setUser(userData)
              console.log(`Security Event: Session validated for ${userData.email} (Level ${userData.securityLevel})`)
            } else {
              // Session expired
              console.log(`Security Event: Session expired for ${userData.email}`)
              logout()
            }
          } else {
            // Invalid session token
            console.log("Security Alert: Invalid session token detected")
            logout()
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
          logout()
        }
      } else {
        // No stored user, redirect to login
        router.push("/login")
      }
    } catch (error) {
      console.error("Error in auth check:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = () => {
    try {
      if (user) {
        console.log(`Security Event: User ${user.email} logged out`)
      }
      localStorage.removeItem("vault-user")
      localStorage.removeItem("vault-session-token")
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      // Force redirect even if there's an error
      router.push("/login")
    }
  }

  const checkFolderAccess = (folderName: string): boolean => {
    if (!user) return false

    try {
      // Check if folder has specific permissions
      const folderSecurity = folderPermissions[folderName]

      // If folder doesn't have specific permissions, allow access for basic security level
      if (!folderSecurity) {
        return user.securityLevel >= 1
      }

      // Check if user's email is in the list of allowed users
      const hasAccess = folderSecurity.allowedUsers.includes(user.email)

      // Also check security level requirement
      const hasSecurityLevel = user.securityLevel >= folderSecurity.securityLevel

      const accessGranted = hasAccess && hasSecurityLevel

      if (!accessGranted) {
        console.log(`Security Event: Access denied to ${folderName} for ${user.email} (Level ${user.securityLevel})`)
      }

      return accessGranted
    } catch (error) {
      console.error("Error checking folder access:", error)
      return false
    }
  }

  const checkFolderVisibility = (folderName: string): boolean => {
    if (!user) return false

    try {
      // Check if folder has specific permissions
      const folderSecurity = folderPermissions[folderName]

      // If folder doesn't have specific permissions, it's visible to all
      if (!folderSecurity) return true

      // For folders with visibility controls, check if user is in allowed list
      if (folderSecurity.visible === false) {
        const isVisible = folderSecurity.allowedUsers.includes(user.email)

        if (!isVisible) {
          console.log(`Security Event: Folder ${folderName} hidden from ${user.email}`)
        }

        return isVisible
      }

      // For other restricted folders, show them but control access
      return true
    } catch (error) {
      console.error("Error checking folder visibility:", error)
      return false
    }
  }

  const getFolderEncryption = (folderName: string): string => {
    try {
      const folderSecurity = folderPermissions[folderName]
      return folderSecurity?.encryptionType || "AES-128"
    } catch (error) {
      console.error("Error getting folder encryption:", error)
      return "AES-128"
    }
  }

  const getSecurityLevel = (folderName: string): number => {
    try {
      const folderSecurity = folderPermissions[folderName]
      return folderSecurity?.securityLevel || 1
    } catch (error) {
      console.error("Error getting security level:", error)
      return 1
    }
  }

  return {
    user,
    loading,
    logout,
    checkFolderAccess,
    checkFolderVisibility,
    getFolderEncryption,
    getSecurityLevel,
  }
}
