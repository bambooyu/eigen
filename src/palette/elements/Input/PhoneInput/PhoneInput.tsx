import { Spacer, TriangleDown, Flex, useColor, Text } from "@artsy/palette-mobile"
import * as glibphone from "google-libphonenumber"
import replace from "lodash/replace"
import { InputProps, InputRef, Touchable } from "palette"
import {
  INTERNALSelectAndInputCombinationBase,
  ValuePayload,
} from "palette/elements/Input/INTERNALSelectAndInputCombinationBase"
import { SelectOption } from "palette/elements/Select"
import { forwardRef, useEffect, useRef, useState } from "react"
import { cleanUserPhoneNumber } from "./cleanUserPhoneNumber"
import { countries, countryIndex } from "./countries"
import { formatPhoneNumber } from "./formatPhoneNumber"

export const PhoneInput = forwardRef<
  InputRef,
  {
    setValidation: (value: boolean) => void
    onChange?: (value: string) => void
    onModalFinishedClosing?: () => void
    maxModalHeight?: number
    shouldDisplayLocalError?: boolean
  } & Omit<InputProps, "onChange">
>(
  (
    {
      value,
      setValidation,
      onChange,
      onChangeText,
      onModalFinishedClosing,
      maxModalHeight,
      shouldDisplayLocalError = true,
      ...rest
    },
    ref
  ) => {
    const color = useColor()
    const initialValues = cleanUserPhoneNumber(value ?? "")
    const [countryCode, setCountryCode] = useState<string>(initialValues.countryCode)
    const [phoneNumber, setPhoneNumber] = useState(
      formatPhoneNumber({
        current: initialValues.phoneNumber,
        previous: initialValues.phoneNumber,
        countryCode,
      })
    )
    const [validationErrorMessage, setValidationErrorMessage] = useState("")
    const dialCode = countryIndex[countryCode].dialCode
    const countryISO2Code = countryIndex[countryCode].iso2
    const phoneUtil = glibphone.PhoneNumberUtil.getInstance()

    const isValidNumber = (number: string, code: string) => {
      try {
        number = replace(number, /[+()-\s]/g, "")
        const parsedNumber = phoneUtil.parse(number, code)
        return phoneUtil.isValidNumber(parsedNumber)
      } catch (err) {
        return false
      }
    }

    const handleValidation = () => {
      const isValid = isValidNumber(phoneNumber, countryISO2Code)
      setValidation(isValid)

      if (shouldDisplayLocalError) {
        setValidationErrorMessage(isValid ? "" : "Please enter a valid phone number.")
      }
    }

    const isFirstRun = useRef(true)
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }
      const newValue = phoneNumber ? `+${dialCode} ${phoneNumber}` : ""
      onChangeText?.(newValue)
      onChange?.(newValue)
    }, [phoneNumber, dialCode])

    const onValueChange = (selectAndInputValue: ValuePayload) => {
      const {
        select: { value: code },
        input: { value: phone },
      } = selectAndInputValue
      const newDialCode = countryIndex[code].dialCode ?? dialCode
      const fullPhoneNumber = newDialCode ? `+${newDialCode} ${phone}` : phone

      const cleanPhoneNumber = cleanUserPhoneNumber(fullPhoneNumber ?? "")

      const formattedPhoneNumber = formatPhoneNumber({
        current: cleanPhoneNumber.phoneNumber,
        previous: initialValues.phoneNumber,
        countryCode: cleanPhoneNumber.countryCode,
      })

      setPhoneNumber(formattedPhoneNumber.replace(/\D+$/, ""))
    }

    return (
      <Flex style={{ height: 50 }}>
        <INTERNALSelectAndInputCombinationBase
          // Props for Input
          {...rest}
          ref={ref}
          value={phoneNumber}
          placeholder={countryIndex[countryCode]?.mask?.replace(/9/g, "0")}
          placeholderTextColor={color("black30")}
          keyboardType="phone-pad"
          onValueChange={onValueChange}
          validate={handleValidation}
          //
          //
          // Props For Select
          optionsForSelect={countryOptions}
          enableSearchForSelect
          valueForSelect={countryCode}
          maxModalHeightForSelect={maxModalHeight}
          onModalFinishedClosingForSelect={onModalFinishedClosing}
          onSelectValueForSelect={(newCountryCode) => {
            setCountryCode(newCountryCode)
            setPhoneNumber(
              formatPhoneNumber({
                current: phoneNumber,
                previous: phoneNumber,
                countryCode: newCountryCode,
              })
            )
          }}
          titleForSelect="Country code"
          renderButtonForSelect={({ selectedValue, onPress }) => {
            return (
              <Touchable onPress={onPress}>
                <Flex flex={1} flexDirection="row" style={{ width: "100%", height: "100%" }}>
                  <Flex flexDirection="row" px={1} alignItems="center" backgroundColor="black10">
                    {/* selectedValue should always be present */}
                    <Text variant="sm-display">
                      {countryIndex[selectedValue ?? countryCode].flag}
                    </Text>
                    <Spacer x={0.5} />
                    <TriangleDown width="8" />
                  </Flex>
                  <Flex justifyContent="center" pl={1}>
                    <Text variant="sm" color="black60">
                      +{dialCode}
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            )
          }}
          renderItemLabelForSelect={({ label, value }) => {
            return (
              <Flex flexDirection="row" alignItems="center" flexShrink={1}>
                <Text variant="sm-display">{countryIndex[value].flag}</Text>
                <Spacer x={1} />
                <Text variant="sm-display" style={{ width: 45 }}>
                  +{countryIndex[value].dialCode}
                </Text>
                <Spacer x={1} />
                <Text
                  variant="sm-display"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ flexShrink: 1 }}
                >
                  {label}
                </Text>
              </Flex>
            )
          }}
          error={
            shouldDisplayLocalError && validationErrorMessage ? validationErrorMessage : rest.error
          }
        />
      </Flex>
    )
  }
)

const countryOptions: Array<SelectOption<string>> = countries.map((c) => {
  return {
    label: c.name,
    value: c.iso2,
    searchImportance: c.priority,
    searchTerms: [
      c.dialCode,
      "+" + c.dialCode,
      c.name,
      // individual words of country name
      ...c.name.split(/\W+/g),
      // initials of country name
      c.name
        .split(/\W+/g)
        .map((word) => word[0])
        .join(""),
    ],
  }
})
