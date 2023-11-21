import { Badge, Flex, HStack, Text } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { useAuth } from "../../contexts/AuthProvider"

// Component for displaying inspirational quotes
const QuotesDisplay = () => {
  // Accessing user information from the authentication context
  const { user } = useAuth()

  // State to store quote data and initialize API URL and key
  const [quoteData, setQuoteData] = useState({})

  const INSPIRATIONAL_QUOTES_API_URL = `https://api.api-ninjas.com/v1/quotes?category=inspirational`
  const API_NINJAS_API_KEY = import.meta.env.VITE_REACT_APP_APININJAS_API_KEY

  // Effect hook to fetch quotes and update at a 30-second interval
  useEffect(() => {
    // Function to fetch quotes from the API
    const getQuotes = async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            "X-Api-Key": API_NINJAS_API_KEY,
          },
        })
        // Checking response status and length of the quote
        if (response.status === 200 && response.data[0].quote.length < 250) {
          // Updating state with the fetched quote and author
          setQuoteData({
            quote: response.data[0].quote,
            author: response.data[0].author,
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
    // Setting up the interval to fetch quotes
    const interval = setInterval(() => {
      getQuotes(INSPIRATIONAL_QUOTES_API_URL)
    }, 30000)

    // Updating quote for authenticated user or clearing data if not authenticated
    if (user) {
      setQuoteData((prevData) => ({
        ...prevData,
        quote: `Hi ${user.displayName}! Welcome to Moodo. Hope you are having a lovely day.`,
        author: "Moodo",
      }))
    } else {
      setQuoteData({})
    }
    // Cleaning up the interval on component unmount
    return () => {
      clearInterval(interval)
    }
  }, [user])

  // Rendering the QuotesDisplay component
  return (
    <Flex
      bgColor="themeColor.pastel"
      justifyContent="center"
      p={2}
      overflow="hidden"
      aria-label="inspirational quote"
      minH="2.5rem"
    >
      {quoteData && (
        // Applying motion effect to the displayed quote for a smooth transition
        <motion.div
          key={quoteData.quote}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <HStack display={{ md: "flex" }}>
            <Text mb={0} mx={3}>
              {quoteData.quote}
              {quoteData.author && (
                <Badge ml={2} mt={0} bgColor="transparent">
                  -{quoteData.author}
                </Badge>
              )}
            </Text>
          </HStack>
        </motion.div>
      )}
    </Flex>
  )
}

export default QuotesDisplay
