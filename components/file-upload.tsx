"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, File, ImageIcon, Video, FileText, Download, Trash2, Eye, AlertTriangle, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { oneDriveService, type OneDriveFile } from "@/lib/onedrive"

interface FileUploadProps {
  folderId: number
  folderName: string
  folderPath: string
  onFilesChange: (count: number) => void
}

export default function FileUpload({ folderId, folderName, folderPath, onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<OneDriveFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [storageInfo, setStorageInfo] = useState<any>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load files when component mounts
  useState(() => {
    loadFiles()
  })

  // Load storage info
  useEffect(() => {
    loadStorageInfo()
  }, [files])

  const loadStorageInfo = async () => {
    const info = await oneDriveService.getStorageInfo()
    setStorageInfo(info)
  }

  const handleUpgrade = async (plan: "basic" | "premium") => {
    setUpgrading(true)
    const success = await oneDriveService.upgradeStorage(plan)
    if (success) {
      await loadStorageInfo()
      setShowUpgrade(false)
    }
    setUpgrading(false)
  }

  const loadFiles = async () => {
    try {
      const folderFiles = await oneDriveService.getFiles(folderPath)
      setFiles(folderFiles)
      onFilesChange(folderFiles.length)
    } catch (error) {
      console.error("Error loading files:", error)
    }
  }

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      uploadFiles(Array.from(selectedFiles))
    }
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    setUploading(true)

    try {
      for (const file of filesToUpload) {
        const result = await oneDriveService.uploadFile(file, folderPath)
        if (result.success && result.file) {
          setFiles((prev) => [...prev, result.file!])
        }
      }

      // Update file count
      const updatedFiles = await oneDriveService.getFiles(folderPath)
      const newCount = updatedFiles.length
      setFiles(updatedFiles)
      onFilesChange(newCount)

      // Show success message
      alert(`Successfully uploaded ${filesToUpload.length} file(s). Folder now contains ${newCount} items.`)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Error uploading files. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const deleteFile = async (fileId: string) => {
    try {
      const success = await oneDriveService.deleteFile(fileId, folderPath)
      if (success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId))
        const updatedFiles = await oneDriveService.getFiles(folderPath)
        onFilesChange(updatedFiles.length)
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />
    if (mimeType.startsWith("video/")) return <Video className="h-5 w-5 text-purple-500" />
    if (mimeType.includes("pdf") || mimeType.includes("document")) return <FileText className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Add storage warning before upload area
  return (
    <div className="space-y-4">
      {/* Storage Warning */}
      {storageInfo?.isNearLimit && (
        <Card className="bg-orange-900/50 border-orange-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                <span className="text-orange-200">
                  {storageInfo.isAtLimit ? "Storage limit reached!" : "Storage nearly full!"}
                </span>
              </div>
              <Button onClick={() => setShowUpgrade(true)} size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Crown className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${storageInfo.isAtLimit ? "bg-red-500" : "bg-orange-500"}`}
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-orange-300 mt-1">
                {oneDriveService.formatBytes(storageInfo.used)} of {oneDriveService.formatBytes(storageInfo.total)} used
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-500" />
              Upgrade OneDrive Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                <h3 className="text-white font-bold mb-2">Basic Plan</h3>
                <p className="text-2xl font-bold text-blue-400 mb-2">$1.99/month</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 100GB storage</li>
                  <li>• Premium support</li>
                  <li>• Advanced security</li>
                </ul>
                <Button
                  onClick={() => handleUpgrade("basic")}
                  disabled={upgrading}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  {upgrading ? "Upgrading..." : "Choose Basic"}
                </Button>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg border border-yellow-500">
                <h3 className="text-white font-bold mb-2">Premium Plan</h3>
                <p className="text-2xl font-bold text-yellow-400 mb-2">$6.99/month</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 1TB storage</li>
                  <li>• Office 365 included</li>
                  <li>• Priority support</li>
                  <li>• Advanced support</li>
                  <li>• Advanced collaboration</li>
                </ul>
                <Button
                  onClick={() => handleUpgrade("premium")}
                  disabled={upgrading}
                  className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700"
                >
                  {upgrading ? "Upgrading..." : "Choose Premium"}
                </Button>
              </div>
            </div>

            <Button onClick={() => setShowUpgrade(false)} variant="outline" className="w-full">
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload to {folderName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <p className="text-white mb-2">Drag and drop files here, or click to select</p>
            <p className="text-slate-400 text-sm mb-4">Files will be stored securely in OneDrive</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? "Uploading..." : "Select Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Files in {folderName} ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.mimeType)}
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-slate-400 text-sm">
                        {formatFileSize(file.size)} • {new Date(file.createdDateTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(file.webUrl, "_blank")}
                      className="text-slate-400 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(file.downloadUrl, "_blank")}
                      className="text-slate-400 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteFile(file.id)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* OneDrive Integration Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white text-sm">Connected to OneDrive</span>
            </div>
            <span className="text-slate-400 text-sm">Free 5GB Storage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
