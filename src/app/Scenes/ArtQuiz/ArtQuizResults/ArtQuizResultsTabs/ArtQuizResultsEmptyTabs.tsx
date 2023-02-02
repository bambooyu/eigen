import { ArtQuizResultsEmptyTabsQuery } from "__generated__/ArtQuizResultsEmptyTabsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { ArtQuizResultsTabsHeader } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabsHeader"
import { ArtQuizTrendingCollections } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizTrendingCollections"
import { compact } from "lodash"
import { Screen } from "palette"
import { graphql, useLazyLoadQuery } from "react-relay"

enum Tab {
  trendingCollections = "Trending Collections",
  trendingArtists = "Trending Artists",
}

export const ArtQuizResultsEmptyTabs = () => {
  const queryResult = useLazyLoadQuery<ArtQuizResultsEmptyTabsQuery>(
    artQuizResultsEmptyTabsQuery,
    {}
  )

  return (
    <Screen>
      <Screen.Body fullwidth>
        <StickyTabPage
          disableBackButtonUpdate
          tabs={compact([
            {
              title: Tab.trendingCollections,
              content: <ArtQuizTrendingCollections viewer={queryResult.viewer} />,
              initial: true,
            },
            {
              title: Tab.trendingArtists,
              content: <ArtQuizTrendingCollections viewer={queryResult.viewer} />,
            },
          ])}
          staticHeaderContent={
            <ArtQuizResultsTabsHeader
              title="Explore Your Quiz Results"
              subtitle="There are almost 2 million artworks on Artsy—keep exploring to find something you love."
            />
          }
        />
      </Screen.Body>
    </Screen>
  )
}

const artQuizResultsEmptyTabsQuery = graphql`
  query ArtQuizResultsEmptyTabsQuery {
    viewer {
      ...ArtQuizTrendingCollections_viewer
    }
  }
`
