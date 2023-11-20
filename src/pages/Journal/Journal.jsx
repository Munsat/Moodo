import { Container, Heading, Spinner, VStack } from "@chakra-ui/react"
import AddEntry from "../../components/JournalEntry/AddEntry"
import { useEffect, useState } from "react"
import { queryJournalEntries } from "../../FirestoreQueries"
import AllEntries from "../../components/JournalEntry/AllEntries"
import { useAuth } from "../../contexts/AuthProvider"
import { format } from "date-fns"
import journalStyles from "./Journal.module.css"

const Journal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [entryData, setEntryData] = useState(null)
  const [groupedData, setGroupedData] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const getQuery = async () => {
      const queryArr = []
      const groupedEntries = {}

      try {
        const queryRes = await queryJournalEntries(user.uid)
        queryRes.forEach((snap) => {
          const data = { id: snap.id, ...snap.data() }
          queryArr.push(data)
          const date = format(data.created_on, "yyyy-MM-dd")
          if (!groupedEntries[date]) {
            groupedEntries[date] = []
          }
          groupedEntries[date].push(data)
        })
        setEntryData(queryArr)
        setGroupedData(groupedEntries)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    setIsLoading(true)
    getQuery()
  }, [])
  if (isLoading)
    return (
      <Container centerContent>
        <Heading size="lg">
          <Spinner
            mr="1rem"
            mt="10rem"
            size="xl"
            emptyColor="gray.200"
            color="orange.500"
          />
          ...LOADING
        </Heading>
      </Container>
    )

  return (
    <VStack
      bg="themeColor.pastel"
      w="100%"
      mx="auto"
      className={journalStyles.waveContainer}
      position="relative"
      p={{ base: "1.5rem", sm: "2rem", md: "5rem" }}
    >
      <Heading>My Journal</Heading>
      <AddEntry setGroupedData={setGroupedData} groupedData={groupedData} />

      {entryData && (
        <AllEntries groupedData={groupedData} setGroupedData={setGroupedData} />
      )}
    </VStack>
  )
}

export default Journal
