import { screen } from "@testing-library/react-native"
import { ArtistAboutTestsQuery } from "__generated__/ArtistAboutTestsQuery.graphql"
import Biography from "app/Components/Artist/Biography"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ModalStack } from "app/system/navigation/ModalStack"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtistAboutContainer } from "./ArtistAbout"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"

describe("ArtistAbout", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutTestsQuery>({
    Component: ({ artist }) => (
      <ModalStack>
        <StickyTabPage
          tabs={[
            {
              title: "test",
              content: <ArtistAboutContainer artist={artist!} />,
            },
          ]}
        />
      </ModalStack>
    ),
    query: graphql`
      query ArtistAboutTestsQuery($artistID: String!) @relay_test_operation {
        artist(id: $artistID) {
          ...ArtistAbout_artist
        }
      }
    `,
    variables: { artistID: "artist-id" },
  })

  describe("Biography", () => {
    it("is shown when the artist has metadata", () => {
      renderWithRelay({
        Boolean: (context) => {
          if (context.name === "hasMetadata") {
            return true
          }
        },
      })

      expect(screen.UNSAFE_queryAllByType(Biography)).toHaveLength(1)
    })

    it("is hidden when the artist has metadata", () => {
      renderWithRelay({
        Boolean: (context) => {
          if (context.name === "hasMetadata") {
            return false
          }
        },
      })

      expect(screen.UNSAFE_queryAllByType(Biography)).toHaveLength(0)
    })
  })

  describe("ArtistAboutShows", () => {
    it("is rendered by default", () => {
      renderWithRelay()

      expect(screen.UNSAFE_queryByType(ArtistAboutShowsFragmentContainer)).toBeTruthy()
    })
  })
})
