import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"
import { GraphQLSingularResponse } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { HomeQueryRenderer } from "./Home"

jest.mock("app/Components/Home/ArtistRails/ArtistRail", () => ({
  ArtistRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("app/Scenes/Home/Components/ArtworkModuleRail", () => ({
  ArtworkModuleRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("app/Scenes/Home/Components/FairsRail", () => ({
  FairsRailFragmentContainer: jest.fn(() => null),
}))
jest.mock("app/Scenes/Home/Components/SalesRail", () => ({
  SalesRailFragmentContainer: jest.fn(() => null),
}))

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe(HomeQueryRenderer, () => {
  const getWrapper = async () => {
    const tree = renderWithHookWrappersTL(<HomeQueryRenderer />, mockEnvironment)

    mockMostRecentOperation("HomeAboveTheFoldQuery", {
      errors: [],
      data: {
        homePage: {
          artworkModules: [],
          salesModule: [],
        },
        me: {
          canRequestEmailConfirmation: true,
        },
      },
    })
    mockMostRecentOperation("HomeBelowTheFoldQuery", {
      errors: [],
      data: {
        homePage: {
          artistModules: [],
          fairsModule: [],
        },
      },
    })

    await flushPromiseQueue()

    return tree
  }

  it("renders home screen module flat list", async () => {
    const { getByTestId } = await getWrapper()

    expect(getByTestId("home-flat-list")).toBeTruthy()
  })

  it("renders an email confirmation banner", async () => {
    const { getByText } = await getWrapper()

    expect(getByText("Tap here to verify your email address")).toBeTruthy()
  })
})

const mockMostRecentOperation = (
  name: string,
  result: GraphQLSingularResponse = { errors: [] }
) => {
  expect(mockEnvironment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)

  act(() => {
    mockEnvironment.mock.resolveMostRecentOperation(result)
  })
}
