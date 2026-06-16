import { useRef } from "react"
import { useInView } from "framer-motion"
import type { Variants } from "framer-motion"

/**
 * Section-level scroll reveal hook.
 * Uses ONE IntersectionObserver per section (same as the whileInView pattern
 * but more reliable in Next.js App Router production with React 19).
 *
 * Usage:
 *   const { ref, animate } = useScrollReveal()
 *   <motion.div ref={ref} variants={STAGGER} initial="hidden" animate={animate}>
 */
export function useScrollReveal(margin = "0px 0px -60px 0px") {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin } as any)
  return { ref, animate: (inView ? "show" : "hidden") as "show" | "hidden" }
}

/**
 * Scroll-reveal variants.
 *
 * Pattern:
 *   <motion.div variants={STAGGER} initial="hidden" whileInView="show"
 *               viewport={{ once: true, amount: 0.1 }}>
 *     <motion.div variants={ITEM}>...</motion.div>
 *   </motion.div>
 *
 * One IntersectionObserver per section, zero per child.
 */

export const STAGGER: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren:   0.05,
    },
  },
}

export const ITEM: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Slightly more vertical travel for section headings */
export const HEADING: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Fast fade-only — for decorative / less important elements */
export const FADE: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

/** Enter-once for hero (no IntersectionObserver needed) */
export const heroFade = (delay = 0, y = 22) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})
