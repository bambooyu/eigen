import { Theme } from "@artsy/palette"
import {
  ArtistSeriesHeaderTestsQuery,
  ArtistSeriesHeaderTestsQueryRawResponse,
} from "__generated__/ArtistSeriesHeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ArtistSeriesHeaderFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesHeader"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

jest.unmock("react-relay")

describe("Artist Series Header", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesHeaderTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesHeaderTestsQuery @raw_response_type {
          artistSeries(id: "pumpkins") {
            ...ArtistSeriesHeader_artistSeries
          }
        }
      `}
      variables={{ artistSeriesID: "pumpkins" }}
      render={({ props, error }) => {
        if (props?.artistSeries) {
          return (
            <Theme>
              <ArtistSeriesHeaderFragmentContainer artistSeries={props.artistSeries} />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders the Artist Series header", () => {
    const wrapper = () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            ...ArtistSeriesHeaderFixture,
          },
        })
      })
      return tree
    }

    expect(wrapper().root.findByType(OpaqueImageView).props.imageURL).toBe(
      "https://www.imagesofpumpkins.cloudfront.net/primary/square.jpg"
    )
  })
})

const ArtistSeriesHeaderFixture: ArtistSeriesHeaderTestsQueryRawResponse = {
  artistSeries: {
    image: {
      url: "https://www.imagesofpumpkins.cloudfront.net/primary/square.jpg",
    },
  },
}
