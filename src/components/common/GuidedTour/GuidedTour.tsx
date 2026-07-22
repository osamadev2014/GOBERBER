import { useState, useEffect, useRef, useCallback } from "react"
import { useLocation } from "@tanstack/react-router"
import { useT } from "@/lib/i18n"
import type { TourStep } from "./types"
import { TourSpotlight } from "./TourSpotlight"
import { TourCard } from "./TourCard"

type Props = {
  steps: TourStep[]
  alwaysShow?: boolean
  onComplete?: () => void
}

const MAX_RETRIES = 3
const RETRY_DELAY = 400

function findTarget(id: string): HTMLElement | null {
  return document.querySelector(`[data-tour-id="${id}"]`) as HTMLElement | null
}

function scrollToTarget(el: HTMLElement) {
  el.scrollIntoView({ behavior: "smooth", block: "center" })
}

export function GuidedTour({ steps, alwaysShow = true, onComplete }: Props) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  const targetRef = useRef<HTMLElement | null>(null)
  const mutationRef = useRef<MutationObserver | null>(null)
  const resizeRef = useRef<ResizeObserver | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)

  const { t } = useT()
  const location = useLocation()

  const recalcPosition = useCallback(() => {
    const el = targetRef.current
    if (!el) {
      setTargetRect(null)
      return
    }

    const isConnected = el.isConnected
    const cs = getComputedStyle(el)
    const isVisible =
      el.offsetWidth > 0 &&
      el.offsetHeight > 0 &&
      cs.visibility !== "hidden" &&
      cs.display !== "none"

    if (!isConnected || !isVisible) {
      setTargetRect(null)

      if (retryCountRef.current < MAX_RETRIES && !retryTimeoutRef.current) {
        retryCountRef.current++
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null
          const step = steps[currentStep]
          if (step) {
            const reFound = findTarget(step.id)
            if (reFound && reFound.isConnected && reFound.offsetWidth > 0) {
              targetRef.current = reFound
              scrollToTarget(reFound)
              retryCountRef.current = 0
              requestAnimationFrame(() => recalcPosition())
            } else if (retryCountRef.current >= MAX_RETRIES) {
              retryCountRef.current = 0
              advanceStep()
            }
          }
        }, RETRY_DELAY)
      } else if (retryCountRef.current >= MAX_RETRIES) {
        retryCountRef.current = 0
        advanceStep()
      }
      return
    }

    retryCountRef.current = 0
    setTargetRect(el.getBoundingClientRect())
  }, [currentStep, steps])

  const highlightElement = useCallback(
    (id: string) => {
      const el = findTarget(id)
      if (!el) {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1
          completeTour()
          return prev
        })
        return false
      }

      targetRef.current = el
      retryCountRef.current = 0
      scrollToTarget(el)
      requestAnimationFrame(() => recalcPosition())
      return true
    },
    [steps.length, recalcPosition],
  )

  const cleanupHighlight = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    retryCountRef.current = 0
    targetRef.current = null
  }, [])

  const completeTour = useCallback(() => {
    cleanupHighlight()
    setIsActive(false)
    document.body.style.overflow = ""
    onComplete?.()
  }, [cleanupHighlight, onComplete])

  const advanceStep = useCallback(() => {
    cleanupHighlight()

    if (currentStep >= steps.length - 1) {
      completeTour()
      return
    }

    setCurrentStep((prev) => prev + 1)
  }, [currentStep, steps.length, cleanupHighlight, completeTour])

  const handleNext = useCallback(() => {
    advanceStep()
  }, [advanceStep])

  const handleSkip = useCallback(() => {
    completeTour()
  }, [completeTour])

  const handleClose = useCallback(() => {
    completeTour()
  }, [completeTour])

  useEffect(() => {
    if (!alwaysShow || steps.length === 0) return

    const timer = setTimeout(() => {
      setIsActive(true)
      setCurrentStep(0)
      document.body.style.overflow = "hidden"
    }, 500)

    return () => clearTimeout(timer)
  }, [alwaysShow, steps.length])

  useEffect(() => {
    if (!isActive) return

    const step = steps[currentStep]
    if (!step) return

    cleanupHighlight()
    highlightElement(step.id)
  }, [isActive, currentStep, steps, highlightElement, cleanupHighlight])

  useEffect(() => {
    if (!isActive) return
    if (currentStep >= steps.length) return

    const step = steps[currentStep]
    if (step.id === "cart" && location.pathname === "/cart") {
      completeTour()
    }
  }, [isActive, currentStep, steps, location.pathname, completeTour])

  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        completeTour()
      } else if (e.key === "Enter") {
        advanceStep()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isActive, completeTour, advanceStep])

  useEffect(() => {
    if (!isActive) return

    const handleResize = () => recalcPosition()
    const handleScroll = () => recalcPosition()

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, { passive: true })

    const target = targetRef.current
    const scrollContainers: Element[] = []

    if (target) {
      resizeRef.current = new ResizeObserver(recalcPosition)
      resizeRef.current.observe(target)

      mutationRef.current = new MutationObserver(recalcPosition)
      mutationRef.current.observe(target, {
        attributes: true,
        childList: true,
        subtree: true,
      })

      let parent = target.parentElement
      while (parent && parent !== document.body) {
        const style = getComputedStyle(parent)
        if (style.overflow === "auto" || style.overflow === "scroll" || style.overflowY === "auto" || style.overflowY === "scroll") {
          parent.addEventListener("scroll", recalcPosition, { passive: true })
          scrollContainers.push(parent)
        }
        parent = parent.parentElement
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      resizeRef.current?.disconnect()
      mutationRef.current?.disconnect()
      scrollContainers.forEach((c) =>
        c.removeEventListener("scroll", recalcPosition),
      )
    }
  }, [isActive, recalcPosition])

  useEffect(() => {
    return () => {
      cleanupHighlight()
      document.body.style.overflow = ""
    }
  }, [cleanupHighlight])

  if (!isActive) return null

  const step = steps[currentStep]
  if (!step) return null

  return (
    <TourSpotlight
      targetRect={targetRect}
      borderRadius={14}
      glow
      onClickOverlay={handleNext}
    >
      <TourCard
        targetRect={targetRect}
        placement={step.placement}
        stepIndex={currentStep}
        totalSteps={steps.length}
        title={t(step.titleKey)}
        description={t(step.descriptionKey)}
        onNext={handleNext}
        onSkip={handleSkip}
        onClose={handleClose}
        nextLabel={t("tourNext")}
        skipLabel={t("tourSkip")}
      />
    </TourSpotlight>
  )
}
