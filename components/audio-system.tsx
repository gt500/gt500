"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX, Play, AlertCircle } from "lucide-react"

export type AudioEvent = "welcome" | "health-check-running" | "systems-healthy" | "system-issues" | "auto-fixing" | null

interface AudioSystemProps {
  currentEvent: AudioEvent
  onSystemInitialized: () => void
}

// Text fallbacks for when audio can't be played
const audioTextFallbacks = {
  welcome: "Welcome to the Digital Vault. System initialized and ready.",
  "health-check-running": "Running system diagnostics. Please wait...",
  "systems-healthy": "All systems operational. No issues detected.",
  "system-issues": "Warning: System issues detected. Review and resolve.",
  "auto-fixing": "Auto-fixing issues in progress. Please wait...",
}

export default function AudioSystem({ currentEvent, onSystemInitialized }: AudioSystemProps) {
  const [muted, setMuted] = useState(false)
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false)
  const [systemInitialized, setSystemInitialized] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [showTextFallback, setShowTextFallback] = useState(false)
  const [currentTextFallback, setCurrentTextFallback] = useState<string>("")
  const [audioSupported, setAudioSupported] = useState(true)

  // Track played events to prevent duplicates
  const playedEventsRef = useRef<Set<AudioEvent>>(new Set())

  // Audio queue to ensure full playback of each file
  const audioQueueRef = useRef<AudioEvent[]>([])
  const isPlayingRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const processingQueueRef = useRef(false)
  const currentlyPlayingRef = useRef<AudioEvent | null>(null)

  // Component mounted state
  const isMountedRef = useRef(true)

  // Map of audio sources
  const audioSources = {
    welcome: "/audio/welcome-message.mp3",
    "health-check-running": "/audio/diagnostic-running.mp3",
    "systems-healthy": "/audio/systems-healthy.mp3",
    "system-issues": "/audio/system-issues.mp3",
    "auto-fixing": "/audio/auto-fixing.mp3",
  }

  // Debug function to log audio events
  const logAudioEvent = (message: string) => {
    console.log(`[AudioSystem] ${message}`)
  }

  // Process the audio queue - simplified version
  const processAudioQueue = async () => {
    try {
      // If already processing or nothing in queue, exit
      if (processingQueueRef.current || audioQueueRef.current.length === 0 || isPlayingRef.current) {
        return
      }

      processingQueueRef.current = true

      // Get the next event from the queue
      const nextEvent = audioQueueRef.current[0]

      // Skip if this event has already been played (except welcome which we allow once)
      if (playedEventsRef.current.has(nextEvent) && nextEvent !== "welcome") {
        logAudioEvent(`Skipping already played event: ${nextEvent}`)
        audioQueueRef.current.shift()
        processingQueueRef.current = false

        // Continue processing the queue if there are more items
        if (audioQueueRef.current.length > 0) {
          setTimeout(() => processAudioQueue(), 10)
        }
        return
      }

      logAudioEvent(`Processing next audio in queue: ${nextEvent}`)
      currentlyPlayingRef.current = nextEvent

      // Play the audio
      try {
        const success = await playAudioFile(nextEvent)

        if (success) {
          // Mark this event as played
          playedEventsRef.current.add(nextEvent)
        } else {
          // If failed to play, show text fallback
          showTextMessage(nextEvent)
        }
      } catch (error) {
        logAudioEvent(`Error playing audio: ${error}`)
        showTextMessage(nextEvent)
      }

      // Remove the event from the queue regardless of success
      audioQueueRef.current.shift()
      currentlyPlayingRef.current = null
    } catch (error) {
      logAudioEvent(`Error processing audio queue: ${error}`)
    } finally {
      processingQueueRef.current = false

      // Check if there are more items in the queue
      if (audioQueueRef.current.length > 0 && !isPlayingRef.current) {
        // Process the next item after a small delay
        setTimeout(() => processAudioQueue(), 100)
      }
    }
  }

  // Add an event to the audio queue - simplified version
  const queueAudio = (event: AudioEvent) => {
    if (!event) return

    try {
      // Don't add duplicate events to the queue
      if (audioQueueRef.current.includes(event)) {
        return
      }

      // Don't add events that have already been played (except welcome which we allow once)
      if (playedEventsRef.current.has(event) && event !== "welcome") {
        return
      }

      // For welcome message, only allow it once
      if (event === "welcome" && hasPlayedWelcome) {
        return
      }

      logAudioEvent(`Adding to audio queue: ${event}`)
      audioQueueRef.current.push(event)

      // Start processing the queue if not already processing
      if (!isPlayingRef.current && !processingQueueRef.current) {
        processAudioQueue()
      }
    } catch (error) {
      logAudioEvent(`Error queuing audio: ${error}`)
    }
  }

  // Initialize audio element - simplified
  useEffect(() => {
    try {
      // Set mounted flag
      isMountedRef.current = true

      // Check if audio is supported in this browser
      if (typeof Audio === "undefined") {
        setAudioSupported(false)
        setShowTextFallback(true)
        return
      }

      // Reset played events on mount
      playedEventsRef.current = new Set()

      return () => {
        // Set unmounted flag
        isMountedRef.current = false

        // Clean up audio
        if (audioRef.current) {
          try {
            const audio = audioRef.current
            audio.pause()
            audio.src = ""
            audioRef.current = null
          } catch (error) {
            console.error("Error cleaning up audio:", error)
          }
        }

        // Clear the queue
        audioQueueRef.current = []
        isPlayingRef.current = false
        processingQueueRef.current = false
        currentlyPlayingRef.current = null
      }
    } catch (error) {
      console.error("Error in audio system initialization:", error)
      setAudioSupported(false)
    }
  }, [])

  // Update mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
  }, [muted])

  // Handle welcome message after initialization
  useEffect(() => {
    try {
      if (systemInitialized && !hasPlayedWelcome) {
        if (audioSupported && !muted) {
          queueAudio("welcome")
        } else {
          // Use text fallback
          showTextMessage("welcome")
        }
        setHasPlayedWelcome(true)
      }
    } catch (error) {
      console.error("Error handling welcome message:", error)
      setHasPlayedWelcome(true)
    }
  }, [systemInitialized, hasPlayedWelcome, muted, audioSupported])

  // Handle playing audio based on current event
  useEffect(() => {
    try {
      if (!systemInitialized || !currentEvent) return
      if (!hasPlayedWelcome && currentEvent !== "welcome") return

      logAudioEvent(`Current event changed to: ${currentEvent}`)

      if (audioSupported && !muted) {
        queueAudio(currentEvent)
      } else {
        // Use text fallback
        showTextMessage(currentEvent)
      }
    } catch (error) {
      console.error("Error handling audio event:", error)
    }
  }, [currentEvent, systemInitialized, hasPlayedWelcome, muted, audioSupported])

  // Show text message as fallback
  const showTextMessage = (event: AudioEvent) => {
    try {
      if (!event) return

      setCurrentTextFallback(audioTextFallbacks[event])
      setShowTextFallback(true)

      // Hide the message after a few seconds
      setTimeout(() => {
        setShowTextFallback(false)
      }, 5000)
    } catch (error) {
      console.error("Error showing text message:", error)
    }
  }

  // Play a single audio file and wait for it to complete - simplified
  const playAudioFile = async (event: AudioEvent): Promise<boolean> => {
    if (!event || !audioSupported) return false

    logAudioEvent(`Playing audio file for event: ${event}`)
    isPlayingRef.current = true

    try {
      // Create a new audio element
      const audio = new Audio()

      // Set the source
      const audioSource = audioSources[event as keyof typeof audioSources]
      audio.src = audioSource
      audio.muted = muted

      // Store the reference
      audioRef.current = audio

      // Create a promise that resolves when the audio ends
      const playPromise = new Promise<boolean>((resolve) => {
        // Handle successful playback completion
        audio.onended = () => {
          logAudioEvent(`Audio playback ended for ${event}`)
          isPlayingRef.current = false
          resolve(true)
        }

        // Handle errors
        audio.onerror = () => {
          logAudioEvent(`Error in audio ${event}`)
          isPlayingRef.current = false
          resolve(false)
        }

        // Set a timeout in case the audio never ends
        setTimeout(() => {
          if (isPlayingRef.current) {
            logAudioEvent(`Audio playback timeout for ${event}`)
            isPlayingRef.current = false
            resolve(false)
          }
        }, 30000) // 30 second timeout
      })

      // Start playing
      try {
        await audio.play()
        return await playPromise
      } catch (error) {
        logAudioEvent(`Error playing audio: ${error}`)
        isPlayingRef.current = false
        return false
      }
    } catch (error) {
      logAudioEvent(`Error in playAudioFile: ${error}`)
      isPlayingRef.current = false
      return false
    }
  }

  const toggleMute = () => {
    try {
      setMuted(!muted)

      // Update current audio if playing
      if (audioRef.current) {
        audioRef.current.muted = !muted
      }
    } catch (error) {
      console.error("Error toggling mute:", error)
    }
  }

  const initializeSystem = () => {
    try {
      // Initialize system regardless of audio support
      setSystemInitialized(true)
      onSystemInitialized()

      // Reset played events when system initializes
      playedEventsRef.current.clear()

      // If audio is supported, try to unlock it
      if (audioSupported) {
        try {
          // Create a new audio context to help unlock audio on iOS
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext
          if (AudioContext) {
            const audioContext = new AudioContext()

            // Resume the audio context if it's suspended
            if (audioContext.state === "suspended") {
              audioContext.resume().catch((e) => console.log("Error resuming audio context:", e))
            }
          }

          // Create and play a silent audio to unlock audio on iOS
          try {
            const silentAudio = new Audio(
              "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV",
            )
            silentAudio.volume = 0.01
            silentAudio.play().catch((e) => console.log("Silent audio error:", e))
          } catch (e) {
            console.log("Error with silent audio:", e)
          }
        } catch (error) {
          console.log("Error initializing audio context:", error)
          // Continue without audio
          setAudioSupported(false)
          setShowTextFallback(true)
        }
      }
    } catch (error) {
      console.error("Error initializing system:", error)
      // Still mark as initialized to allow the UI to render
      setSystemInitialized(true)
      onSystemInitialized()
    }
  }

  // Render initialization screen
  if (!systemInitialized) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
        <button
          onClick={initializeSystem}
          className="flex items-center gap-2 px-6 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 animate-pulse"
        >
          <Play className="h-6 w-6" />
          Initialize Digital Vault
        </button>
        <p className="mt-4 text-white text-sm opacity-80">Click to enable audio and initialize the system</p>
      </div>
    )
  }

  // Render main UI
  return (
    <>
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={toggleMute}
          className="flex items-center px-3 py-2 bg-slate-800/70 hover:bg-slate-700/70 rounded-lg text-white transition-all"
          aria-label={muted ? "Unmute voice" : "Mute voice"}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          <span className="ml-2 text-sm">Voice</span>
        </button>

        {audioError && (
          <div className="absolute top-12 left-0 bg-red-600/80 text-white text-xs p-2 rounded mt-1 max-w-[200px]">
            {audioError}
            <button className="ml-1 font-bold hover:text-gray-200" onClick={() => setAudioError(null)}>
              ×
            </button>
          </div>
        )}
      </div>

      {/* Text fallback message */}
      {showTextFallback && currentTextFallback && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800/90 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center max-w-md">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
          <p>{currentTextFallback}</p>
        </div>
      )}
    </>
  )
}
