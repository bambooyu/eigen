import { Spacer, Flex } from "@artsy/palette-mobile"
import { AlgoliaSearchResult, PillType } from "app/Scenes/Search/types"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { searchInsights } from "app/utils/useSearchInsightsConfig"
import { Touchable } from "palette"
import { SearchHighlight } from "./SearchHighlight"
import { IMAGE_SIZE, SearchResultImage } from "./SearchResultImage"

interface SearchResultsItemProps {
  result: AlgoliaSearchResult
  selectedPill: PillType
  trackResultPress?: (result: AlgoliaSearchResult) => void
}

export const SearchResult: React.FC<SearchResultsItemProps> = ({
  result,
  selectedPill,
  trackResultPress,
}) => {
  const addArtworkToRecentSearches = () => {
    GlobalStore.actions.search.addRecentSearch({
      type: "AUTOSUGGEST_RESULT_TAPPED",
      props: {
        imageUrl: result.image_url,
        href: result.href,
        slug: result.slug,
        displayLabel: result.name,
        __typename: selectedPill.displayName,
        displayType: selectedPill.displayName,
      },
    })
  }

  const onPress = (): void => {
    navigate(result.href)
    addArtworkToRecentSearches()

    trackResultPress?.(result)
    searchInsights("clickedObjectIDsAfterSearch", {
      index: selectedPill.indexName!,
      eventName: "Search item clicked",
      positions: [result.__position],
      queryID: result.__queryID,
      objectIDs: [result.objectID],
    })
  }

  return (
    <Touchable onPress={onPress}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage
          testID="search-result-image"
          imageURL={result.image_url}
          resultType={selectedPill.displayName}
        />

        <Spacer x={1} />

        <Flex flex={1}>
          <SearchHighlight attribute="name" hit={result} />
        </Flex>
      </Flex>
    </Touchable>
  )
}
