import { ActionType, ContextModule, OwnerType, TappedShowGroup } from "@artsy/cohesion"
import { Spacer, Flex } from "@artsy/palette-mobile"
import { ShowsRail_showsConnection$data } from "__generated__/ShowsRail_showsConnection.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { ShowCardContainer } from "app/Components/ShowCard"
import { extractNodes } from "app/utils/extractNodes"
import { memo } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ShowsRailProps {
  title: string
  showsConnection: ShowsRail_showsConnection$data
}

// Because we never show more than 2 shows per gallery we need to overfetch, filter out, and then limit the number of shows.
const NUMBER_OF_SHOWS = 10

export const ShowsRail: React.FC<ShowsRailProps> = ({ title, showsConnection }) => {
  const tracking = useTracking()

  const shows = extractNodes(showsConnection)

  const hasShows = shows?.length

  if (!hasShows) {
    return null
  }

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle title={title} />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          initialNumToRender={2}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer x={2} />}
          ListFooterComponent={() => <Spacer x={2} />}
          ItemSeparatorComponent={() => <Spacer x={2} />}
          data={shows.slice(0, NUMBER_OF_SHOWS)}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ShowCardContainer
              show={item}
              onPress={() => {
                tracking.trackEvent(tracks.tappedThumbnail(item.internalID, item.slug || "", index))
              }}
            />
          )}
        />
      </Flex>
    </Flex>
  )
}

export const ShowsRailFragmentContainer = memo(
  createFragmentContainer(ShowsRail, {
    showsConnection: graphql`
      fragment ShowsRail_showsConnection on ShowConnection {
        edges {
          node {
            internalID
            slug
            ...ShowCard_show
          }
        }
      }
    `,
  })
)

export const tracks = {
  tappedThumbnail: (showID?: string, showSlug?: string, index?: number): TappedShowGroup => ({
    action: ActionType.tappedShowGroup,
    context_module: ContextModule.showsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.show,
    destination_screen_owner_id: showID,
    destination_screen_owner_slug: showSlug,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}
