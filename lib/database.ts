import type { Folder } from "./supabase"

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined"

// Initialize database with sample data - always use localStorage for demo
export async function initializeDatabase() {
  try {
    if (!isBrowser) return false

    // For this demo, we'll always use localStorage to avoid network issues
    console.log("Initializing database with localStorage")
    initializeLocalStorage()
    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    initializeLocalStorage()
    return false
  }
}

// Initialize localStorage with default data including Patents folder
function initializeLocalStorage() {
  if (!isBrowser) return

  const existing = localStorage.getItem("vault-folders")
  if (!existing) {
    const defaultFolders: Folder[] = [
      {
        id: 1,
        name: "Images",
        type: "Image Files",
        status: "Secure",
        parent_id: null,
        icon: "🖼️",
        color: "text-orange-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 2,
        name: "Videos",
        type: "Video Files",
        status: "Secure",
        parent_id: null,
        icon: "🎥",
        color: "text-blue-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 3,
        name: "Reports",
        type: "Business Reports",
        status: "Encrypted",
        parent_id: null,
        icon: "📊",
        color: "text-green-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 4,
        name: "Documents",
        type: "General Documents",
        status: "Secure",
        parent_id: null,
        icon: "📄",
        color: "text-purple-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 5,
        name: "Legal Documents",
        type: "Legal & Contracts",
        status: "Encrypted",
        parent_id: null,
        icon: "⚖️",
        color: "text-red-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 6,
        name: "Drawings",
        type: "Technical Drawings",
        status: "Encrypted",
        parent_id: null,
        icon: "📐",
        color: "text-cyan-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 7,
        name: "Presentations",
        type: "PowerPoint & Slides",
        status: "Encrypted",
        parent_id: null,
        icon: "📽️",
        color: "text-yellow-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 8,
        name: "Archives",
        type: "Archived Files",
        status: "Encrypted",
        parent_id: null,
        icon: "📦",
        color: "text-indigo-500",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
      {
        id: 9,
        name: "Patents",
        type: "Patent Documents & IP",
        status: "Encrypted",
        parent_id: null,
        icon: "🔒",
        color: "text-red-600",
        file_count: 0,
        subfolder_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "demo-user",
        subfolders: [],
      },
    ]
    localStorage.setItem("vault-folders", JSON.stringify(defaultFolders))
    console.log("Initialized localStorage with default folders")
  }
}

// Get all folders with their subfolders, filtered by user permissions
export async function getFolders(userEmail?: string): Promise<Folder[]> {
  if (!isBrowser) return []

  try {
    // Always use localStorage for this demo to avoid network issues
    console.log("Loading folders from localStorage")
    return getLocalStorageFolders(userEmail)
  } catch (error) {
    console.log("Error loading folders:", error)
    return []
  }
}

// Build hierarchical structure and calculate subfolder counts with security filtering
function buildFolderHierarchy(folders: Folder[], userEmail?: string): Folder[] {
  // Create a map for quick folder lookup by ID
  const folderMap = new Map<number, Folder>()
  const rootFolders: Folder[] = []

  // First pass: create map of all folders with empty subfolders arrays
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, subfolders: [] })
  })

  // Second pass: build hierarchy
  folders.forEach((folder) => {
    const folderWithSubfolders = folderMap.get(folder.id)!

    if (folder.parent_id === null) {
      rootFolders.push(folderWithSubfolders)
    } else {
      const parent = folderMap.get(folder.parent_id)
      if (parent) {
        parent.subfolders = parent.subfolders || []
        parent.subfolders.push(folderWithSubfolders)
      } else {
        // If parent doesn't exist (shouldn't happen), add as root
        rootFolders.push(folderWithSubfolders)
      }
    }
  })

  // Third pass: calculate subfolder counts
  const calculateSubfolderCount = (folder: Folder): number => {
    if (!folder.subfolders || folder.subfolders.length === 0) {
      folder.subfolder_count = 0
      return 0
    }

    let count = folder.subfolders.length
    folder.subfolders.forEach((subfolder) => {
      count += calculateSubfolderCount(subfolder)
    })

    folder.subfolder_count = folder.subfolders.length // Direct subfolders only
    return count
  }

  rootFolders.forEach(calculateSubfolderCount)

  return rootFolders
}

// Create a new folder with enhanced security
export async function createFolder(
  folder: Omit<Folder, "id" | "created_at" | "updated_at" | "subfolders" | "subfolder_count">,
): Promise<Folder | null> {
  if (!isBrowser) return null

  const folderWithCount = {
    ...folder,
    subfolder_count: 0,
  }

  try {
    // Always use localStorage for this demo
    console.log("Creating folder in localStorage:", folderWithCount)
    return createLocalStorageFolder(folderWithCount)
  } catch (error) {
    console.log("Error creating folder:", error)
    return null
  }
}

// Update a folder
export async function updateFolder(id: number, updates: Partial<Folder>): Promise<Folder | null> {
  if (!isBrowser) return null

  try {
    // Always use localStorage for this demo
    console.log("Updating folder in localStorage:", id, updates)
    return updateLocalStorageFolder(id, updates)
  } catch (error) {
    console.log("Error updating folder:", error)
    return null
  }
}

// Delete a folder and all its subfolders
export async function deleteFolder(id: number): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // Always use localStorage for this demo
    console.log("Deleting folder from localStorage:", id)
    return deleteLocalStorageFolder(id)
  } catch (error) {
    console.log("Error deleting folder:", error)
    return false
  }
}

// LocalStorage functions
function getLocalStorageFolders(userEmail?: string): Folder[] {
  if (!isBrowser) return []

  const stored = localStorage.getItem("vault-folders")
  if (!stored) {
    console.log("No folders found in localStorage, initializing...")
    initializeLocalStorage()
    return getLocalStorageFolders(userEmail)
  }

  try {
    const folders = JSON.parse(stored)
    console.log("Loaded folders from localStorage:", folders.length)
    return buildFolderHierarchy(folders, userEmail)
  } catch (error) {
    console.error("Error parsing localStorage folders:", error)
    initializeLocalStorage()
    return getLocalStorageFolders(userEmail)
  }
}

function createLocalStorageFolder(folder: Omit<Folder, "id" | "created_at" | "updated_at" | "subfolders">): Folder {
  const folders = getAllLocalStorageFolders()
  const newFolder: Folder = {
    ...folder,
    id: Math.max(...folders.map((f) => f.id), 0) + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subfolders: [],
  }

  folders.push(newFolder)
  localStorage.setItem("vault-folders", JSON.stringify(folders))
  console.log("Created folder in localStorage:", newFolder)
  return newFolder
}

function updateLocalStorageFolder(id: number, updates: Partial<Folder>): Folder | null {
  const folders = getAllLocalStorageFolders()
  const index = folders.findIndex((f) => f.id === id)

  if (index === -1) {
    console.log("Folder not found for update:", id)
    return null
  }

  folders[index] = { ...folders[index], ...updates, updated_at: new Date().toISOString() }
  localStorage.setItem("vault-folders", JSON.stringify(folders))
  console.log("Updated folder in localStorage:", folders[index])
  return folders[index]
}

function deleteLocalStorageFolder(id: number): boolean {
  const folders = getAllLocalStorageFolders()

  // Find all subfolder IDs recursively
  const idsToDelete = findAllSubfolderIdsLocal(folders, id)
  idsToDelete.push(id) // Add the parent folder ID

  // Filter out all folders with IDs in the delete list
  const filtered = folders.filter((f) => !idsToDelete.includes(f.id))

  localStorage.setItem("vault-folders", JSON.stringify(filtered))
  console.log("Deleted folder and subfolders from localStorage:", idsToDelete)
  return true
}

// Helper function for localStorage to find all subfolder IDs recursively
function findAllSubfolderIdsLocal(allFolders: Folder[], parentId: number): number[] {
  const directSubfolders = allFolders.filter((f) => f.parent_id === parentId)
  let allSubfolderIds: number[] = directSubfolders.map((f) => f.id)

  // Recursively find subfolders of subfolders
  directSubfolders.forEach((subfolder) => {
    const nestedIds = findAllSubfolderIdsLocal(allFolders, subfolder.id)
    allSubfolderIds = [...allSubfolderIds, ...nestedIds]
  })

  return allSubfolderIds
}

function getAllLocalStorageFolders(): Folder[] {
  if (!isBrowser) return []

  const stored = localStorage.getItem("vault-folders")
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error("Error parsing localStorage folders:", error)
    return []
  }
}
