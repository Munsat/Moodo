import { Container, Heading, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import { queryAllPosts } from "../../FirestoreQueries"
import AddPost from "../../components/Post/AddPost"
import AllPosts from "../../components/Post/AllPosts"
import communityStyles from "./Community.module.css"
const Community = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    const getQuery = async () => {
      const queryArr = []

      try {
        const queryRes = await queryAllPosts()
        queryRes.forEach((snap) => {
          const data = { id: snap.id, ...snap.data() }
          queryArr.push(data)
        })
        setPosts(queryArr)
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
