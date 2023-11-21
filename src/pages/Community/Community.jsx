import { Container, Heading, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import { queryAllPosts } from "../../FirestoreQueries"
import AddPost from "../../components/Post/AddPost"
import AllPosts from "../../components/Post/AllPosts"
import communityStyles from "./Community.module.css"
const Community = () => {
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false)
  // State to store posts data
  const [posts, setPosts] = useState(null)

  // useEffect to fetch and set posts data when the component mounts
  useEffect(() => {
    const getQuery = async () => {
      const queryArr = []

      try {
        // Fetching all posts from Firestore
        const queryRes = await queryAllPosts()
        queryRes.forEach((snap) => {
          // Mapping query results to an array with added IDs
          const data = { id: snap.id, ...snap.data() }
          queryArr.push(data)
        })
        // Setting the posts state and updating loading status
        setPosts(queryArr)
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
    <Container
      centerContent
      maxWidth="100%"
      bg="themeColor.beige"
      p={{ base: "1.5rem", sm: "2rem", md: "5rem" }}
      w="100%"
      mx="auto"
      className={communityStyles.waveContainer}
    >
      <Heading>Discussion Board</Heading>
      <AddPost posts={posts} setPosts={setPosts} />
      <AllPosts posts={posts} setPosts={setPosts} />
    </Container>
  )
}

export default Community
