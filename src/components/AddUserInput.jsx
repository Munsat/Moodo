import {
  FormControl,
  FormHelperText,
  Textarea,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"

const AddUserInput = ({ onSubmit, placeholder, charLength, widthLength }) => {
  const [input, setInput] = useState("")
  const [error, setError] = useState(null)

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

        <FormHelperText textAlign="end">
          {charLength - input.length} characters left.
        </FormHelperText>
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
