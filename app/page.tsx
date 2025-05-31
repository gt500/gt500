import DigitalVaultHub from "@/components/digital-vault-hub"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Header with logo and title side by side */}
        <div className="flex items-center justify-center gap-5 mb-8">
          {/* Gaz2Go Logo - increased by 50% */}
          <div className="w-[90px] h-[90px] flex items-center justify-center">
            <Image
              src="/images/gaz2go-logo-transparent.png"
              alt="Gaz2Go Logo"
              width={90}
              height={90}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold text-white">Secure Digital Vault</h1>
        </div>

        <DigitalVaultHub />
      </div>
    </main>
  )
}
