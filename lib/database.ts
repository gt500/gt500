import { getSupabaseClient } from "./supabase"
import type { Folder } from "./supabase"

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined"

// Initialize database with sample data if empty
export async function initializeDatabase() {
  try {
    if (!isBrowser) return false

    // Try Supabase first
    const supabase = getSupabaseClient()
    const { data: existingFolders, error } = await supabase.from("folders").select("id").limit(1)

    if (error) {
      console.log("Supabase not available, using localStorage:", error.message)
      initializeLocalStorage()
      return false
    }

    if (!existingFolders || existingFolders.length === 0) {
      // Insert initial data
      const initialFolders = [
        {
          name: "Images",
          type: "Image Files",
          status: "Secure" as const,
          icon: "🖼️",
          color: "text-orange-500",
          file_count: 0,
          subfolder_count: 0, // Added subfolder count
          user_id: "demo-user",
        },
        {
          name: "Videos",
          type: "Video Files",
          status: "Secure" as const,
          icon: "🎥",
          color: "text-blue-500",
          file_count: 0,
          subfolder_count: 0,
          user_id: "demo-user",
        },
        {
          name: "Reports",
          type: "Business Reports",
          status: "Encrypted" as const,
          icon: "📊",
          color: "text-green-500",
          file_count: 0,
          subfolder_count: 0,
          user_id: "demo-user",
        },
        {
          name: "Documents",
          type: "General Documents",
          status: "Secure" as const,
          icon: "📄",
          color: "text-purple-500",
          file_count: 0,
          subfolder_count: 0,
          user_id: "demo-user",
        },
        {
          name: "Legal Documents",
          type: "Legal & Contracts",
          status: "Encrypted" as const,
          icon: "⚖️",
          color: "text-red-500",
          file_count: 0,
          subfolder_count: 0,
          user_id: "demo-user",
        },
        {
          name: "Drawings",
          type: "Technical Drawings",
          status: "Active" as const,
          icon: "📐",
          color: "text-cyan-500",
          file_count: 0,
          subfolder_count: 0,
          user_id: "demo-user",
        },
        {
          name: "Presentations",
          type: "PowerPoint & Slides",
          status: "Secure" as const,
          icon: "📽️",
          color: "text-yellow-500",
          file_count: 0,
          subfolder_count: 0,
          user_id: "demo-user",
        },
        {
          name: "Archives",
          type: "Archived Files",
          status: "Encrypted" as const,
          icon: "📦",
          color: "text-indigo-500",
          file_count: 0,
          subfolder_count: 0,
          user_id: "demo-user",
        },
      ]

      const { error: insertError } = await supabase.from("folders").insert(initialFolders)

      if (insertError) {
        console.error("Error inserting initial data:", insertError)
        initializeLocalStorage()
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    initializeLocalStorage()
    return false
  }
}

// Initialize localStorage with default data
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
        subfolder_count: 0, // Added subfolder count
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
        status: "Active",
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
        status: "Secure",
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
    ]
    localStorage.setItem("vault-folders", JSON.stringify(defaultFolders))
  }
}

// Get all folders with their subfolders
export async function getFolders(): Promise<Folder[]> {
  if (!isBrowser) return []

  try {
    // Try Supabase first
    const supabase = getSupabaseClient()

    // Get all folders in a single query for better performance
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", "demo-user")
      .order("created_at", { ascending: true })

    if (error) {
      console.log("Supabase error, using localStorage:", error.message)
      return getLocalStorageFolders()
    }

    return buildFolderHierarchy(data || [])
  } catch (error) {
    console.log("Network error, using localStorage:", error)
    return getLocalStorageFolders()
  }
}

// Build hierarchical structure and calculate subfolder counts
function buildFolderHierarchy(folders: Folder[]): Folder[] {
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

// Create a new folder
export async function createFolder(
  folder: Omit<Folder, "id" | "created_at" | "updated_at" | "subfolders" | "subfolder_count">,
): Promise<Folder | null> {
  if (!isBrowser) return null

  const folderWithCount = {
    ...folder,
    subfolder_count: 0,
  }

  try {
    // Try Supabase first
    const supabase = getSupabaseClient()

    // Ensure parent_id is properly handled
    const folderToCreate = {
      ...folderWithCount,
      parent_id: folder.parent_id === undefined ? null : folder.parent_id, // Explicitly set null if undefined
    }

    // Log the folder being created for debugging
    console.log("Creating folder:", folderToCreate)

    const { data, error } = await supabase.from("folders").insert([folderToCreate]).select().single()

    if (error) {
      console.log("Supabase error creating folder:", error.message)
      return createLocalStorageFolder(folderWithCount)
    }

    console.log("Folder created successfully:", data)
    return data
  } catch (error) {
    console.log("Network error creating folder:", error)
    return createLocalStorageFolder(folderWithCount)
  }
}

// Update a folder
export async function updateFolder(id: number, updates: Partial<Folder>): Promise<Folder | null> {
  if (!isBrowser) return null

  try {
    // Try Supabase first
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("folders")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single
