import {
  Badge,
  Button,
  ButtonGroup,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { formatDistance } from "date-fns"
import { useState } from "react"
import Comment from "../Comment/Comment"
import AddComment from "../Comment/AddComment"
import DeletePopUp from "../DeletePopUp/DeletePopUp"

const PostDetails = ({
  finalRef,
  isOpen,
  onClose,
  handleLike,
  handlePostDelete,
  post,
  user,
  comments,
  setComments,
}) => {
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
  return (
    <Modal
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent p={5} borderRadius="1.6rem">
        <ModalHeader>
          <Heading>{post.username}</Heading>
          <Badge colorScheme="yellow" variant="outline">
            {formatDistance(Date.now(), post.created_on)} ago
          </Badge>
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <Text p={3} m={3} bgColor="themeColor.beige" borderRadius={15}>
            {post.text}
          </Text>

          <AddComment
            post={post}
            comments={comments}
            setComments={setComments}
          />
          {comments &&
            comments.map((comment) => (
              <Comment
                comment={comment}
                key={comment.id}
                setComments={setComments}
                comments={comments}
              />
            ))}
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            {post.likes.includes(user.uid) ? (
              <Button colorScheme="orange" onClick={() => handleLike(post)}>
                Unlike
              </Button>
            ) : (
              <Button
                bgColor="themeColor.pastel"
                color="black"
                colorScheme="green"
                onClick={() => handleLike(post)}
              >
                Like
              </Button>
            )}

            {user.uid === post.userId && (
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => setIsDeletePopupOpen(true)}
              >
                Delete
              </Button>
            )}
          </ButtonGroup>
          <DeletePopUp
            deleteId={post.id}
            isOpen={isDeletePopupOpen}
            onClose={() => setIsDeletePopupOpen(false)}
            handleDelete={handlePostDelete}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PostDetails
