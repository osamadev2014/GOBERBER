import { useRef, useState, useLayoutEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

type Placement = "bottom" | "top" | "left" | "right"

type Props = {
  targetRect: DOMRect | null
  placement?: Placement
  stepIndex: number
  totalSteps: number
  title: string
  description: string
  onNext?: () => void
  onSkip?: () => void
  onClose?: () => void
  nextLabel?: string
  skipLabel?: string
  children?: ReactNode
}

const CARD_GAP = 16
const CARD_MAX_W = 320
const SAFE_MARGIN = 16

function getArrowStyle(placement: Placement) {
  const base = "absolute w-3 h-3 bg-card border-border/60 rotate-45"
  switch (placement) {
    case "bottom":
      return `${base} -top-1.5 left-1/2 -translate-x-1/2 border-t border-l`
    case "top":
      return `${base} -bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r`
    case "right":
      return `${base} -left-1.5 top-1/2 -translate-y-1/2 border-t border-r`
    case "left":
      return `${base} -right-1.5 top-1/2 -translate-y-1/2 border-b border-l`
  }
}

export function TourCard({
  targetRect,
  placement: preferredPlacement,
  stepIndex,
  totalSteps,
  title,
  description,
  onNext,
  onSkip,
  onClose,
  nextLabel = "التالي",
  skipLabel = "تخطي",
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const preferred: Placement = preferredPlacement || "bottom"

  const [resolved, setResolved] = useState<Placement>(preferred)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!targetRect) return
    const card = cardRef.current
    if (!card) return

    const cardRect = card.getBoundingClientRect()
    const cardW = cardRect.width || CARD_MAX_W
    const cardH = cardRect.height || 120
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cx = targetRect.left + targetRect.width / 2
    const cy = targetRect.top + targetRect.height / 2
    const needed = CARD_GAP + SAFE_MARGIN

    const fits = {
      bottom: targetRect.bottom + needed + cardH <= vh,
      top: targetRect.top - needed - cardH >= 0,
      right: targetRect.right + needed + cardW <= vw,
      left: targetRect.left - needed - cardW >= 0,
    }

    let placement = preferred
    if (preferred === "bottom" && !fits.bottom) placement = fits.top ? "top" : preferred
    else if (preferred === "top" && !fits.top) placement = fits.bottom ? "bottom" : preferred
    else if (preferred === "right" && !fits.right) placement = fits.left ? "left" : preferred
    else if (preferred === "left" && !fits.left) placement = fits.right ? "right" : preferred

    let left: number
    let top: number

    switch (placement) {
      case "bottom":
        top = targetRect.bottom + CARD_GAP
        left = cx - cardW / 2
        break
      case "top":
        top = targetRect.top - CARD_GAP - cardH
        left = cx - cardW / 2
        break
      case "right":
        top = cy - cardH / 2
        left = targetRect.right + CARD_GAP
        break
      case "left":
        top = cy - cardH / 2
        left = targetRect.left - CARD_GAP - cardW
        break
    }

    left = Math.max(SAFE_MARGIN, Math.min(left, vw - cardW - SAFE_MARGIN))
    top = Math.max(SAFE_MARGIN, Math.min(top, vh - cardH - SAFE_MARGIN))

    setResolved(placement)
    setPos({ top, left })
  }, [targetRect, preferred])

  if (!targetRect) return null

  return createPortal(
    <div
      ref={cardRef}
      className="fixed z-[120] w-[var(--card-w)] animate-in fade-in-0 zoom-in-95 duration-300 fill-mode-forwards"
      style={{
        top: pos.top,
        left: pos.left,
        ["--card-w" as string]: `${CARD_MAX_W}px`,
        transition: "top 300ms cubic-bezier(0.4,0,0.2,1), left 300ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div className="relative rounded-2xl border border-border/60 bg-card p-5 shadow-2xl">
        <span className={getArrowStyle(resolved)} aria-hidden="true" />
        <button
          onClick={onClose}
          className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="إغلاق الجولة"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <p className="mb-1 text-[11px] uppercase tracking-widest text-primary">
          الخطوة {stepIndex + 1} من {totalSteps}
        </p>
        <h4 className="font-display text-lg text-foreground">{title}</h4>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-4 flex items-center justify-end gap-2">
          {stepIndex < totalSteps - 1 && (
            <button
              onClick={onSkip}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {skipLabel}
            </button>
          )}
          <button
            onClick={onNext}
            className="rounded-full px-4 py-2 text-xs font-bold text-primary-foreground bg-primary transition-all hover:scale-105"
          >
            {stepIndex === totalSteps - 1 ? "إنهاء" : nextLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
