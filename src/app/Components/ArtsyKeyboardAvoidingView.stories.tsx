/* eslint-disable react/no-unescaped-entities */
import { Spacer } from "@artsy/palette-mobile"
import { Flex } from "@artsy/palette-mobile"
import { Text } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { Button, Input } from "palette"
import { ScrollView } from "react-native"
import { ArtsyKeyboardAvoidingView } from "shared/utils"

storiesOf("ArtsyKeyboardAvoidingView", module).add("ArtsyKeyboardAvoidingView", () => (
  <ArtsyKeyboardAvoidingView>
    <Flex>
      <ScrollView>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Text>"Hello"</Text>
        <Input title="Email" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Input title="Hello" />
        <Spacer y={4} />
        <Button>"Submit"</Button>
      </ScrollView>
    </Flex>
  </ArtsyKeyboardAvoidingView>
))
