import { FormikProvider, useFormik } from "formik"
import { getSearchCriteriaFromFilters } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import React from "react"
import { Alert } from "react-native"
import { Form } from "./Components/Form"
import { extractPills, getNamePlaceholder } from "./helpers"
import { createSavedSearchAlert } from "./mutations/createSavedSearchAlert"
import { deleteSavedSearchMutation } from "./mutations/deleteSavedSearchAlert"
import { updateSavedSearchAlert } from "./mutations/updateSavedSearchAlert"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

export interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  initialValues: {
    name: string
  }
  savedSearchAlertId?: string
  onComplete?: () => void
  onDeleteComplete?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { filters, aggregations, initialValues, savedSearchAlertId, onComplete, onDeleteComplete, ...other } = props
  const isUpdateForm = !!savedSearchAlertId
  const pills = extractPills(filters, aggregations)
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    initialErrors: {},
    onSubmit: async (values) => {
      let alertName = values.name

      if (alertName.length === 0) {
        alertName = getNamePlaceholder(props.artist.name, pills)
      }

      try {
        if (isUpdateForm) {
          await updateSavedSearchAlert(alertName, savedSearchAlertId!)
        } else {
          const criteria = getSearchCriteriaFromFilters(props.artist.id, filters)
          await createSavedSearchAlert(alertName, criteria)
        }

        onComplete?.()
      } catch (error) {
        console.error(error)
      }
    },
  })

  const onDelete = async () => {
    try {
      await deleteSavedSearchMutation(savedSearchAlertId!)
      onDeleteComplete?.()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Alert",
      "Once you delete this alert, you will have to recreate it to continue receiving alerts on your favorite artworks.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    )
  }

  return (
    <FormikProvider value={formik}>
      <Form pills={pills} isUpdateForm={isUpdateForm} onDeletePress={handleDeletePress} {...other} />
    </FormikProvider>
  )
}