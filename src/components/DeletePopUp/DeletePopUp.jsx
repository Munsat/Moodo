import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react"
import { useRef } from "react"

// DeletePopUp component for confirming deletion
const DeletePopUp = ({ deleteId, isOpen, onClose, handleDelete }) => {
  // Using a ref to access the cancel button
  const cancelRef = useRef(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bgColor="themeColor.beige">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Entry
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can&apos;t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              colorScheme="yellow"
              bgColor="themeColor.yellow"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              bgColor="themeColor.red"
              onClick={() => handleDelete(deleteId)}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DeletePopUp
