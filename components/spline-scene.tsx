"use client"

import dynamic from "next/dynamic"

// next/dynamic with ssr:false is the correct way to lazy-load a heavy
// client-only library like Spline inside a Next.js Client Component.
// React.lazy + the /next export doesn't work because that export is
// designed for Server Components only.
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-[#007AFF]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#007AFF]/30 animate-pulse" />
          <div className="absolute inset-5 rounded-full bg-[#007AFF]/60" />
        </div>
        <p className="text-white/25 text-[10px] font-semibold tracking-[0.25em] uppercase animate-pulse">
          Loading 3D…
        </p>
      </div>
    </div>
  ),
})

interface SplineSceneProps {
  scene: string
  className?: string
}

export default function SplineScene({ scene, className = "" }: SplineSceneProps) {
  return <Spline scene={scene} className={className} />
}
