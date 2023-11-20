import { useEffect } from "react"
import { useAuth } from "../../contexts/AuthProvider"

const Logout = () => {
  const { logout } = useAuth()

  useEffect(() => {
    logout()
    console.log("user has been logged out")
  }, [])
}

export default Logout
