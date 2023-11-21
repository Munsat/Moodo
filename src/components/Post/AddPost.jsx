import { useToast } from "@chakra-ui/react"
import { createPost } from "../../FirestoreQueries"
import { useAuth } from "../../contexts/AuthProvider"
import AddUserInput from "../AddUserInput/AddUserInput"

//Adds a post to the discussion board
const AddPost = ({ posts, setPosts }) => {
  const toast = useToast()
  // Accessing user information from the authentication context
  const { user } = useAuth()
  const placeholder = "What's on your mind?"

  // Function to handle form submission and add a new post
  const onSubmit = async (input) => {
    // Building the post body with user information and input text
    const body = {
      userId: user.uid,
      username: user.displayName,
      text: input.trim(),
      created_on: Date.now(),
      updated_on: Date.now(),
      likes: [],
    }
    try {
      // Creating the post in Firestore and updating the local state
      const postRes = await createPost(body)
      const data = {
        id: postRes.id,
        ...body,
      }
      setPosts([data, ...posts])

      // Displaying a success toast notification
      toast({
        title: "You just made a new post!",
        description: "Your post has been added to the discussion board.",
        status: "success",
        position: "bottom-right",
        duration: 9000,
        isClosable: true,
      })
    } catch (err) {
      // Handling errors during the post creation process
      console.error(err)
    }
  }

  return (
    <AddUserInput
      placeholder={placeholder}
      widthLength={"70%"}
      charLength={400}
      onSubmit={onSubmit}
    />
  )
}

export default AddPost
