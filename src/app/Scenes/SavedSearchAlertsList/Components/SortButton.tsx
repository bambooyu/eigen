import { Text } from "@artsy/palette-mobile"
import { Touchable, TouchableProps } from "palette"
import { FC } from "react"

export const SortButton: FC<TouchableProps> = (props) => {
  return (
    <Touchable {...props}>
      <Text>Sort By</Text>
    </Touchable>
  )
}
