import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkPreviewTestsQuery } from "__generated__/ArtworkPreviewTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Touchable } from "palette"
import { graphql } from "react-relay"
import ArtworkPreview, { ArtworkPreviewProps } from "./ArtworkPreview"

describe("concerning selection handling", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkPreviewTestsQuery, ArtworkPreviewProps>({
    Component: ({ artwork, onSelected }) => (
      <ArtworkPreview artwork={artwork!} onSelected={onSelected} />
    ),
    query: graphql`
      query ArtworkPreviewTestsQuery @relay_test_operation {
        artwork(id: "bradley-theodore-karl-and-anna-face-off-diptych") {
          ...ArtworkPreview_artwork
        }
      }
    `,
  })

  const onSelected = jest.fn()
  beforeEach(() => {
    onSelected.mockClear()
  })

  it("passes an onPress handler to the touchable component if an onSelected handler is given", () => {
    renderWithRelay(
      { Artwork: () => ({ title: "Karl and Anna Face Off (Diptych)", date: "2016" }) },
      { onSelected }
    )

    expect(screen.queryByText("Karl and Anna Face Off (Diptych) / 2016")).toBeTruthy()
    fireEvent.press(screen.UNSAFE_getByType(Touchable))

    expect(onSelected).toHaveBeenCalledTimes(1)
  })

  it("does not pass an onPress handler to the touchable component if no onSelected handler is given", () => {
    renderWithRelay({
      Artist: () => ({}),
    })

    fireEvent.press(screen.UNSAFE_getByType(Touchable))

    expect(onSelected).not.toHaveBeenCalled()
  })
})
