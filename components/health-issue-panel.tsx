"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Wifi, Link2, Database, Server, RefreshCw } from "lucide-react"

export interface HealthIssue {
  id: string
  nodeId: number
  nodeName: string
  type: "connectivity" | "broken-link" | "performance" | "security" | "data-integrity"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  details: string
  canAutoFix: boolean
}

interface HealthIssuePanelProps {
  issues: HealthIssue[]
  onClose: () => void
  onFixIssue: (issueId: string) => void
  onFixAll: () => void
}

export default function HealthIssuePanel({ issues, onClose, onFixIssue, onFixAll }: HealthIssuePanelProps) {
  const [fixingIssues, setFixingIssues] = useState<{ [key: string]: boolean }>({})
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null)

  const handleFixIssue = (issueId: string) => {
    setFixingIssues((prev) => ({ ...prev, [issueId]: true }))

    // Simulate fixing process
    setTimeout(() => {
      onFixIssue(issueId)
      setFixingIssues((prev) => ({ ...prev, [issueId]: false }))
    }, 1500)
  }

  const handleFixAll = () => {
    // Set all issues to fixing state
    const allFixing: { [key: string]: boolean } = {}
    issues.forEach((issue) => {
      if (issue.canAutoFix) {
        allFixing[issue.id] = true
      }
    })
    setFixingIssues(allFixing)

    // Simulate fixing all issues
    setTimeout(() => {
      onFixAll()
      setFixingIssues({})
    }, 2500)
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "connectivity":
        return <Wifi className="h-5 w-5 text-red-500" />
      case "broken-link":
        return <Link2 className="h-5 w-5 text-orange-500" />
      case "performance":
        return <RefreshCw className="h-5 w-5 text-yellow-500" />
      case "security":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "data-integrity":
        return <Database className="h-5 w-5 text-purple-500" />
      default:
        return <Server className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const fixableIssuesCount = issues.filter((issue) => issue.canAutoFix).length

  return (
    <div className="absolute top-16 right-4 z-40 w-[450px] bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-red-600 to-red-800 text-white flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-bold">System Health Issues Detected</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div className="p-4 bg-slate-900 text-white">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-300">
            <span className="font-bold text-white">{issues.length}</span> issues detected across{" "}
            {new Set(issues.map((i) => i.nodeId)).size} nodes
          </div>
          {fixableIssuesCount > 0 && (
            <button
              onClick={handleFixAll}
              disabled={Object.values(fixingIssues).some((v) => v)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Object.values(fixingIssues).some((v) => v) ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Auto-fixing all...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Auto-fix all issues
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {issues.map((issue) => (
            <div key={issue.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-750"
                onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
              >
                <div className="flex items-center">
                  {getIssueIcon(issue.type)}
                  <div className="ml-3">
                    <div className="font-medium">{issue.nodeName}</div>
                    <div className="text-sm text-gray-400">{issue.message}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(issue.severity)} mr-2`}>
                    {issue.severity}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedIssue === issue.id ? "transform rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {expandedIssue === issue.id && (
                <div className="p-3 border-t border-slate-700 bg-slate-850">
                  <p className="text-sm text-gray-300 mb-3">{issue.details}</p>
                  {issue.canAutoFix && (
                    <button
                      onClick={() => handleFixIssue(issue.id)}
                      disabled={fixingIssues[issue.id]}
                      className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {fixingIssues[issue.id] ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Auto-fixing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Auto-correct this issue
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
