import { Container, Heading, Spinner, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { format } from "date-fns"

import { queryJournalEntries } from "../../FirestoreQueries"

import AddEntry from "../../components/JournalEntry/AddEntry"
import AllEntries from "../../components/JournalEntry/AllEntries"
import { useAuth } from "../../contexts/AuthProvider"
import journalStyles from "./Journal.module.css"

const Journal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [entryData, setEntryData] = useState(null)
  const [groupedData, setGroupedData] = useState(null)

  // Accessing user information from authentication context
  const { user } = useAuth()

  // useEffect to fetch and set journal entry data when the component mounts
  useEffect(() => {
    const getQuery = async () => {
      const queryArr = []
      const groupedEntries = {}

      try {
        // Fetching all journal entries from Firestore for the current user
        const queryRes = await queryJournalEntries(user.uid)
        // Mapping query results to an array with added IDs
        queryRes.forEach((snap) => {
          const data = { id: snap.id, ...snap.data() }
          queryArr.push(data)

          // Grouping entries by date
          const date = format(data.created_on, "yyyy-MM-dd")
          if (!groupedEntries[date]) {
            groupedEntries[date] = []
          }
          groupedEntries[date].push(data)
        })
        // Setting the raw entry data and grouped entry data states
        setEntryData(queryArr)
        setGroupedData(groupedEntries)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    // Initiating the data fetching process
    setIsLoading(true)
    getQuery()
  }, [])

  // If still loading, render a Spinner component
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

  // Once loading is complete, render the main content
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
