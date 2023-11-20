import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"

import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { auth } from "../firebaseConfig"
import { addUserInfoToFirestore } from "../FirestoreQueries"
//moodo.customerservice@gmail.com

// Creating a Google Auth provider instance
const provider = new GoogleAuthProvider()

// Creating an AuthContext to manage user authentication state
const AuthContext = createContext({})

// Custom hook to use the AuthContext in components
export const useAuth = () => {
  return useContext(AuthContext)
}

// AuthProvider component to provide authentication functionality
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Effect hook to check user authentication status on component mount
  useEffect(() => {
    const loginCheck = async () => {
      try {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is authenticated, set user and navigate to the home page
            setUser(user)
            navigate("/")
            setIsLoadingUser(false)
          } else {
            // No user found, set loading to false
            setIsLoadingUser(false)
          }
        })
      } catch (err) {
        // Handle errors during authentication status check
        setIsLoadingUser(false)
      }
    }
    setIsLoadingUser(true)
    loginCheck()
  }, [])

  // Function to handle user registration
  const register = async (body) => {
    setIsLoadingUser(true)
    const userCred = await createUserWithEmailAndPassword(
      auth,
      body["email"],
      body["password"]
    )
    await addUserInfoToFirestore(userCred.user.uid, {
      email: body["email"],
      name: body["name"],
    })
    await updateProfile(auth.currentUser, {
      displayName: body["name"],
    })
    // Set user, navigate to the home page, and set loading to false
    setUser(userCred.user)
    navigate("/")
    setIsLoadingUser(false)
  }

  // Function to handle user login
  const login = async (email, password) => {
    setIsLoadingUser(true)
    const userCred = await signInWithEmailAndPassword(auth, email, password)
    setUser(userCred.user)
    navigate("/")
    setIsLoadingUser(false)
  }

  // Function to handle user login with Google
  const loginWithGoogle = async () => {
    setIsLoadingUser(true)
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      // Set user, navigate to the home page and set loading to false
      setUser(user)
      navigate("/")
      setIsLoadingUser(false)
    } catch {
      // Handle errors during Google login
      setIsLoadingUser(false)
    }
  }

  // Function to handle user logout
  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  // Providing the AuthContext to the entire application
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loginWithGoogle,
        isLoadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
