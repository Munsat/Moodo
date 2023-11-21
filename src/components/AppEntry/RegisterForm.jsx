import { useState } from "react"
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Container,
  Text,
  Link,
} from "@chakra-ui/react"

import { Link as ReactLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthProvider"

const RegisterForm = () => {
  // Access the register function from the AuthProvider
  const { register } = useAuth()
  // State to manage error messages during registration
  const [error, setError] = useState(null)

  // Handle registration form submission
  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    // Extract form data
    const formData = new FormData(event.target)
    const body = Object.fromEntries(formData)
    try {
      // Check if the entered passwords match
      if (body["password"] === body["password1"]) {
        // Call the register function from the AuthProvider
        await register(body)
      } else {
        // Set an error message if passwords don't match
        setError("Sorry passwords don't match")
      }
    } catch (err) {
      // Handle registration errors
      const errorCode = err.code
      const errorMessage = err.message
      if (errorCode === "auth/weak-password") {
        setError("The password has to be atleast 6 characters")
      } else if (errorCode === "auth/email-already-in-use") {
        setError("This email already exists. Try logging in.")
      } else {
        setError(errorMessage)
      }
    }
  }

  return (
    <Container
      maxW="md"
      pt={7}
      bg="themeColor.beige"
      p={20}
      my={10}
      borderRadius={30}
      centerContent
    >
      {/* Display error message if there is any */}
      {error && <Text color="red">{error}</Text>}
      {/* Registration form */}
      <form onSubmit={handleRegisterSubmit} aria-label="form">
        <FormControl isRequired>
          <FormLabel htmlFor="name">Name: </FormLabel>
          <Input
            variant="flushed"
            type="text"
            name="name"
            placeholder="Abby Cole"
            borderColor="black"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="email">Email: </FormLabel>
          <Input
            variant="flushed"
            type="email"
            name="email"
            placeholder="abby@gmail.com"
            borderColor="black"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="password1">Enter Password: </FormLabel>
          <Input
            variant="flushed"
            type="password"
            name="password"
            borderColor="black"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="password2">Enter Password Again: </FormLabel>
          <Input
            variant="flushed"
            type="password"
            name="password1"
            borderColor="black"
          />
          <FormHelperText>Your passwords must match.</FormHelperText>
        </FormControl>
        <Button
          type="submit"
          colorScheme="yellow"
          bgColor="themeColor.yellow"
          mt={4}
        >
          Register
        </Button>
      </form>
      {/* Link to sign in if user already has an account */}
      <Text mt={2}>
        Already have an account?
        <br />
        <Link color="orange.500" as={ReactLink} to="/login">
          Sign in
        </Link>
      </Text>
    </Container>
  )
}

export default RegisterForm
