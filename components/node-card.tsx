"use client"

import type React from "react"

import type { ReactNode } from "react"

interface NodeProps {
  node: {
    id: number
    title: string
    icon: ReactNode
    color: string
    description: string
    url: string
    x?: number
    y?: number
  }
  isActive: boolean
  isAnimating: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  style?: React.CSSProperties
}

export default function NodeCard({ node, isActive, isAnimating, onMouseEnter, onMouseLeave, style }: NodeProps) {
  const handleClick = () => {
    try {
      // Special case for Digital Assets
      if (node.id === 4) {
        // Navigate to the digital assets vault page
        window.location.href = "/digital-assets-vault"
        return
      }

      // Special case for Centsys Fire
      if (node.id === 10) {
        // Open in a new window with specific features to make it look more like an app
        const newWindow = window.open(
          "/gweb-iframe",
          "_blank",
          "width=1200,height=800,menubar=no,toolbar=no,location=no",
        )

        // Focus the new window
        if (newWindow) {
          newWindow.focus()
        }
        return
      }

      // Special case for Merchant Portal
      if (node.id === 13) {
        // Open in a new window with specific features to make it look more like an app
        const newWindow = window.open(
          "/merchant-portal",
          "_blank",
          "width=1200,height=800,menubar=no,toolbar=no,location=no",
        )

        // Focus the new window
        if (newWindow) {
          newWindow.focus()
        }
        return
      }

      // Special case for Verifone-EMS
      if (node.id === 12) {
        // Open in a new window with specific features to make it look more like an app
        const newWindow = window.open(
          "/verifone-ems",
          "_blank",
          "width=1200,height=800,menubar=no,toolbar=no,location=no",
        )

        // Focus the new window
        if (newWindow) {
          newWindow.focus()
        }
        return
      }

      // Special case for Gaz2Go Dashboard
      if (node.id === 11) {
        // Open in a new window with specific features to make it look more like an app
        const newWindow = window.open(
          "/gaz2go-dashboard",
          "_blank",
          "width=1200,height=800,menubar=no,toolbar=no,location=no",
        )

        // Focus the new window
        if (newWindow) {
          newWindow.focus()
        }
        return
      }

      // Special case for Mobiclock Pro
      if (node.id === 2) {
        // Open in a new window with specific features to make it look more like an app
        const newWindow = window.open(
          "/mobiclock-pro",
          "_blank",
          "width=1200,height=800,menubar=no,toolbar=no,location=no",
        )

        // Focus the new window
        if (newWindow) {
          newWindow.focus()
        }
        return
      }

      // Special case for Gaz2Go
      if (node.id === 14) {
        // Open in a new window with specific features to make it look more like an app
        const newWindow = window.open("/gaz2go", "_blank", "width=1200,height=800,menubar=no,toolbar=no,location=no")

        // Focus the new window
        if (newWindow) {
          newWindow.focus()
        }
        return
      }

      // Special case for AI Super Helpers
      if (node.id === 7) {
        // Open the URL directly in a new tab instead of using an iframe
        window.open("https://dashboard.superhelpers.ai/", "_blank")
        return
      }

      // Make sure the URL is properly formatted
      let url = node.url

      // Check if URL has a protocol, if not add https://
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url
      }

      // Replace any spaces in the URL with proper encoding
      url = url.replace(/\s+/g, "%20")

      // Open the URL in a new tab with all necessary options
      const newWindow = window.open(url, "_blank")

      // Fallback if window.open is blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        console.log("Opening in new tab was blocked or failed. Trying alternative method...")
        // Create an anchor element and trigger a click
        const a = document.createElement("a")
        a.href = url
        a.target = "_blank"
        a.rel = "noopener noreferrer"
        a.click()
      }
    } catch (error) {
      console.error("Error opening URL:", error)
      // Fallback - alert the user
      alert(`Unable to open ${node.title} link. Please try again later.`)
    }
  }

  return (
    <div
      className={`absolute z-20 w-[140px] rounded-lg ${node.color} p-1 transition-all duration-300 cursor-pointer ${
        isActive ? "scale-110 shadow-lg shadow-blue-500/30" : "scale-100"
      } ${isAnimating ? "animate-pulse" : ""}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      role="button"
      aria-label={`Open ${node.title}`}
      tabIndex={0}
    >
      <div className="bg-slate-800 rounded-md p-3 h-full">
        <div className="flex flex-col items-center text-center">
          <div className={`${isActive ? "text-blue-400" : "text-gray-400"} transition-colors duration-300`}>
            {node.icon}
          </div>
          <h3 className="text-sm font-bold text-white mt-2">{node.title}</h3>
          {isActive && (
            <div className="mt-1 animate-fadeIn">
              <p className="text-xs text-gray-400">{node.description}</p>
              <div className="mt-2 text-xs text-blue-400 flex items-center justify-center">
                <span>Click to open</span>
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
