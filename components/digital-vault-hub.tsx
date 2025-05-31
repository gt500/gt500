"use client"

import { useEffect, useRef, useState } from "react"
import {
  Shield,
  Lock,
  Database,
  Key,
  FileDigit,
  Server,
  Cloud,
  Bot,
  HardDrive,
  Network,
  Fingerprint,
  Eye,
  Scan,
  ShieldCheck,
  Layers,
  Activity,
} from "lucide-react"
import NodeCard from "./node-card"
import HealthIssuePanel, { type HealthIssue } from "./health-issue-panel"
import AudioSystem, { type AudioEvent } from "./audio-system"

// Define our node data with URLs - each node will open its URL in a new tab when clicked
const nodeData = [
  {
    id: 1,
    title: "Media Players",
    icon: <Shield className="h-6 w-6" />,
    color: "bg-blue-500",
    description: "Manage Media for Ads and access levels",
    url: "https://example.com/access",
  },
  {
    id: 2,
    title: "Mobiclock Pro",
    icon: <Key className="h-6 w-6" />,
    color: "bg-green-500",
    description: "Advanced time tracking and logistics system",
    url: "https://mobi-clock-pro-admin-g2g.flutterflow.app/",
  },
  {
    id: 3,
    title: "Data Storage",
    icon: <Database className="h-6 w-6" />,
    color: "bg-purple-500",
    description: "Encrypted data storage solutions",
    url: "https://example.com/storage",
  },
  {
    id: 4,
    title: "Digital Assets",
    icon: <FileDigit className="h-6 w-6" />,
    color: "bg-yellow-500",
    description: "Secure digital asset management",
    url: "/digital-assets-vault",
  },
  {
    id: 5,
    title: "Server Security",
    icon: <Server className="h-6 w-6" />,
    color: "bg-red-500",
    description: "Advanced server protection",
    url: "https://example.com/server",
  },
  {
    id: 6,
    title: "Cloud Backup",
    icon: <Cloud className="h-6 w-6" />,
    color: "bg-indigo-500",
    description: "Automated cloud backup systems",
    url: "https://example.com/cloud",
  },
  {
    id: 7,
    title: "AI Super Helpers",
    icon: <Bot className="h-6 w-6" />,
    color: "bg-pink-500",
    description: "AI-powered assistance and automation",
    url: "https://app.superhelpers.ai/",
  },
  {
    id: 8,
    title: "Camera Portal",
    icon: <HardDrive className="h-6 w-6" />,
    color: "bg-orange-500",
    description: "Camera storage solutions",
    url: "https://euw1-vms.tplinkcloud.com/#/vms/device",
  },
  {
    id: 9,
    title: "Route Optimizer",
    icon: <Network className="h-6 w-6" />,
    color: "bg-teal-500",
    description: "Advanced route optimization",
    url: "https://example.com/network",
  },
  {
    id: 10,
    title: "Centsys Fire",
    icon: <Fingerprint className="h-6 w-6" />,
    color: "bg-cyan-500",
    description: "Multi-Site fire suppression monitor",
    url: "https://www.gweb.co.za/Login",
  },
  {
    id: 11,
    title: "Gaz2Go Dashboard",
    icon: <Eye className="h-6 w-6" />,
    color: "bg-lime-500",
    description: "Real-time gas inventory monitoring system",
    url: "https://g2g-dashboard.aimrxd.com/version-test/",
  },
  {
    id: 12,
    title: "Verifone-EMS",
    icon: <Scan className="h-6 w-6" />,
    color: "bg-emerald-500",
    description: "Transaction verification system",
    url: "https://sbsa-ems.verifone.com/verifoneportal/#!/login",
  },
  {
    id: 13,
    title: "Merchant Portal",
    icon: <ShieldCheck className="h-6 w-6" />,
    color: "bg-rose-500",
    description: "Standard Bank Merchant Portal",
    url: "https://merchantonline.standardbank.co.za/MerchantPortal/MerchantPortal/MerchAuthentication/Login",
  },
  {
    id: 14,
    title: "Gaz2Go",
    icon: <Layers className="h-6 w-6" />,
    color: "bg-amber-500",
    description: "Gas delivery and management platform",
    url: "https://gaz2-go-admin.flutterflow.app",
  },
  {
    id: 15,
    title: "Vault Core",
    icon: <Lock className="h-6 w-6" />,
    color: "bg-slate-500",
    description: "Central security core system",
    url: "https://example.com/core",
  },
]

// Possible issue types for AI diagnostics
const issueTypes = ["connectivity", "broken-link", "performance", "security", "data-integrity"]

// Possible severities
const severities = ["low", "medium", "high", "critical"]

// Issue messages by type
const issueMessages = {
  connectivity: ["Connection timeout", "Intermittent connectivity", "High latency detected", "DNS resolution failure"],
  "broken-link": [
    "Broken API endpoint",
    "Invalid resource reference",
    "Dead link detected",
    "Circular reference detected",
  ],
  performance: ["High CPU utilization", "Memory leak detected", "Slow response time", "Resource bottleneck"],
  security: [
    "Outdated security certificate",
    "Vulnerable dependency",
    "Suspicious access pattern",
    "Missing authentication",
  ],
  "data-integrity": [
    "Data corruption detected",
    "Inconsistent state",
    "Failed validation check",
    "Synchronization error",
  ],
}

// Issue details by type
const issueDetails = {
  connectivity: [
    "The system detected a timeout when attempting to connect to the service. This could be due to network congestion, firewall restrictions, or service unavailability.",
    "The connection to this service is unstable, with intermittent failures. This may impact reliability and data consistency.",
    "Network latency to this service exceeds acceptable thresholds, which may impact user experience and system performance.",
    "The system is unable to resolve the DNS for this service, which prevents any connection from being established.",
  ],
  "broken-link": [
    "The API endpoint referenced by this service returns a 404 Not Found error. The endpoint may have been moved or deprecated.",
    "This service references a resource that cannot be located. The resource may have been moved, renamed, or deleted.",
    "A link used by this service leads to a non-existent destination, which may cause functionality failures.",
    "A circular reference has been detected in the service dependencies, which may cause infinite loops or stack overflows.",
  ],
  performance: [
    "This service is consuming excessive CPU resources, which may impact overall system performance and responsiveness.",
    "A memory leak has been detected in this service, which may lead to degraded performance over time and eventual crashes.",
    "This service is responding slower than expected, which may impact user experience and system throughput.",
    "A resource bottleneck has been identified in this service, limiting its ability to scale and perform efficiently.",
  ],
  security: [
    "The security certificate for this service has expired or is about to expire, which may compromise secure communications.",
    "This service uses a dependency with known security vulnerabilities that could be exploited by malicious actors.",
    "Unusual access patterns have been detected for this service, which may indicate unauthorized access attempts.",
    "This service is missing proper authentication mechanisms, which may allow unauthorized access to sensitive data or functionality.",
  ],
  "data-integrity": [
    "Data corruption has been detected in this service, which may lead to incorrect results or system failures.",
    "This service is in an inconsistent state, which may lead to unpredictable behavior or data loss.",
    "Data validation checks have failed for this service, indicating potential data integrity issues.",
    "A synchronization error has occurred between this service and its dependencies, which may lead to data inconsistencies.",
  ],
}

export default function DigitalVaultHub() {
  const [activeNode, setActiveNode] = useState<number | null>(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [dataFlowAnimation, setDataFlowAnimation] = useState<{ [key: number]: boolean }>({})
  const [rotationAngle, setRotationAngle] = useState(0)

  // System initialization state
  const [systemInitialized, setSystemInitialized] = useState(false)

  // Health check states
  const [isHealthCheckRunning, setIsHealthCheckRunning] = useState(false)
  const [healthStatus, setHealthStatus] = useState<{ [key: number]: "healthy" | "unhealthy" | "checking" | null }>({})
  const [healthCheckComplete, setHealthCheckComplete] = useState(false)
  const [overallHealth, setOverallHealth] = useState<"healthy" | "unhealthy" | null>(null)
  const [detectedIssues, setDetectedIssues] = useState<HealthIssue[]>([])
  const [showIssuePanel, setShowIssuePanel] = useState(false)

  // Audio system state
  const [currentAudioEvent, setCurrentAudioEvent] = useState<AudioEvent>("welcome")
  const [isAutoFixing, setIsAutoFixing] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWindowSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Rotation animation for the central hub
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.2) % 360)
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [])

  // Random data flow animations
  useEffect(() => {
    if (!systemInitialized) return

    const triggerRandomDataFlow = () => {
      const randomNodeId = Math.floor(Math.random() * 14) + 1 // Nodes 1-14 (excluding center)

      setDataFlowAnimation((prev) => ({
        ...prev,
        [randomNodeId]: true,
      }))

      setTimeout(() => {
        setDataFlowAnimation((prev) => ({
          ...prev,
          [randomNodeId]: false,
        }))
      }, 1500) // Animation duration
    }

    const dataFlowInterval = setInterval(triggerRandomDataFlow, 2000)
    return () => clearInterval(dataFlowInterval)
  }, [systemInitialized])

  // Initialize health check after system is initialized
  useEffect(() => {
    if (!systemInitialized) return

    // Short delay to ensure the UI is rendered before running the check
    const timer = setTimeout(() => {
      runSystemHealthCheck()
    }, 4000) // Delay health check to allow welcome message to play first

    return () => clearTimeout(timer)
  }, [systemInitialized])

  // Update audio event based on system state
  useEffect(() => {
    if (!systemInitialized) return

    if (isAutoFixing) {
      setCurrentAudioEvent("auto-fixing")
    } else if (isHealthCheckRunning) {
      setCurrentAudioEvent("health-check-running")
    } else if (healthCheckComplete) {
      if (overallHealth === "healthy") {
        setCurrentAudioEvent("systems-healthy")
      } else if (overallHealth === "unhealthy") {
        setCurrentAudioEvent("system-issues")
      }
    }
  }, [isHealthCheckRunning, healthCheckComplete, overallHealth, isAutoFixing, systemInitialized])

  // Handle system initialization
  const handleSystemInitialized = () => {
    setSystemInitialized(true)
    setCurrentAudioEvent("welcome")
  }

  // Function to run AI-powered health check on all nodes
  const runSystemHealthCheck = () => {
    if (isHealthCheckRunning || !systemInitialized) return

    setIsHealthCheckRunning(true)
    setHealthCheckComplete(false)
    setOverallHealth(null)
    setShowIssuePanel(false)
    setDetectedIssues([])
    setCurrentAudioEvent("health-check-running")

    // Reset all health statuses
    const initialStatus: { [key: number]: "healthy" | "unhealthy" | "checking" | null } = {}
    nodeData.forEach((node) => {
      initialStatus[node.id] = "checking"
    })
    setHealthStatus(initialStatus)

    // Simulate AI checking each node with a delay
    const unhealthyNodes: number[] = []
    const newIssues: HealthIssue[] = []

    // For deployment, we'll ensure most nodes are healthy by default
    // This guarantees the "All Systems Healthy" state is more likely
    const healthyProbability = 0.95 // 95% chance of being healthy

    nodeData.forEach((node, index) => {
      // Stagger the checks for visual effect
      setTimeout(() => {
        // Simulate a health status with high probability of being healthy
        const isNodeHealthy = Math.random() < healthyProbability

        if (!isNodeHealthy) {
          unhealthyNodes.push(node.id)

          // Generate 1-2 issues for unhealthy nodes
          const issueCount = Math.floor(Math.random() * 2) + 1
          for (let i = 0; i < issueCount; i++) {
            newIssues.push(generateRandomIssue(node.id))
          }
        }

        setHealthStatus((prev) => ({
          ...prev,
          [node.id]: isNodeHealthy ? "healthy" : "unhealthy",
        }))

        // If this is the last node, complete the health check
        if (index === nodeData.length - 1) {
          setTimeout(() => {
            setIsHealthCheckRunning(false)
            setHealthCheckComplete(true)
            const newHealthState = unhealthyNodes.length === 0 ? "healthy" : "unhealthy"
            setOverallHealth(newHealthState)
            setDetectedIssues(newIssues)

            // Set the appropriate audio event
            setCurrentAudioEvent(newHealthState === "healthy" ? "systems-healthy" : "system-issues")
          }, 500)
        }
      }, index * 300) // Check each node with a 300ms delay
    })
  }

  // Calculate positions for nodes in a circular pattern
  const calculateNodePositions = () => {
    const centerX = windowSize.width / 2
    const centerY = windowSize.height / 2

    // Calculate the safe area to ensure nodes stay within container
    // Account for node width (140px) and minimal padding
    const nodeWidth = 140
    const nodePadding = 20
    const safeAreaPadding = nodeWidth / 2 + nodePadding

    // Calculate maximum radius that keeps nodes within container bounds
    const maxRadiusX = centerX - safeAreaPadding
    const maxRadiusY = centerY - safeAreaPadding

    // Use the smaller of the two to ensure nodes fit in both dimensions
    // Apply a safety factor and then increase by 58.4% total (44% + 10%)
    const baseRadius = Math.min(maxRadiusX, maxRadiusY) * 0.7

    // Increase the radius by an additional 10% as requested
    // Original: const radius = baseRadius * 1.584
    const radius = baseRadius * 1.7424 // Increased by 10% (1.584 * 1.1 = 1.7424)

    // Calculate the minimum angle between nodes to prevent overlap
    // For 14 nodes (excluding the center), we need to distribute them evenly
    const nodeCount = nodeData.length - 1 // Exclude the center node

    return nodeData.map((node, index) => {
      // Skip the last node (Vault Core) as it will be in the center
      if (index === nodeData.length - 1) {
        return { ...node, x: centerX, y: centerY }
      }

      // Calculate angle for each node (excluding the center one)
      // Distribute nodes evenly around the circle
      const angle = ((2 * Math.PI) / nodeCount) * index
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      return { ...node, x, y }
    })
  }

  // Generate a random issue for a node
  const generateRandomIssue = (nodeId: number): HealthIssue => {
    const node = nodeData.find((n) => n.id === nodeId)
    const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)] as
      | "connectivity"
      | "broken-link"
      | "performance"
      | "security"
      | "data-integrity"
    const severity = severities[Math.floor(Math.random() * severities.length)] as "low" | "medium" | "high" | "critical"
    const messageIndex = Math.floor(Math.random() * issueMessages[issueType].length)

    return {
      id: `issue-${nodeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nodeId,
      nodeName: node?.title || "Unknown Node",
      type: issueType,
      severity,
      message: issueMessages[issueType][messageIndex],
      details: issueDetails[issueType][messageIndex],
      canAutoFix: true, // Set all issues to be auto-fixable
    }
  }

  // Handle clicking the health status button when issues are detected
  const handleHealthButtonClick = () => {
    if (healthCheckComplete && overallHealth === "unhealthy") {
      setShowIssuePanel(true)
    } else if (!isHealthCheckRunning) {
      runSystemHealthCheck()
    }
  }

  // Handle fixing a single issue
  const handleFixIssue = (issueId: string) => {
    // Find the issue to fix
    const issueToFix = detectedIssues.find((issue) => issue.id === issueId)
    if (!issueToFix) return

    // Remove the issue from the list
    const remainingIssues = detectedIssues.filter((issue) => issue.id !== issueId)
    setDetectedIssues(remainingIssues)

    // Check if this was the last issue for this node
    const remainingIssuesForNode = remainingIssues.filter((issue) => issue.nodeId === issueToFix.nodeId)

    // If no more issues for this node, mark it as healthy
    if (remainingIssuesForNode.length === 0) {
      setHealthStatus((prev) => ({
        ...prev,
        [issueToFix.nodeId]: "healthy",
      }))
    }

    // Check if all issues are fixed
    if (remainingIssues.length === 0) {
      setOverallHealth("healthy")
      setCurrentAudioEvent("systems-healthy")
      setTimeout(() => {
        setShowIssuePanel(false)
      }, 1000)
    }
  }

  // Handle fixing all issues
  const handleFixAllIssues = () => {
    setIsAutoFixing(true)
    setCurrentAudioEvent("auto-fixing")

    // Mark all nodes as healthy
    const updatedStatus: { [key: number]: "healthy" | "unhealthy" | "checking" | null } = {}
    nodeData.forEach((node) => {
      updatedStatus[node.id] = "healthy"
    })

    setHealthStatus(updatedStatus)
    setDetectedIssues([])

    // Short delay to allow the auto-fixing voice to play
    setTimeout(() => {
      setOverallHealth("healthy")
      setIsAutoFixing(false)
      setCurrentAudioEvent("systems-healthy")

      setTimeout(() => {
        setShowIssuePanel(false)
      }, 1000)
    }, 2500)
  }

  const nodesWithPositions = calculateNodePositions()

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[700px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl"
    >
      {/* Audio System with initialization screen */}
      <AudioSystem currentEvent={currentAudioEvent} onSystemInitialized={handleSystemInitialized} />

      {/* Only show the rest of the UI after system is initialized */}
      {systemInitialized && (
        <>
          {/* System Health Check Button */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={handleHealthButtonClick}
              disabled={isHealthCheckRunning || isAutoFixing}
              className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all ${
                isHealthCheckRunning || isAutoFixing
                  ? "bg-blue-600 opacity-75 cursor-wait"
                  : healthCheckComplete
                    ? overallHealth === "healthy"
                      ? "bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      : "bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    : "bg-blue-600 hover:bg-blue-700"
              } shadow-lg`}
            >
              {isHealthCheckRunning ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  AI Diagnostics Running...
                </>
              ) : isAutoFixing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Auto-Fixing All Issues...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5 mr-2" />
                  {healthCheckComplete
                    ? overallHealth === "healthy"
                      ? "All Systems Healthy"
                      : `System Issues Detected (${detectedIssues.length})`
                    : "System Health Check"}
                </>
              )}
            </button>
          </div>

          {/* Health Issues Panel */}
          {showIssuePanel && detectedIssues.length > 0 && (
            <HealthIssuePanel
              issues={detectedIssues}
              onClose={() => setShowIssuePanel(false)}
              onFixIssue={handleFixIssue}
              onFixAll={handleFixAllIssues}
            />
          )}

          {/* Background digital effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0,rgba(59,130,246,0)_70%)]"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Circular rings - expanded to match the new node radius */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[99%] h-[99%] rounded-full border border-blue-500/20"
            style={{ transform: `translate(-50%, -50%) rotate(${rotationAngle * 0.5}deg)` }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] h-[88%] rounded-full border border-blue-500/30"
            style={{ transform: `translate(-50%, -50%) rotate(${-rotationAngle * 0.7}deg)` }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full border border-blue-500/40"
            style={{ transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)` }}
          ></div>

          {/* Connection lines with data flow animation */}
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
              </linearGradient>

              {/* Data flow animation */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {nodesWithPositions.map((node) => {
              // Skip the center node
              if (node.id === 15) return null

              const centerNode = nodesWithPositions.find((n) => n.id === 15)
              if (!centerNode) return null

              const isActive = activeNode === node.id || dataFlowAnimation[node.id]

              // Determine line color based on health status
              let lineColor = isActive ? "url(#lineGradient)" : "#1e3a8a"
              if (healthStatus[node.id] === "checking") {
                lineColor = "#f59e0b" // Amber for checking
              } else if (healthStatus[node.id] === "healthy") {
                lineColor = "#10b981" // Green for healthy
              } else if (healthStatus[node.id] === "unhealthy") {
                lineColor = "#ef4444" // Red for unhealthy
              }

              return (
                <g key={`line-${node.id}`}>
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={centerNode.x}
                    y2={centerNode.y}
                    stroke={lineColor}
                    strokeWidth={isActive || healthStatus[node.id] ? "3" : "2"}
                    strokeDasharray={isActive || healthStatus[node.id] ? "none" : "5,5"}
                    className="transition-all duration-300"
                  />

                  {/* Data flow animation */}
                  {dataFlowAnimation[node.id] && !healthStatus[node.id] && (
                    <circle cx={node.x} cy={node.y} r="4" fill="#3b82f6" filter="url(#glow)">
                      <animate attributeName="cx" from={node.x} to={centerNode.x} dur="1.5s" begin="0s" fill="freeze" />
                      <animate attributeName="cy" from={node.y} to={centerNode.y} dur="1.5s" begin="0s" fill="freeze" />
                      <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" fill="freeze" />
                    </circle>
                  )}

                  {/* Health check animation */}
                  {healthStatus[node.id] === "checking" && (
                    <circle cx={centerNode.x} cy={centerNode.y} r="4" fill="#f59e0b" filter="url(#glow)">
                      <animate attributeName="cx" from={centerNode.x} to={node.x} dur="0.8s" begin="0s" fill="freeze" />
                      <animate attributeName="cy" from={centerNode.y} to={node.y} dur="0.8s" begin="0s" fill="freeze" />
                      <animate attributeName="opacity" from="1" to="0.7" dur="0.8s" begin="0s" fill="freeze" />
                    </circle>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Central hub - enhanced with animations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.6)] z-20">
            {/* Rotating outer ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-blue-400/30"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              {/* Notches on the ring */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-4 bg-blue-400/50"
                  style={{
                    left: "50%",
                    top: "0",
                    transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-50%)`,
                    transformOrigin: "bottom center",
                  }}
                />
              ))}
            </div>

            {/* Inner circle with pulsing effect */}
            <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              {/* Digital code background */}
              <div className="absolute inset-0 opacity-20">
                <div className="binary-code"></div>
              </div>

              {/* Pulsing inner circle */}
              <div className="absolute inset-4 rounded-full bg-blue-900/30 animate-pulse"></div>

              {/* Content */}
              <div className="relative text-center z-10">
                <div className="relative">
                  <Lock className="h-14 w-14 mx-auto text-blue-400 mb-2" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-blue-500/20 rounded-full animate-ping"></div>
                </div>
                <h2 className="text-2xl font-bold text-white">Digital Vault</h2>
                <p className="text-base font-medium text-blue-400" style={{ fontSize: "1.09rem" }}>
                  Gaz2Go
                </p>
                <p className="text-xs text-blue-300">Central Security Hub</p>

                {/* Animated status indicator */}
                <div className="mt-2 flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-1 animate-pulse ${
                      isHealthCheckRunning
                        ? "bg-yellow-500"
                        : healthCheckComplete
                          ? (overallHealth === "healthy" ? "bg-green-500" : "bg-red-500")
                          : "bg-green-500"
                    }`}
                  ></div>
                  <span
                    className={`text-xs ${
                      isHealthCheckRunning
                        ? "text-yellow-400"
                        : healthCheckComplete
                          ? (overallHealth === "healthy" ? "text-green-400" : "text-red-400")
                          : "text-green-400"
                    }`}
                  >
                    {isHealthCheckRunning
                      ? "AI Diagnostics Running"
                      : healthCheckComplete
                        ? overallHealth === "healthy"
                          ? "All Systems Operational"
                          : "System Issues Detected"
                        : "System Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nodes */}
          {nodesWithPositions.map((node) => {
            // Skip rendering the center node as we already have the central hub
            if (node.id === 15) return null

            // Determine if node is being checked or has a health status
            const nodeStatus = healthStatus[node.id]
            const isChecking = nodeStatus === "checking"
            const isHealthy = nodeStatus === "healthy"
            const isUnhealthy = nodeStatus === "unhealthy"

            return (
              <div key={node.id} className="relative">
                {/* Health status indicator */}
                {nodeStatus && (
                  <div
                    className={`absolute z-30 w-5 h-5 rounded-full ${
                      isChecking ? "bg-yellow-500" : isHealthy ? "bg-green-500" : "bg-red-500"
                    } -top-1 -right-1 border-2 border-slate-800 flex items-center justify-center`}
                    style={{
                      left: node.x ? `${node.x + 55}px` : "0",
                      top: node.y ? `${node.y - 55}px` : "0",
                    }}
                  >
                    {isChecking ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    ) : isHealthy ? (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    )}
                  </div>
                )}

                <NodeCard
                  node={node}
                  isActive={activeNode === node.id}
                  isAnimating={dataFlowAnimation[node.id] || isChecking}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  style={{
                    left: node.x ? `${node.x}px` : "0",
                    top: node.y ? `${node.y}px` : "0",
                    transform: "translate(-50%, -50%)",
                    boxShadow: isChecking
                      ? "0 0 15px rgba(245, 158, 11, 0.5)"
                      : isHealthy
                        ? "0 0 15px rgba(16, 185, 129, 0.5)"
                        : isUnhealthy
                          ? "0 0 15px rgba(239, 68, 68, 0.5)"
                          : "none",
                  }}
                />
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
