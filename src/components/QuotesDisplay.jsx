import { Badge, Flex, HStack, Text } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthProvider"
import { motion } from "framer-motion"

const QuotesDisplay = () => {
  const { user } = useAuth()
  const [quoteData, setQuoteData] = useState({})
  const api_url = `https://api.api-ninjas.com/v1/quotes?category=inspirational`
  const apiKey = import.meta.env.VITE_REACT_APP_APININJAS_API_KEY
  useEffect(() => {
    const getQuotes = async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            "X-Api-Key": apiKey,
          },
        })
        if (response.status === 200 && response.data[0].quote.length < 250) {
          setQuoteData({
            quote: response.data[0].quote,
            author: response.data[0].author,
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
    const interval = setInterval(() => {
      getQuotes(api_url)
    }, 30000)

    if (user) {
      setQuoteData((prevData) => ({
        ...prevData,
        quote: `Hi ${user.displayName}! Welcome to Moodo. Hope you are having a lovely day.`,
        author: "Moodo",
      }))
    } else {
      setQuoteData({})
    }

    return () => {
      clearInterval(interval)
    }
  }, [user])

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
