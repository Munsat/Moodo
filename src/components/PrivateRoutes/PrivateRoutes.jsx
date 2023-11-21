import { Navigate, Outlet } from "react-router-dom"
import { Container, Heading, Spinner } from "@chakra-ui/react"

import { useAuth } from "../../contexts/AuthProvider"

// Component for handling private routes based on user authentication status
const PrivateRoutes = (props) => {
  // Accessing user and loading status from the authentication context
  const { user, isLoadingUser } = useAuth()

  // If user data is still loading, display a loading spinner
  if (isLoadingUser)
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
  // If user is authenticated, render the nested routes; otherwise, redirect to the specified route
  return user ? <Outlet /> : <Navigate to={props.redirectTo} replace />
}

export default PrivateRoutes
