import { Flex } from "@chakra-ui/react"
import Post from "./Post"

// Component to render all posts
const AllPosts = ({ posts, setPosts }) => {
  return (
    <Flex
      alignContent="stretch"
      alignItems="start"
      mt="3rem"
      w="100%"
      flexWrap="wrap"
      gap="2.9rem"
      justifyContent={{ md: "center", xl: "stretch" }}
    >
      {/* Mapping through the posts array and rendering individual Post components */}
      {posts &&
        posts.map((post) => (
          <Post post={post} posts={posts} setPosts={setPosts} key={post.id} />
        ))}
    </Flex>
  )
}

export default AllPosts
