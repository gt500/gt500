"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Unlock,
  AlertCircle,
  FileDigit,
  Plus,
  Edit2,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  ImageIcon,
  Video,
  FileText,
  BarChart,
  FileArchive,
  FilePen,
  Presentation,
  Scale,
  Upload,
  FolderOpen,
  Folder,
  Trash2,
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

// Map folder types to colorful icons
const getFolderIcon = (folderType: string, isOpen = false) => {
  const type = folderType.toLowerCase()

  if (type.includes("image") || type.includes("photo")) {
    return <ImageIcon className="h-6 w-6 text-orange-400" />
  } else if (type.includes("video")) {
    return <Video className="h-6 w-6 text-blue-400" />
  } else if (type.includes("document")) {
    return <FileText className="h-6 w-6 text-purple-400" />
  } else if (type.includes("report")) {
    return <BarChart className="h-6 w-6 text-green-400" />
  } else if (type.includes("archive")) {
    return <FileArchive className="h-6 w-6 text-indigo-400" />
  } else if (type.includes("drawing")) {
    return <FilePen className="h-6 w-6 text-cyan-400" />
  } else if (type.includes("presentation") || type.includes("slide")) {
    return <Presentation className="h-6 w-6 text-yellow-400" />
  } else if (type.includes("legal") || type.includes("contract")) {
    return <Scale className="h-6 w-6 text-red-400" />
  } else {
    // Default folder icon
    return isOpen ? <FolderOpen className="h-6 w-6 text-blue-400" /> : <Folder className="h-6 w-6 text-blue-400" />
  }
}

// Vault Interior Component with subfolder functionality
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

  // Load folders on component mount - optimized with useCallback
  const loadFolders = useCallback(async () => {
    setLoading(true)
    try {
      await initializeDatabase()
      const folderData = await getFolders()
      setFolders(folderData)
    } catch (error) {
      console.error("Error loading folders:", error)
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
        const newFolder = {
          name: newFolderName.trim(),
          type: newFolderType.trim(),
          status: newFolderStatus,
          parent_id: parentId,
          icon: "📁", // We'll use Lucide icons for display, but keep emoji for database
          color: parentId ? "text-blue-400" : "text-gray-500",
          file_count: 0,
          user_id: "demo-user",
        }

        try {
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
          alert("Failed to create folder. Please try again.")
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
      try {
        await updateFolder(editingFolder, {
          name: newFolderName.trim(),
          type: newFolderType.trim(),
          status: newFolderStatus,
        })
        await loadFolders()
      } catch (error) {
        console.error("Error updating folder:", error)
        alert("Failed to update folder. Please try again.")
      } finally {
        setEditingFolder(null)
        setNewFolderName("")
        setNewFolderType("")
        setNewFolderStatus("Secure")
      }
    }
  }, [editingFolder, newFolderName, newFolderType, newFolderStatus, loadFolders])

  // Optimized folder deletion
  const handleDeleteFolder = useCallback(
    async (folderId: number) => {
      if (confirm("Are you sure you want to delete this folder and all its subfolders?")) {
        try {
          await deleteFolder(folderId)
          await loadFolders()
          if (selectedFolder?.id === folderId) {
            setSelectedFolder(null)
          }
        } catch (error) {
          console.error("Error deleting folder:", error)
          alert("Failed to delete folder. Please try again.")
        }
      }
    },
    [selectedFolder, loadFolders],
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
      }
    },
    [loadFolders],
  )

  // Optimized folder click handler
  const handleFolderClick = useCallback(
    (folder: FolderType) => {
      // Set as selected folder
      setSelectedFolder(folder)

      // If folder has subfolders, expand it
      if (folder.subfolders && folder.subfolders.length > 0) {
        toggleFolderExpansion(folder.id)
      } else {
        // If folder has no subfolders, show the subfolder creation form
        // Close any other open forms first
        setShowAddFolder(false)
        setEditingFolder(null)
        // Open subfolder form for this folder
        setAddingSubfolderTo((current) => (current === folder.id ? null : folder.id))
      }
    },
    [toggleFolderExpansion],
  )

  // Recursive folder rendering function - memoized for performance
  const renderFolder = useCallback(
    (folder: FolderType, level = 0): React.ReactNode => {
      const isExpanded = expandedFolders.has(folder.id)
      const hasSubfolders = folder.subfolders && folder.subfolders.length > 0
      const isSelected = selectedFolder?.id === folder.id

      // Get appropriate icon based on folder type
      const folderIcon = getFolderIcon(folder.type, isExpanded)

      return (
        <div key={folder.id} className="w-full">
          <Card
            className={`bg-slate-800 border-slate-700 hover:border-slate-600 cursor-pointer transition-all mb-2 ${
              isSelected ? "ring-2 ring-yellow-500" : ""
            }`}
            style={{ marginLeft: `${level * 20}px` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1" onClick={() => handleFolderClick(folder)}>
                  {hasSubfolders && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFolderExpansion(folder.id)
                      }}
                      className="mr-2 text-slate-400 hover:text-white"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  )}

                  <span className="text-2xl mr-3">{folderIcon}</span>

                  <div className="flex-1">
                    {editingFolder === folder.id ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white text-lg font-bold"
                        />
                        <Input
                          value={newFolderType}
                          onChange={(e) => setNewFolderType(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-slate-400 text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-white text-lg">{folder.name}</CardTitle>
                        <p className="text-slate-400 text-sm">{folder.type}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingFolder === folder.id ? (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={newFolderStatus}
                        onChange={(e) => setNewFolderStatus(e.target.value as "Secure" | "Encrypted" | "Active")}
                        className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-xs"
                      >
                        <option value="Secure">Secure</option>
                        <option value="Encrypted">Encrypted</option>
                        <option value="Active">Active</option>
                      </select>
                      <Button onClick={handleSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button onClick={handleCancelEdit} size="sm" variant="outline">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Close any other open forms first
                          setShowAddFolder(false)
                          setEditingFolder(null)
                          // Then open this folder's subfolder form
                          setAddingSubfolderTo(addingSubfolderTo === folder.id ? null : folder.id)
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        title="Add subfolder"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditFolder(folder)
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteFolder(folder.id)
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          folder.status === "Secure"
                            ? "bg-green-900 text-green-300"
                            : folder.status === "Encrypted"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {folder.status}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {folder.file_count} files
                    {folder.subfolder_count > 0 && (
                      <span className="text-slate-400 text-lg ml-2">• {folder.subfolder_count} subfolders</span>
                    )}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Last accessed: {new Date(folder.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowFileUpload(showFileUpload === folder.id ? null : folder.id)
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                    title="Upload files"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* File Upload Component */}
              {showFileUpload === folder.id && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <FileUpload
                    folderId={folder.id}
                    folderName={folder.name}
                    folderPath={`vault/${folder.id}/${folder.name}`}
                    onFilesChange={(count) => handleFileCountUpdate(folder.id, count)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add subfolder form - only show when adding to this specific folder */}
          {addingSubfolderTo === folder.id && (
            <Card
              className="bg-slate-800 border-slate-600 border-dashed mb-2"
              style={{ marginLeft: `${(level + 1) * 20}px` }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">Add Subfolder to {folder.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Subfolder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Input
                  placeholder="Subfolder type (e.g., Contracts, Photos, Reports)"
                  value={newFolderType}
                  onChange={(e) => setNewFolderType(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <select
                  value={newFolderStatus}
                  onChange={(e) => setNewFolderStatus(e.target.value as "Secure" | "Encrypted" | "Active")}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="Secure">Secure</option>
                  <option value="Encrypted">Encrypted</option>
                  <option value="Active">Active</option>
                </select>
                <div className="flex gap-2">
                  <Button onClick={() => handleAddFolder(folder.id)} className="bg-green-600 hover:bg-green-700 flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Subfolder
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Render subfolders - ONLY when parent folder is expanded */}
          {isExpanded && hasSubfolders && (
            <div className="ml-4">{folder.subfolders!.map((subfolder) => renderFolder(subfolder, level + 1))}</div>
          )}
        </div>
      )
    },
    [
      expandedFolders,
      selectedFolder,
      editingFolder,
      newFolderName,
      newFolderType,
      newFolderStatus,
      addingSubfolderTo,
      showFileUpload,
      handleFolderClick,
      toggleFolderExpansion,
      handleSaveEdit,
      handleCancelEdit,
      handleEditFolder,
      handleDeleteFolder,
      handleAddFolder,
      handleFileCountUpdate,
    ],
  )

  // Memoize the folder list rendering for better performance
  const folderList = useMemo(() => {
    return folders.map((folder) => renderFolder(folder))
  }, [folders, renderFolder])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading vault...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">Digital Assets Vault</h1>
              <p className="text-slate-400">Secure Storage & Management with Subfolders</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowAddFolder(true)} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Root Folder
            </Button>
            <Button onClick={onLockVault} className="bg-red-600 hover:bg-red-700 text-white">
              <Lock className="h-4 w-4 mr-2" />
              Lock Vault
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Folders Grid */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Add New Root Folder Card */}
              {showAddFolder && (
                <Card className="bg-slate-800 border-slate-600 border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Add New Root Folder</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Input
                      placeholder="Folder type"
                      value={newFolderType}
                      onChange={(e) => setNewFolderType(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <select
                      value={newFolderStatus}
                      onChange={(e) => setNewFolderStatus(e.target.value as "Secure" | "Encrypted" | "Active")}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="Secure">Secure</option>
                      <option value="Encrypted">Encrypted</option>
                      <option value="Active">Active</option>
                    </select>
                    <div className="flex gap-2">
                      <Button onClick={() => handleAddFolder()} className="bg-green-600 hover:bg-green-700 flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Render folder hierarchy - using memoized list */}
              {folderList}
            </div>
          </div>

          {/* Folder Details Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Folder Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFolder ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-6xl flex justify-center">{getFolderIcon(selectedFolder.type)}</div>
                      <h3 className="text-xl font-bold text-white mt-2">{selectedFolder.name}</h3>
                      <p className="text-slate-400">{selectedFolder.type}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contents:</span>
                        <span className="text-white font-semibold">
                          {selectedFolder.file_count === 0 ? "Empty" : `${selectedFolder.file_count} files`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span
                          className={`font-semibold ${
                            selectedFolder.status === "Secure"
                              ? "text-green-400"
                              : selectedFolder.status === "Encrypted"
                                ? "text-blue-400"
                                : "text-yellow-400"
                          }`}
                        >
                          {selectedFolder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Accessed:</span>
                        <span className="text-white">{new Date(selectedFolder.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subfolders:</span>
                        <span className="text-white">{selectedFolder.subfolders?.length || 0}</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Open Folder</Button>
                      <Button className="w-full bg-slate-700 hover:bg-slate-600">Export Contents</Button>
                      <Button
                        onClick={() => {
                          setShowAddFolder(false)
                          setEditingFolder(null)
                          setAddingSubfolderTo(selectedFolder.id)
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subfolder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <FileDigit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a folder to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
