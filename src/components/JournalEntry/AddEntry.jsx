import { useToast } from "@chakra-ui/react"
import { addJournalEntry } from "../../FirestoreQueries"
import { useAuth } from "../../contexts/AuthProvider"
import { format } from "date-fns"
import AddUserInput from "../AddUserInput"

//Adds an entry to journal
const AddEntry = ({ groupedData, setGroupedData }) => {
  const toast = useToast()
  const { user } = useAuth()
  const placeholder = "What's on your mind?"

  const onSubmit = async (input) => {
    const body = {
      userId: user.uid,
      text: input.trim(),
      created_on: Date.now(),
      updated_on: Date.now(),
    }
    try {
      const entryRes = await addJournalEntry(body)
      const data = {
        id: entryRes.id,
        ...body,
      }
      const date = format(body.created_on, "yyyy-MM-dd")

      if (!groupedData[date]) {
        setGroupedData({ [date]: [data], ...groupedData })
      } else {
        setGroupedData({
          [date]: groupedData[date].unshift(data),
          ...groupedData,
        })
      }
      toast({
        title: "New entry! Woohoo!",
        description: "Your entry has been added to your journal.",
        status: "success",
        position: "bottom-right",
        duration: 9000,
        isClosable: true,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AddUserInput
      widthLength={"70%"}
      placeholder={placeholder}
      charLength={400}
      onSubmit={onSubmit}
    />
  )
}

export default AddEntry
