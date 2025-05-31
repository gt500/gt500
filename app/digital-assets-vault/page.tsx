"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Unlock,
  AlertCircle,
  FileDigit,
  Plus,
  Edit2,
  Save,
  X,
  ImageIcon,
  Video,
  FileText,
  BarChart,
  FileArchive,
  FilePen,
  Presentation,
  Scale,
  Upload,
  Trash2,
  LogOut,
  Users,
  FolderIcon,
  Globe,
  MonitorSmartphone,
  Cpu,
  Cog,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  initializeDatabase,
  type Folder as FolderType,
} from "@/lib/database"
import FileUpload from "@/components/file-upload"

export default function DigitalAssetsVault() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [authError, setAuthError] = useState("")
  const [vaultOpen, setVaultOpen] = useState(false)
  const [doorAnimation, setDoorAnimation] = useState("")

  // Correct password for demo purposes
  const correctPassword = "vault2024"

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsUnlocking(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (password === correctPassword) {
      setDoorAnimation("opening")

      // Wait for door animation to complete (5 seconds)
      setTimeout(() => {
        setVaultOpen(true)
        setIsAuthenticated(true)
        setIsUnlocking(false)
      }, 5000)
    } else {
      setAuthError("Invalid password. Access denied.")
      setIsUnlocking(false)
      setDoorAnimation("shake")

      // Clear shake animation
      setTimeout(() => setDoorAnimation(""), 1000)
    }
  }

  const handleLockVault = () => {
    setDoorAnimation("closing")
    setVaultOpen(false)

    setTimeout(() => {
      setIsAuthenticated(false)
      setPassword("")
      setDoorAnimation("")
    }, 5000)
  }

  if (isAuthenticated && vaultOpen) {
    return <VaultInterior onLockVault={handleLockVault} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,rgba(59,130,246,0)_70%)]"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Digital Vault Hub
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-6xl mx-auto px-6">
          {/* Vault Door Container */}
          <div className="relative flex items-center justify-center">
            {/* Vault Door */}
            <div className={`relative ${doorAnimation === "shake" ? "animate-pulse" : ""}`}>
              <VaultDoor
                isUnlocking={isUnlocking}
                isOpening={doorAnimation === "opening"}
                isClosing={doorAnimation === "closing"}
              />

              {/* Authentication Panel - positioned over the vault door */}
              {!vaultOpen && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Card className="w-96 bg-slate-800/95 border-slate-600 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
                        <Shield className="h-6 w-6 mr-2 text-yellow-500" />
                        Digital Assets Vault
                      </CardTitle>
                      <p className="text-slate-400">Enter authentication to access secure vault</p>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAuthentication} className="space-y-4">
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter vault password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white pr-10"
                            disabled={isUnlocking}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            disabled={isUnlocking}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        {authError && (
                          <div className="flex items-center text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {authError}
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                          disabled={isUnlocking || !password}
                        >
                          {isUnlocking ? (
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
                              Authenticating...
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4 mr-2" />
                              Unlock Vault
                            </>
                          )}
                        </Button>
                      </form>

                      <div className="mt-4 text-center text-xs text-slate-500">Demo password: vault2024</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Vault Door Component - Using your uploaded image directly
function VaultDoor({
  isUnlocking,
  isOpening,
  isClosing,
}: {
  isUnlocking: boolean
  isOpening: boolean
  isClosing: boolean
}) {
  return (
    <div className="relative w-[1000px] h-[800px]">
      {/* Main Vault Door using your uploaded image */}
      <div
        className={`relative w-full h-full transition-all duration-[5000ms] ease-in-out ${
          isOpening ? "transform translate-x-full opacity-0" : isClosing ? "transform translate-x-0 opacity-100" : ""
        }`}
      >
        <img src="/vault-door.png" alt="Bank Vault Door" className="w-full h-full object-contain" />

        {/* Overlay effects for unlocking animation */}
        {isUnlocking && <div className="absolute inset-0 bg-yellow-500/20 animate-pulse rounded-lg"></div>}
      </div>

      {/* Status Lights */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex space-x-4 bg-gray-800/90 px-6 py-3 rounded-lg border border-gray-600 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full ${isUnlocking ? "bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50" : "bg-gray-600"}`}
          ></div>
          <span className="text-white text-sm font-medium">AUTH</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full ${isOpening ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50" : "bg-gray-600"}`}
          ></div>
          <span className="text-white text-sm font-medium">OPEN</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full ${isClosing ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/50" : "bg-gray-600"}`}
          ></div>
          <span className="text-white text-sm font-medium">LOCK</span>
        </div>
      </div>

      {/* Vault identification plate */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-700/90 px-6 py-2 rounded border border-gray-500 backdrop-blur-sm z-10">
        <div className="text-center">
          <div className="text-yellow-400 font-bold text-lg">DIGITAL ASSETS VAULT</div>
          <div className="text-gray-300 text-sm">SECURITY CLASS: MAXIMUM</div>
          <div className="text-gray-400 text-xs">MODEL: DAV-2024-SECURE</div>
        </div>
      </div>

      {/* Progress indicator during opening */}
      {isOpening && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 bg-gray-800/90 rounded-lg p-3 backdrop-blur-sm z-10">
          <div className="text-center text-white text-sm mb-2">Opening Vault...</div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full transition-all duration-[5000ms] ease-linear w-0 animate-[progress_5s_linear_forwards]"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Get folder icon based on folder type
const getFolderIcon = (folderType: string, isOpen = false) => {
  const type = folderType.toLowerCase()

  if (type.includes("image") || type.includes("photo")) {
    return <ImageIcon className="h-full w-full text-blue-400" />
  } else if (type.includes("video")) {
    return <Video className="h-full w-full text-red-400" />
  } else if (type.includes("document")) {
    return <FileText className="h-full w-full text-purple-400" />
  } else if (type.includes("report")) {
    return <BarChart className="h-full w-full text-green-400" />
  } else if (type.includes("archive")) {
    return <FileArchive className="h-full w-full text-indigo-400" />
  } else if (type.includes("drawing")) {
    return <FilePen className="h-full w-full text-cyan-400" />
  } else if (type.includes("presentation") || type.includes("slide")) {
    return <Presentation className="h-full w-full text-yellow-400" />
  } else if (type.includes("legal") || type.includes("contract")) {
    return <Scale className="h-full w-full text-red-400" />
  } else if (type.includes("logo")) {
    return <ImageIcon className="h-full w-full text-purple-400" />
  } else if (type.includes("brand")) {
    return <Presentation className="h-full w-full text-pink-400" />
  } else if (type.includes("banner") || type.includes("ad")) {
    return <MonitorSmartphone className="h-full w-full text-yellow-400" />
  } else if (type.includes("usa") || type.includes("market")) {
    return <Globe className="h-full w-full text-blue-400" />
  } else if (type.includes("electronic")) {
    return <Cpu className="h-full w-full text-green-400" />
  } else if (type.includes("wheel") || type.includes("product")) {
    return <Cog className="h-full w-full text-orange-400" />
  } else {
    return <FolderIcon className="h-full w-full text-blue-400" />
  }
}

// Get background color for folder icon
const getFolderIconBgColor = (folderType: string) => {
  const type = folderType.toLowerCase()

  if (type.includes("image") || type.includes("photo")) {
    return "bg-blue-500"
  } else if (type.includes("video")) {
    return "bg-red-500"
  } else if (type.includes("document")) {
    return "bg-purple-500"
  } else if (type.includes("report")) {
    return "bg-green-500"
  } else if (type.includes("archive")) {
    return "bg-indigo-500"
  } else if (type.includes("drawing")) {
    return "bg-cyan-500"
  } else if (type.includes("presentation") || type.includes("slide")) {
    return "bg-yellow-500"
  } else if (type.includes("legal") || type.includes("contract")) {
    return "bg-red-500"
  } else if (type.includes("logo")) {
    return "bg-purple-500"
  } else if (type.includes("brand")) {
    return "bg-pink-500"
  } else if (type.includes("banner") || type.includes("ad")) {
    return "bg-yellow-500"
  } else if (type.includes("usa") || type.includes("market")) {
    return "bg-blue-500"
  } else if (type.includes("electronic")) {
    return "bg-green-500"
  } else if (type.includes("wheel") || type.includes("product")) {
    return "bg-orange-500"
  } else {
    return "bg-blue-500"
  }
}

// Vault Interior Component with modern grid layout
function VaultInterior({ onLockVault }: { onLockVault: () => void }) {
  const [folders, setFolders] = useState<FolderType[]>([])
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set())
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [editingFolder, setEditingFolder] = useState<number | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderType, setNewFolderType] = useState("")
  const [newFolderStatus, setNewFolderStatus] = useState<"Secure" | "Encrypted" | "Active">("Secure")
  const [loading, setLoading] = useState(true)
  const [addingSubfolderTo, setAddingSubfolderTo] = useState<number | null>(null)
  const [showFileUpload, setShowFileUpload] = useState<number | null>(null)
  const [currentView, setCurrentView] = useState<"grid" | "folder">("grid")
  const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Refs for tracking state changes
  const foldersRef = useRef(folders)
  foldersRef.current = folders

  // Load folders on component mount - optimized with useCallback
  const loadFolders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await initializeDatabase()
      const folderData = await getFolders()
      setFolders(folderData)
    } catch (error) {
      console.error("Error loading folders:", error)
      setError("Failed to load folders. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFolders()
  }, [loadFolders])

  // Optimized folder creation with useCallback
  const handleAddFolder = useCallback(
    async (parentId: number | null = null) => {
      if (newFolderName.trim() && newFolderType.trim()) {
        setIsProcessing(true)
        try {
          const newFolder = {
            name: newFolderName.trim(),
            type: newFolderType.trim(),
            status: newFolderStatus,
            parent_id: parentId,
            icon: "📁", // We'll use Lucide icons for display, but keep emoji for database
            color: getFolderIconBgColor(newFolderType),
            file_count: 0,
            user_id: "demo-user",
          }

          const createdFolder = await createFolder(newFolder)
          if (createdFolder) {
            // If this is a subfolder, make sure the parent folder is expanded
            if (parentId) {
              setExpandedFolders((prev) => {
                const newSet = new Set(prev)
                newSet.add(parentId)
                return newSet
              })
            }

            // Reload folders to get the updated structure
            await loadFolders()
          }

          // Reset form state
          setNewFolderName("")
          setNewFolderType("")
          setNewFolderStatus("Secure")
          setShowAddFolder(false)
          setAddingSubfolderTo(null)
        } catch (error) {
          console.error("Error creating folder:", error)
          setError("Failed to create folder. Please try again.")
        } finally {
          setIsProcessing(false)
        }
      }
    },
    [newFolderName, newFolderType, newFolderStatus, loadFolders],
  )

  // Optimized folder editing
  const handleEditFolder = useCallback((folder: FolderType) => {
    setEditingFolder(folder.id)
    setNewFolderName(folder.name)
    setNewFolderType(folder.type)
    setNewFolderStatus(folder.status)
  }, [])

  // Optimized save edit function
  const handleSaveEdit = useCallback(async () => {
    if (editingFolder && newFolderName.trim() && newFolderType.trim()) {
      setIsProcessing(true)
      try {
        await updateFolder(editingFolder, {
          name: newFolderName.trim(),
          type: newFolderType.trim(),
          status: newFolderStatus,
        })
        await loadFolders()
      } catch (error) {
        console.error("Error updating folder:", error)
        setError("Failed to update folder. Please try again.")
      } finally {
        setEditingFolder(null)
        setNewFolderName("")
        setNewFolderType("")
        setNewFolderStatus("Secure")
        setIsProcessing(false)
      }
    }
  }, [editingFolder, newFolderName, newFolderType, newFolderStatus, loadFolders])

  // Optimized folder deletion
  const handleDeleteFolder = useCallback(
    async (folderId: number) => {
      if (confirm("Are you sure you want to delete this folder and all its subfolders?")) {
        setIsProcessing(true)
        try {
          await deleteFolder(folderId)
          await loadFolders()
          if (selectedFolder?.id === folderId) {
            setSelectedFolder(null)
          }
          if (currentFolder?.id === folderId) {
            setCurrentFolder(null)
            setCurrentView("grid")
          }
        } catch (error) {
          console.error("Error deleting folder:", error)
          setError("Failed to delete folder. Please try again.")
        } finally {
          setIsProcessing(false)
        }
      }
    },
    [selectedFolder, currentFolder, loadFolders],
  )

  // Optimized form cancellation
  const handleCancelEdit = useCallback(() => {
    setEditingFolder(null)
    setNewFolderName("")
    setNewFolderType("")
    setNewFolderStatus("Secure")
    setShowAddFolder(false)
    setAddingSubfolderTo(null)
  }, [])

  // Optimized folder expansion toggle
  const toggleFolderExpansion = useCallback((folderId: number) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }, [])

  // Optimized file count update
  const handleFileCountUpdate = useCallback(
    async (folderId: number, newCount: number) => {
      try {
        await updateFolder(folderId, { file_count: newCount })
        await loadFolders()
      } catch (error) {
        console.error("Error updating file count:", error)
        setError("Failed to update file count. Please try again.")
      }
    },
    [loadFolders],
  )

  // Handle folder click - open folder view
  const handleFolderClick = useCallback((folder: FolderType) => {
    setCurrentFolder(folder)
    setCurrentView("folder")
  }, [])

  // Handle back to grid view
  const handleBackToGrid = useCallback(() => {
    setCurrentView("grid")
    setCurrentFolder(null)
  }, [])

  // Handle subfolder click
  const handleSubfolderClick = useCallback((subfolder: FolderType) => {
    // Find the complete subfolder data with all properties
    const findFullSubfolderData = (folders: FolderType[], id: number): FolderType | null => {
      for (const folder of folders) {
        if (folder.id === id) return folder
        if (folder.subfolders) {
          const found = findFullSubfolderData(folder.subfolders, id)
          if (found) return found
        }
      }
      return null
    }

    const fullSubfolderData = findFullSubfolderData(foldersRef.current, subfolder.id)
    if (fullSubfolderData) {
      setCurrentFolder(fullSubfolderData)
    }
  }, [])

  // Count total folders
  const totalFolders = useMemo(() => {
    let count = 0
    const countFolders = (folders: FolderType[]) => {
      count += folders.length
      folders.forEach((folder) => {
        if (folder.subfolders && folder.subfolders.length > 0) {
          countFolders(folder.subfolders)
        }
      })
    }
    countFolders(folders)
    return count
  }, [folders])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading vault...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Hub
            </Link>
            <div className="flex items-center">
              <div className="bg-slate-800 rounded-md p-1 mr-3">
                <img src="/images/gaz2go-logo-transparent.png" alt="Gaz2Go Logo" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Gaz2go Digital Vault</h1>
                <p className="text-slate-400 text-sm">Asset Management System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white">Welcome, Frank</div>
              <div className="text-slate-400 text-sm">frank@gaz2go.co.za</div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Status Cards */}
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#1e293b] border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-slate-400">Total Folders</h2>
                  <p className="text-4xl font-bold text-white mt-1">{totalFolders}</p>
                  <p className="text-slate-400 text-sm mt-1">Main asset categories</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <FolderIcon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e293b] border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-slate-400">Authorized Users</h2>
                  <p className="text-4xl font-bold text-white mt-1">7</p>
                  <p className="text-slate-400 text-sm mt-1">Active team members</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e293b] border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-slate-400">Security Status</h2>
                  <p className="text-4xl font-bold text-green-400 mt-1">Active</p>
                  <p className="text-slate-400 text-sm mt-1">All systems secure</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
              {error}
            </div>
            <button onClick={() => setError(null)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="bg-blue-900/50 border border-blue-700 text-white p-4 rounded-lg mb-6 flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing your request...
          </div>
        )}

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Asset Vault</h2>
          <p className="text-slate-400">Click on any vault to access and manage digital assets</p>
        </div>

        {/* Grid View */}
        {currentView === "grid" && (
          <>
            {/* Add Folder Button */}
            <div className="mb-6">
              <Button onClick={() => setShowAddFolder(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Folder
              </Button>
            </div>

            {/* Add New Root Folder Form */}
            {showAddFolder && (
              <Card className="bg-[#1e293b] border-slate-700 border-dashed mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Add New Root Folder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Folder type"
                    value={newFolderType}
                    onChange={(e) => setNewFolderType(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <select
                    value={newFolderStatus}
                    onChange={(e) => setNewFolderStatus(e.target.value as "Secure" | "Encrypted" | "Active")}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="Secure">Secure</option>
                    <option value="Encrypted">Encrypted</option>
                    <option value="Active">Active</option>
                  </select>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddFolder()}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={isProcessing}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1" disabled={isProcessing}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Folders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => handleFolderClick(folder)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg ${getFolderIconBgColor(folder.type)} p-2 mr-4`}>
                        {getFolderIcon(folder.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Gaz2go {folder.name}</h3>
                        <p className="text-slate-400">{folder.file_count} items</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{folder.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Folder View */}
        {currentView === "folder" && currentFolder && (
          <>
            {/* Folder Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="mr-4" onClick={handleBackToGrid}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Folders
                </Button>
                <div className={`w-10 h-10 rounded-lg ${getFolderIconBgColor(currentFolder.type)} p-2 mr-3`}>
                  {getFolderIcon(currentFolder.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Gaz2go {currentFolder.name}</h2>
                  <p className="text-slate-400">{currentFolder.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingSubfolderTo(currentFolder.id)}
                  disabled={isProcessing}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subfolder
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditFolder(currentFolder)}
                  disabled={isProcessing}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:border-red-400"
                  onClick={() => handleDeleteFolder(currentFolder.id)}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Add Subfolder Form */}
            {addingSubfolderTo === currentFolder.id && (
              <Card className="bg-[#1e293b] border-slate-700 border-dashed mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Add Subfolder to {currentFolder.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Subfolder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Subfolder type (e.g., Contracts, Photos, Reports)"
                    value={newFolderType}
                    onChange={(e) => setNewFolderType(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <select
                    value={newFolderStatus}
                    onChange={(e) => setNewFolderStatus(e.target.value as "Secure" | "Encrypted" | "Active")}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="Secure">Secure</option>
                    <option value="Encrypted">Encrypted</option>
                    <option value="Active">Active</option>
                  </select>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddFolder(currentFolder.id)}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={isProcessing}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Subfolder
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1" disabled={isProcessing}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Folder Form */}
            {editingFolder === currentFolder.id && (
              <Card className="bg-[#1e293b] border-slate-700 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Edit Folder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Folder type"
                    value={newFolderType}
                    onChange={(e) => setNewFolderType(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <select
                    value={newFolderStatus}
                    onChange={(e) => setNewFolderStatus(e.target.value as "Secure" | "Encrypted" | "Active")}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="Secure">Secure</option>
                    <option value="Encrypted">Encrypted</option>
                    <option value="Active">Active</option>
                  </select>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={isProcessing}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1" disabled={isProcessing}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Folder Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-[#1e293b] border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-400">Files</h3>
                      <p className="text-3xl font-bold text-white mt-1">{currentFolder.file_count}</p>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <FileDigit className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1e293b] border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-400">Subfolders</h3>
                      <p className="text-3xl font-bold text-white mt-1">{currentFolder.subfolders?.length || 0}</p>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <FolderIcon className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1e293b] border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-400">Status</h3>
                      <p
                        className={`text-3xl font-bold mt-1 ${
                          currentFolder.status === "Secure"
                            ? "text-green-400"
                            : currentFolder.status === "Encrypted"
                              ? "text-blue-400"
                              : "text-yellow-400"
                        }`}
                      >
                        {currentFolder.status}
                      </p>
                    </div>
                    <div
                      className={`${
                        currentFolder.status === "Secure"
                          ? "bg-green-500/20"
                          : currentFolder.status === "Encrypted"
                            ? "bg-blue-500/20"
                            : "bg-yellow-500/20"
                      } p-3 rounded-lg`}
                    >
                      <Shield
                        className={`h-5 w-5 ${
                          currentFolder.status === "Secure"
                            ? "text-green-400"
                            : currentFolder.status === "Encrypted"
                              ? "text-blue-400"
                              : "text-yellow-400"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subfolders */}
            {currentFolder.subfolders && currentFolder.subfolders.length > 0 ? (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Subfolders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentFolder.subfolders.map((subfolder) => (
                    <div
                      key={subfolder.id}
                      className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => handleSubfolderClick(subfolder)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg ${getFolderIconBgColor(subfolder.type)} p-2 mr-3`}>
                          {getFolderIcon(subfolder.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{subfolder.name}</h4>
                          <p className="text-slate-400 text-sm">{subfolder.file_count} files</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-8 text-center">
                <FolderIcon className="h-12 w-12 mx-auto text-slate-500 mb-3" />
                <h3 className="text-lg font-medium text-white mb-1">No Subfolders</h3>
                <p className="text-slate-400 mb-4">This folder doesn't have any subfolders yet.</p>
                <Button
                  onClick={() => setAddingSubfolderTo(currentFolder.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Subfolder
                </Button>
              </div>
            )}

            {/* File Upload Section */}
            <div className="mb-6">
              <Button
                onClick={() => setShowFileUpload(showFileUpload === currentFolder.id ? null : currentFolder.id)}
                className={showFileUpload === currentFolder.id ? "bg-slate-700" : "bg-blue-600 hover:bg-blue-700"}
              >
                <Upload className="h-4 w-4 mr-2" />
                {showFileUpload === currentFolder.id ? "Hide Upload" : "Upload Files"}
              </Button>
            </div>

            {showFileUpload === currentFolder.id && (
              <div className="mb-8">
                <FileUpload
                  folderId={currentFolder.id}
                  folderName={currentFolder.name}
                  folderPath={`vault/${currentFolder.id}/${currentFolder.name}`}
                  onFilesChange={(count) => handleFileCountUpdate(currentFolder.id, count)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
