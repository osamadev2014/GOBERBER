export type TourStep = {
  id: string
  titleKey: string
  descriptionKey: string
  placement?: "bottom" | "top" | "left" | "right"
}

export type GuidedTourProps = {
  steps: TourStep[]
  alwaysShow?: boolean
  onComplete?: () => void
}
