import { Theme } from "@artsy/palette"
import { FilterParamName, FilterType } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import React from "react"
import { Aggregations, ArtworkFilterContext, reducer } from "../../../utils/ArtworkFiltersStore"
import { GalleryOptionsScreen } from "../GalleryOptions"
import { sharedAggregateFilterValidation, ValidationParams } from "./AggregationOptionCommonValidation"

describe("Gallery Options Screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "GALLERY",
      counts: [
        {
          name: "RoGallery",
          count: 241,
          value: "rogallery",
        },
        {
          name: "John Szoke",
          count: 131,
          value: "john-szoke-1",
        },
        {
          name: "ByNewArt",
          count: 106,
          value: "bynewart",
        },
        {
          name: "ArtWise",
          count: 92,
          value: "artwise",
        },
        {
          name: "HELENE BAILLY GALLERY",
          count: 87,
          value: "helene-bailly-gallery",
        },
        {
          name: "BAILLY GALLERY",
          count: 82,
          value: "bailly-gallery",
        },
      ],
    },
  ]

  const MockGalleryScreen = ({ initialState, aggregations, navigator }: any) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: filterState,
            dispatch,
            aggregations,
          }}
        >
          <GalleryOptionsScreen navigator={navigator} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const aggregateParams: ValidationParams = {
    Screen: MockGalleryScreen,
    aggregations: mockAggregations,
    filterType: FilterType.gallery,
    paramName: FilterParamName.gallery,
    name: "gallery",
  }

  sharedAggregateFilterValidation(aggregateParams)
})
