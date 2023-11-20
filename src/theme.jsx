import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: `Poiret One, sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  colors: {
    themeColor: {
      beige: "#F3F0D7",
      pastel: "#CEE5D0",
      brown: "#E0C097",
      red: "#FF7878",
      yellow: "#FFC93C",
      darkPastel: "#B5D5C5",
    },
  },
})

export default theme
