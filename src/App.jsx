import "@fontsource/poiret-one/400.css"
import "@fontsource/raleway/400.css"

import { Routes, Route } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"

import theme from "./theme"
import LoginForm from "./components/AppEntry/LoginForm"
import NotFound from "./pages/NotFound/NotFound"
import RegisterForm from "./components/AppEntry/RegisterForm"
import PrivateRoutes from "./components/PrivateRoutes/PrivateRoutes"
import Home from "./pages/Home/Home"
import Logout from "./components/AppEntry/Logout"
import MoodGraph from "./components/Mood/MoodGraph"
import Meditation from "./pages/Meditation/Meditation"
import Journal from "./pages/Journal/Journal"
import Community from "./pages/Community/Community"
import QuotesDisplay from "./components/QuotesDisplay/QuotesDisplay"
import NavBar from "./components/NavBar/NavBar"

function App() {
  return (
    <ChakraProvider theme={theme}>
      <NavBar />
      <QuotesDisplay />

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<PrivateRoutes redirectTo="/login" />}>
          <Route path="/" element={<Home />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/moodgraph" element={<MoodGraph />} />
          <Route path="/community" element={<Community />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
export default App
