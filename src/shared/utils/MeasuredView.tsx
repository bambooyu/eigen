import { Box } from "@artsy/palette-mobile"
import { useCallback } from "react"
import { LayoutChangeEvent } from "react-native"
import { useOffscreenStyle } from "shared/hooks"

export interface ViewMeasurements {
  width: number
  height: number
}

interface Props {
  setMeasuredState: (measuredState: ViewMeasurements) => void

  /** for debugging, this will render the view where it is, not offscreen. */
  show?: boolean
}

/**
 * A view that renders off-screen, measures the width and height of the view, and reports it back.
 */
export const MeasuredView: React.FC<Props> = ({ children, setMeasuredState, show }) => {
  const offscreenStyle = useOffscreenStyle(show)
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setMeasuredState(event.nativeEvent.layout)
  }, [])

  return (
    <Box style={offscreenStyle} backgroundColor="pink" onLayout={onLayout}>
      {children}
    </Box>
  )
}
