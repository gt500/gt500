"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Edit, Save, X } from "lucide-react"
import Link from "next/link"

interface Note {
  id: string
  title: string
  content: string
  date: string
}

export default function AuthenticatedVault() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  // Load sample notes on component mount
  useEffect(() => {
    const sampleNotes: Note[] = [
      {
        id: "1",
        title: "Security Protocol Update",
        content: "Updated firewall configurations for all Gaz2Go locations. Implemented new encryption standards.",
        date: "2023-11-15",
      },
      {
        id: "2",
        title: "Maintenance Schedule",
        content: "Scheduled maintenance for all systems on the 25th. Downtime expected between 2-4 AM.",
        date: "2023-11-10",
      },
      {
        id: "3",
        title: "New Integration",
        content: "Centsys Fire system now integrated with central monitoring. All alerts will be logged centrally.",
        date: "2023-11-05",
      },
    ]
    setNotes(sampleNotes)
    setActiveNote(sampleNotes[0])
  }, [])

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "Start typing your note here...",
      date: new Date().toISOString().split("T")[0],
    }
    setNotes([newNote, ...notes])
    setActiveNote(newNote)
    setIsEditing(true)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
  }

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    if (activeNote && activeNote.id === id) {
      setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null)
    }
  }

  const handleEditNote = () => {
    if (!activeNote) return
    setIsEditing(true)
    setEditTitle(activeNote.title)
    setEditContent(activeNote.content)
  }

  const handleSaveNote = () => {
    if (!activeNote) return
    const updatedNote = {
      ...activeNote,
      title: editTitle,
      content: editContent,
    }
    const updatedNotes = notes.map((note) => (note.id === activeNote.id ? updatedNote : note))
    setNotes(updatedNotes)
    setActiveNote(updatedNote)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 mr-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Digital Vault
            </Link>
            <h1 className="text-2xl font-bold">Authenticated Vault</h1>
          </div>
          <div>
            <span className="text-blue-400">User: </span>
            <span className="font-semibold">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <div className="w-1/4 bg-slate-800 rounded-lg p-4 mr-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Notes</h2>
            <button
              onClick={handleAddNote}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              aria-label="Add new note"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeNote && activeNote.id === note.id ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"
                }`}
                onClick={() => setActiveNote(note)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNote(note.id)
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-300 truncate mt-1">{note.content}</p>
                <p className="text-xs text-gray-400 mt-2">{note.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 bg-slate-800 rounded-lg p-6 overflow-y-auto">
          {activeNote ? (
            <>
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-xl font-bold"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-[calc(100vh-300px)] bg-slate-700 border border-slate-600 rounded-lg p-4 text-gray-200"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{activeNote.title}</h2>
                    <button
                      onClick={handleEditNote}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-gray-200 min-h-[300px] whitespace-pre-line">
                    {activeNote.content}
                  </div>
                  <div className="mt-4 text-sm text-gray-400">Last updated: {activeNote.date}</div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-xl">No note selected</p>
              <button
                onClick={handleAddNote}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create a new note
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
