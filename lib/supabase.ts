import { createClient } from "@supabase/supabase-js"

// Provide fallback values if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Check if we have valid Supabase credentials
const hasValidCredentials =
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseAnonKey !== "placeholder-key" &&
  supabaseUrl.includes("supabase.co")

export const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseAnonKey) : null

// Client-side singleton pattern
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!hasValidCredentials) {
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
