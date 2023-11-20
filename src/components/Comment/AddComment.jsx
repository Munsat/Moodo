import { Heading, VStack, useToast } from "@chakra-ui/react"
import { AddCommentToFirestore } from "../../FirestoreQueries"
import { useAuth } from "../../contexts/AuthProvider"
import AddUserInput from "../AddUserInput"

//Adds a comment to a post
const AddComment = ({ post, comments, setComments }) => {
  const placeholder = "Leave a comment..."

  const toast = useToast()
  const { user } = useAuth()
  const onSubmit = async (input) => {
    const body = {
      userId: user.uid,
      username: user.displayName,
      postId: post.id,
      text: input.trim(),
      created_on: Date.now(),
      updated_on: Date.now(),
    }
    try {
      const commentRes = await AddCommentToFirestore(body)
      const data = {
        id: commentRes.id,
        ...body,
      }
      setComments([data, ...comments])

      toast({
        title: "Comment Added!",
        description: "Your comment has been added to the post.",
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
    <VStack my={7} alignItems="start" w="100%">
      <Heading size="md" ml={{ md: "2rem" }}>
        Comments:
      </Heading>

      <AddUserInput
        widthLength={"90%"}
        placeholder={placeholder}
        charLength={400}
        onSubmit={onSubmit}
      />
    </VStack>
  )
}

export default AddComment
