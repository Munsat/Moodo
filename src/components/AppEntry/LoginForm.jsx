import { useState } from "react"
import { Link as ReactLink } from "react-router-dom"

import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  Text,
  ButtonGroup,
  Link,
} from "@chakra-ui/react"
import { useAuth } from "../../contexts/AuthProvider"

// LoginForm component for user authentication
const LoginForm = () => {
  // Auth context to handle user authentication
  const { login, loginWithGoogle } = useAuth()
  const [error, setError] = useState(null)

  // Event handler for form submission
  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const body = Object.fromEntries(formData)
    try {
      // Attempt to login with email and password
      await login(body["email"], body["password"])
    } catch (err) {
      // Handle different authentication errors
      const errorCode = err.code
      const errorMessage = err.message
      if (
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/invalid-email"
      ) {
        setError("Sorry, your email or password is incorrect. Try again.")
      } else if (errorCode === "auth/too-many-requests") {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. Try again after sometime."
        )
      } else {
        setError(errorMessage)
      }
    }
  }
  // Event handler for signing in with Google
  const handleSignInWithGoogle = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      // Handle errors during Google sign-in
      const errorCode = err.code
      const errorMessage = err.message
      console.error(errorCode, errorMessage)
      setError(errorMessage)
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
      {/* Display error message if authentication fails */}
      {error && <Text color="red">{error}</Text>}

      {/* Login form */}
      <form onSubmit={handleLoginSubmit} aria-label="form">
        <FormControl isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            name="email"
            variant="flushed"
            type="text"
            placeholder="abby@test.com"
            borderColor="black"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            name="password"
            variant="flushed"
            borderColor="black"
          />
        </FormControl>
        <ButtonGroup mt={4}>
          <Button
            colorScheme="yellow"
            bgColor="#FFC93C"
            color="black"
            type="submit"
          >
            Login
          </Button>
          <Button
            colorScheme="green"
            bgColor="#B5D5C5"
            color="black"
            onClick={handleSignInWithGoogle}
          >
            Sign In with Google
          </Button>
        </ButtonGroup>
        <Text mt={2}>
          Not a member yet?
          <br />
          <Link color="orange.500" as={ReactLink} to="/register">
            Sign Up
          </Link>
        </Text>
      </form>

      {/* Demo account information */}
      <Text mt={3} as="sub">
        Demo Account:
      </Text>
      <br />
      <Text as="sub">Email: test@abc.com</Text>
      <br />
      <Text as="sub">Password: test123</Text>
    </Container>
  )
}
export default LoginForm
