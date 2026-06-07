"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface SmoothScrollProviderProps {
  children: ReactNode
}

/**
 * Lightweight scroll provider.
 * Native browser scrolling (CSS scroll-behavior: smooth in globals.css handles
 * anchor links). We only wire up anchor-click interception here so the navbar
 * offset math still works — zero rAF / layout-thrash overhead.
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function onAnchorClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null
      if (!anchor) return
      const hash = anchor.getAttribute("href")
      if (!hash || hash === "#") return
      const el = document.querySelector(hash) as HTMLElement | null
      if (!el) return
      e.preventDefault()
      const top = el.getBoundingClientRect().top + window.scrollY - 88
      window.scrollTo({ top, behavior: "smooth" })
    }

    document.addEventListener("click", onAnchorClick)
    return () => document.removeEventListener("click", onAnchorClick)
  }, [])

  return <>{children}</>
}
