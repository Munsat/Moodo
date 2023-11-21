import {
  FormControl,
  FormHelperText,
  Textarea,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"

// AddUserInput component for capturing and submitting user input
const AddUserInput = ({ onSubmit, placeholder, charLength, widthLength }) => {
  // State to manage input value and error message
  const [input, setInput] = useState("")
  const [error, setError] = useState(null)

  // Event handler for handling input submission
  const handleClick = async () => {
    if (input.length > 0) {
      setError("")
      await onSubmit(input)
      setInput("")
    } else {
      setError("Oh no! You can't post a blank entry.")
    }
  }

  return (
    <VStack
      mb={7}
      alignItems="end"
      w={{ base: "100%", lg: `${widthLength}` }}
      m="auto"
    >
      {/* Form control for capturing user input */}
      <FormControl>
        <Textarea
          borderColor="gray.400"
          focusBorderColor="themeColor.brown"
          maxLength="400"
          width="100%"
          minH="8rem"
          type="text"
          bgColor="white"
          placeholder={placeholder}
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        {/* Display character count and remaining characters */}
        <FormHelperText textAlign="end">
          {charLength - input.length} characters left.
        </FormHelperText>
        {/* Display error message if input is empty */}
        {input.length === 0 && error && (
          <Text aria-label="error-message" color="red">
            {error}
          </Text>
        )}
      </FormControl>
      <Button
        px={7}
        size="md"
        colorScheme="yellow"
        type="submit"
        onClick={handleClick}
      >
        Submit
      </Button>
    </VStack>
  )
}

export default AddUserInput
