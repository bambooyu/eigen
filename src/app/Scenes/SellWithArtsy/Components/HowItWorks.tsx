import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"
import { Spacer, ImageIcon, Tag2Icon, Payment2Icon, Box, Flex, Text } from "@artsy/palette-mobile"
import { StepWithImage } from "app/Components/StepWithImage/StepWithImage"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Button, Join } from "palette"

const STEPS = [
  {
    icon: ImageIcon,
    title: "Upload photos",
    text: "Submit images of an artwork in your collection, along with relevant details.",
  },
  {
    icon: Tag2Icon,
    title: "Get a sales option",
    text: "If your artwork is accepted, our specialists will give you a price estimate and the best sales option.",
  },
  {
    icon: Payment2Icon,
    title: "Sell your artwork",
    text: "We’ll find the best buyer for your work and arrange shipping and secure payment.",
  },
]

const NEW_STEPS = [
  {
    title: "Submit your artwork",
    text: "Enter the artist’s name on the submission page. If the artist is in our database, you’ll be able to upload images and artwork details.",
  },
  {
    title: "Meet your expert",
    text: "One of our specialists will review your submission and determine the best sales option.",
  },
  {
    title: "Get a sales option",
    text: "Review your tailored sales strategy and price estimate. We’ll select the best way to sell your work—either at auction, through private sale, or a direct listing on Artsy.",
  },
  {
    title: "Sell your work",
    text: "Keep your work until it sells, then let our team handle the logistics. No costly presale insurance, shipping, or handling fees.",
  },
]

export const HowItWorks: React.FC<{
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}> = ({ onConsignPress }) => {
  const buttonText = "Start Selling"
  const enableNewSWALandingPage = useFeatureFlag("AREnableNewSWALandingPage")
  if (enableNewSWALandingPage) {
    return (
      <Flex mx={2}>
        <Text variant="lg-display">How it works</Text>

        <Spacer y={2} />
        <Join separator={<Spacer y={2} />}>
          {NEW_STEPS.map((step, index) => (
            <Flex key={step.title + index}>
              <Text variant="lg">{`0${index + 1}`}</Text>
              <Text variant="md">{step.title}</Text>
              <Text variant="xs">{step.text}</Text>
            </Flex>
          ))}
          <Spacer y={2} />
          <Button
            testID="HowItWorks-consign-CTA"
            block
            onPress={() => {
              onConsignPress(tracks.consignArgs(buttonText))
            }}
          >
            {buttonText}
          </Button>
        </Join>
      </Flex>
    )
  }
  return (
    <Box px={2}>
      <Text variant="lg-display">How it works</Text>

      <Spacer y={2} />
      <Join separator={<Spacer y={2} />}>
        {STEPS.map((step, index) => (
          <StepWithImage key={index} {...step} />
        ))}
      </Join>
    </Box>
  )
}

const tracks = {
  consignArgs: (subject: string): TappedConsignArgs => ({
    contextModule: ContextModule.sellHowItWorks,
    contextScreenOwnerType: OwnerType.sell,
    subject,
  }),
}
