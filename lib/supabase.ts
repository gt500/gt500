import { createClient } from "@supabase/supabase-js"

// Provide fallback values if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Check if we have valid Supabase credentials
const hasValidCredentials =
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseAnonKey !== "placeholder-key" &&
  supabaseUrl.includes("supabase.co")

// Only create client if we have valid credentials
export const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseAnonKey) : null

// Client-side singleton pattern with error handling
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  // Always return null if credentials are invalid - forces localStorage fallback
  if (!hasValidCredentials) {
    console.log("Supabase credentials not available, using localStorage fallback")
    throw new Error("Supabase credentials not available")
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Database types
export interface Folder {
  id: number
  name: string
  type: string
  status: "Secure" | "Encrypted" | "Active"
  parent_id: number | null
  icon: string
  color: string
  file_count: number
  subfolder_count?: number // Make this optional
  created_at: string
  updated_at: string
  user_id: string
  subfolders?: Folder[]
}
