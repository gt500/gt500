"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

// Define authorized users
const authorizedUsers = [
  { email: "frank@gaz2go.co.za", password: "password123", name: "Frank", role: "admin" },
  { email: "barr@gaz2go.co.za", password: "password123", name: "Barr", role: "manager" },
  { email: "brett@gaz2go.co.za", password: "password123", name: "Brett", role: "manager" },
  { email: "user1@gaz2go.co.za", password: "password123", name: "User 1", role: "user" },
  { email: "user2@gaz2go.co.za", password: "password123", name: "User 2", role: "user" },
  { email: "user3@gaz2go.co.za", password: "password123", name: "User 3", role: "user" },
  { email: "user4@gaz2go.co.za", password: "password123", name: "User 4", role: "user" },
]

// Define folder access permissions
export const folderPermissions = {
  "Legal Documents": ["barr@gaz2go.co.za", "frank@gaz2go.co.za", "brett@gaz2go.co.za"],
  Presentations: ["barr@gaz2go.co.za", "frank@gaz2go.co.za", "brett@gaz2go.co.za"],
  Drawings: ["barr@gaz2go.co.za", "frank@gaz2go.co.za", "brett@gaz2go.co.za"],
  // All other folders are accessible by default
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoggingIn(true)

    try {
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if user exists
      const user = authorizedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

      if (user) {
        // Store user info in localStorage
        localStorage.setItem(
          "vault-user",
          JSON.stringify({
            email: user.email,
            name: user.name,
            role: user.role,
          }),
        )

        // Redirect to digital assets vault
        router.push("/digital-assets-vault")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error("Login error:", err)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block bg-slate-800 p-3 rounded-lg mb-4">
            <Image
              src="/images/gaz2go-logo-transparent.png"
              alt="Gaz2Go Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Gaz2go Digital Vault</h1>
          <p className="text-slate-400 mt-2">Secure asset management system</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center">Login to Access Vault</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-white p-3 rounded-lg flex items-center text-sm">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-slate-400">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gaz2go.co.za"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-slate-700 border-slate-600 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-slate-500 mt-4">
                <p>Demo credentials:</p>
                <p>Email: frank@gaz2go.co.za | Password: password123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
