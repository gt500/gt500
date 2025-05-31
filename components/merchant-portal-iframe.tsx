"use client"

import { ArrowLeft } from "lucide-react"

export default function MerchantPortalIframe() {
  const handleBackToVault = () => {
    // Navigate back to the specified v0.dev chat URL
    window.location.href = "https://v0.dev/chat/high-tech-frontend-design-C7MOy5iUyhb"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-[90%] h-[90%] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-slate-800 text-white">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Standard Bank Merchant Portal</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToVault}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Back to Digital Vault"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Digital Vault
            </button>
            <button
              onClick={() => window.close()}
              className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Close window"
            >
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
        </div>
        <iframe
          src="https://merchantonline.standardbank.co.za/MerchantPortal/MerchantPortal/MerchAuthentication/Login"
          className="w-full h-[calc(100%-64px)]"
          frameBorder="0"
          title="Standard Bank Merchant Portal"
        />
      </div>
    </div>
  )
}
