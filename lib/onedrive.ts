"use client"

// OneDrive integration for file storage
export interface OneDriveFile {
  id: string
  name: string
  size: number
  downloadUrl: string
  webUrl: string
  createdDateTime: string
  lastModifiedDateTime: string
  mimeType: string
}

export interface UploadResult {
  success: boolean
  file?: OneDriveFile
  error?: string
}

// OneDrive storage management
export interface StorageInfo {
  used: number
  total: number
  percentage: number
  isNearLimit: boolean
  isAtLimit: boolean
}

class OneDriveService {
  private accessToken: string | null = null
  private clientId = "your-onedrive-client-id" // This would be configured in environment
  private redirectUri = window.location.origin + "/auth/onedrive"
  private storageLimit = 5 * 1024 * 1024 * 1024 // 5GB in bytes

  // Initialize OneDrive authentication
  async authenticate(): Promise<boolean> {
    try {
      // For demo purposes, we'll simulate authentication
      // In production, this would use Microsoft Graph API
      console.log("OneDrive authentication initiated...")

      // Simulate successful authentication
      this.accessToken = "demo-access-token"
      localStorage.setItem("onedrive-token", this.accessToken)
      return true
    } catch (error) {
      console.error("OneDrive authentication failed:", error)
      return false
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem("onedrive-token")
    }
    return !!this.accessToken
  }

  // Get storage information
  async getStorageInfo(): Promise<StorageInfo> {
    try {
      // Calculate used storage from all stored files
      let totalUsed = 0
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("onedrive-files-"))

      for (const key of keys) {
        const files = JSON.parse(localStorage.getItem(key) || "[]")
        totalUsed += files.reduce((sum: number, file: OneDriveFile) => sum + file.size, 0)
      }

      const percentage = (totalUsed / this.storageLimit) * 100

      return {
        used: totalUsed,
        total: this.storageLimit,
        percentage,
        isNearLimit: percentage > 80,
        isAtLimit: percentage > 95,
      }
    } catch (error) {
      console.error("Error getting storage info:", error)
      return {
        used: 0,
        total: this.storageLimit,
        percentage: 0,
        isNearLimit: false,
        isAtLimit: false,
      }
    }
  }

  // Upgrade storage plan
  async upgradeStorage(plan: "basic" | "premium"): Promise<boolean> {
    try {
      console.log(`Upgrading to ${plan} plan...`)

      // Simulate upgrade process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update storage limit based on plan
      if (plan === "basic") {
        this.storageLimit = 100 * 1024 * 1024 * 1024 // 100GB
        localStorage.setItem("onedrive-plan", "basic")
      } else if (plan === "premium") {
        this.storageLimit = 1024 * 1024 * 1024 * 1024 // 1TB
        localStorage.setItem("onedrive-plan", "premium")
      }

      return true
    } catch (error) {
      console.error("Upgrade failed:", error)
      return false
    }
  }

  // Get current plan
  getCurrentPlan(): string {
    return localStorage.getItem("onedrive-plan") || "free"
  }

  // Format bytes to human readable
  formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Upload file to OneDrive
  async uploadFile(file: File, folderPath: string): Promise<UploadResult> {
    try {
      if (!this.isAuthenticated()) {
        const authenticated = await this.authenticate()
        if (!authenticated) {
          return { success: false, error: "Authentication failed" }
        }
      }

      // For demo purposes, we'll simulate file upload
      // In production, this would use Microsoft Graph API
      console.log(`Uploading ${file.name} to OneDrive folder: ${folderPath}`)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create mock OneDrive file response
      const mockFile: OneDriveFile = {
        id: `onedrive-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        downloadUrl: `https://onedrive.live.com/download?id=${Date.now()}`,
        webUrl: `https://onedrive.live.com/view?id=${Date.now()}`,
        createdDateTime: new Date().toISOString(),
        lastModifiedDateTime: new Date().toISOString(),
        mimeType: file.type || "application/octet-stream",
      }

      // Store file reference locally for demo
      this.storeFileReference(mockFile, folderPath)

      return { success: true, file: mockFile }
    } catch (error) {
      console.error("File upload failed:", error)
      return { success: false, error: "Upload failed" }
    }
  }

  // Get files in a folder
  async getFiles(folderPath: string): Promise<OneDriveFile[]> {
    try {
      const storedFiles = localStorage.getItem(`onedrive-files-${folderPath}`)
      return storedFiles ? JSON.parse(storedFiles) : []
    } catch (error) {
      console.error("Error getting files:", error)
      return []
    }
  }

  // Store file reference locally (for demo)
  private storeFileReference(file: OneDriveFile, folderPath: string) {
    try {
      const existingFiles = this.getFiles(folderPath)
      const updatedFiles = [...existingFiles, file]
      localStorage.setItem(`onedrive-files-${folderPath}`, JSON.stringify(updatedFiles))
    } catch (error) {
      console.error("Error storing file reference:", error)
    }
  }

  // Delete file from OneDrive
  async deleteFile(fileId: string, folderPath: string): Promise<boolean> {
    try {
      const existingFiles = await this.getFiles(folderPath)
      const updatedFiles = existingFiles.filter((f) => f.id !== fileId)
      localStorage.setItem(`onedrive-files-${folderPath}`, JSON.stringify(updatedFiles))
      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }
}

export const oneDriveService = new OneDriveService()
