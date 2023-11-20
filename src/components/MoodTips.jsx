import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Heading,
  ListItem,
  Select,
  Spinner,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import axios from "axios"
import { addTipsInfoToFirestore, queryForTipsInfo } from "../FirestoreQueries"

const MoodTips = () => {
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const apiUrl = "https://api.openai.com/v1/completions"
  const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY

  // Function to handle mood selection change
  const handleSelectChange = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    const input = e.target.value
    const queryArr = []
    let hasCalledToday = false

    try {
      // Query Firestore for tips info from tips collection
      const queryRes = await queryForTipsInfo(input)
      queryRes.forEach((snap) => {
        const data = snap.data()
        queryArr.push(data)
      })

      // Check if user has already called for tips today
      queryArr.forEach((each) => {
        if (
          each["date_created"].toDate().toLocaleDateString() ===
          new Date().toLocaleDateString()
        ) {
          hasCalledToday = true
        }
      })

      // Fetch tips from OpenAI API if not called today or no previous calls
      if (!hasCalledToday || queryArr.length === 0) {
        setResponse("")
        const response = await axios.post(
          apiUrl,
          {
            model: "text-davinci-003",
            prompt: `Advice within 300 words, what to do when I am feeling ${input}?`,
            n: 1,
            max_tokens: 400,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        )
        if (response.status !== 200) {
          // Use a random tip from previous calls if API call fails
          const randomIndex = Math.floor(Math.random() * queryArr.length)
          setResponse(queryArr[randomIndex])
        } else {
          // Process and set the response from the API
          const responseText = response.data.choices[0].text.trim()
          const responseTextArr = responseText.split("\n\n")
          setResponse({
            tips: responseTextArr,
          })

          // Save the tips info to Firestore
          await addTipsInfoToFirestore({
            mood: input,
            tips: responseTextArr,
            date_created: new Date(),
          })
        }
      } else {
        // Use a random tip from previous calls if already called today
        const randomIndex = Math.floor(Math.random() * queryArr.length)
        setResponse(queryArr[randomIndex])
      }
      setIsLoading(false)
    } catch (err) {
      console.error(err.stack)
    }
  }

  return (
    <VStack
      m="3rem"
      w="100%"
      maxW="56.5rem"
      minW="23.5rem"
      justifyContent="center"
    >
      <Card
        align="center"
        bgColor="themeColor.yellow"
        px={10}
        py={5}
        minW="100%"
        borderRadius={20}
      >
        <CardHeader>
          <Heading size="lg"> Tips & Tricks For You</Heading>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <Flex align="center" justify="center" gap={3}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="orange.500"
                size={{ base: "md", md: "xl" }}
              />
              <Text>Sit tight. We are grabbing data for you...</Text>
            </Flex>
          ) : (
            <HStack gap={4} display={{ md: "flex" }}>
              <Text fontSize="xl">What to do when I am feeling...</Text>
              <form onChange={handleSelectChange} aria-label="mood options">
                <Select role="select" placeholder="Select mood" w="150px">
                  <option value="sad">Sad</option>
                  <option value="panicked">Panicked</option>
                  <option value="anxious">Anxious</option>
                  <option value="depressed">Depressed</option>
                  <option value="scared">Scared</option>
                  <option value="enraged">Enraged</option>
                  <option value="sleepless">Sleepless</option>
                </Select>
              </form>
            </HStack>
          )}
          <UnorderedList
            my={5}
            styleType="none"
            ml={0}
            pl={0}
            spacing={4}
            w="100%"
          >
            {response &&
              response.tips.map((each) => (
                <ListItem w="100%" p={1} lineHeight={7} key={each}>
                  {each}
                </ListItem>
              ))}
          </UnorderedList>
        </CardBody>
      </Card>
    </VStack>
  )
}
export default MoodTips
