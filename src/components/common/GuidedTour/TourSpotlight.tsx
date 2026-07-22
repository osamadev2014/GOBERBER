import { useMemo, useId, type ReactNode } from "react"
import { createPortal } from "react-dom"

type Props = {
  targetRect: DOMRect | null
  borderRadius: number
  padding?: number
  glow?: boolean
  children?: ReactNode
  onClickOverlay?: () => void
}

const EASE = "cubic-bezier(0.4,0,0.2,1)"
const TRANSITION_GEOMETRY =
  `top 300ms ${EASE}, left 300ms ${EASE}, width 300ms ${EASE}, height 300ms ${EASE}, border-radius 300ms ${EASE}`

function clampToViewport(r: { top: number; left: number; right: number; bottom: number }) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 0
  const vh = typeof window !== "undefined" ? window.innerHeight : 0
  return {
    top: Math.max(0, r.top),
    left: Math.max(0, r.left),
    right: Math.min(vw, r.right),
    bottom: Math.min(vh, r.bottom),
  }
}

export function TourSpotlight({
  targetRect,
  borderRadius,
  padding = 12,
  glow = true,
  children,
  onClickOverlay,
}: Props) {
  const maskId = useId()
  const glowId = useId()

  const hole = useMemo(() => {
    if (!targetRect) return null
    const raw = {
      top: targetRect.top - padding,
      left: targetRect.left - padding,
      right: targetRect.right + padding,
      bottom: targetRect.bottom + padding,
    }
    const c = clampToViewport(raw)
    return {
      top: c.top,
      left: c.left,
      right: c.right,
      bottom: c.bottom,
      width: c.right - c.left,
      height: c.bottom - c.top,
    }
  }, [targetRect, padding])

  const vw = typeof window !== "undefined" ? window.innerWidth : 0
  const vh = typeof window !== "undefined" ? window.innerHeight : 0

  return createPortal(
    <>
      {/* ── z-99: CSS Grid click-interceptor ── */}
      {hole && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            display: "grid",
            gridTemplateColumns: `${hole.left}px 1fr ${vw - hole.right}px`,
            gridTemplateRows: `${hole.top}px 1fr ${vh - hole.bottom}px`,
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
          <div style={{ pointerEvents: "none", background: "transparent" }} />
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
          <div style={{ pointerEvents: "auto" }} onClick={onClickOverlay} />
        </div>
      )}

      {/* Full dark overlay when no target (fallback) */}
      {!hole && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.5)" }}
          onClick={onClickOverlay}
        />
      )}

      {/* ── z-100: SVG visual overlay ── */}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <defs>
          {hole && (
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={hole.left}
                y={hole.top}
                width={hole.width}
                height={hole.height}
                rx={borderRadius}
                fill="black"
                style={{ transition: TRANSITION_GEOMETRY }}
              />
            </mask>
          )}
          {glow && hole && (
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="8" />
            </filter>
          )}
        </defs>

        {glow && hole && (
          <rect
            x={hole.left - 6}
            y={hole.top - 6}
            width={hole.width + 12}
            height={hole.height + 12}
            rx={borderRadius + 4}
            fill="none"
            stroke="rgba(249,115,22,0.3)"
            strokeWidth="3"
            filter={`url(#${glowId})`}
            style={{ transition: TRANSITION_GEOMETRY }}
          />
        )}

        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.5)"
          mask={hole ? `url(#${maskId})` : undefined}
        />
      </svg>

      {children}
    </>,
    document.body,
  )
}
