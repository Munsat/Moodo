import { IconButton, Text, VStack } from "@chakra-ui/react"
import { motion, useAnimation } from "framer-motion"
import circleStyles from "./Breathe.module.css"
import { useRef, useState } from "react"
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from "react-icons/ai"
const Breathe = () => {
  const [showInhale, setShowInhale] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef(null)
  const controlsText = useAnimation()
  const controlsCircle = useAnimation()

  const startAnimations = () => {
    setShowInhale(true)
    setIsAnimating(true)
    controlsCircle.start((i) => ({
      scale: [1, (i + 0.5) / 2, (i + 0.5) / 2, 1],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 2,
        repeatType: "reverse",
      },
    }))
    controlsText.start({
      scale: [1, 1.2, 1.2, 1],
      opacity: [0, 1, 0, 0, 0, 1, 0],
      transition: {
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 2,
        repeatType: "reverse",
      },
    })
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setShowInhale((prevShowInhale) => !prevShowInhale)
    }, 4920)
  }

  const stopAnimations = () => {
    setShowInhale(true)
    setIsAnimating(false)
    controlsCircle.stop()
    controlsText.stop()
    clearInterval(intervalRef.current)
  }

  return (
    <VStack
      my="15rem"
      id="breath"
      justifyContent="center"
      alignItems="center"
      minH="6rem"
    >
      {[1, 2, 3, 4].map((item) => (
        <motion.div
          key={item}
          className={circleStyles.circle}
          animate={controlsCircle}
          custom={item}
        ></motion.div>
      ))}
      <motion.div animate={controlsText} position="absolute">
        {showInhale !== null ? (
          <Text className={circleStyles.text} color="orange.800" fontSize="lg">
            {showInhale ? "Inhale..." : "Exhale..."}
          </Text>
        ) : null}
      </motion.div>
      <IconButton
        fontSize="5rem"
        bgColor="transparent"
        color="transparent"
        _hover={{ color: "#B5D5C5" }}
        _active={{ color: "#93bda8" }}
        position="absolute"
        onClick={isAnimating ? stopAnimations : startAnimations}
        aria-label="breathing activity btn"
        icon={isAnimating ? <AiOutlinePauseCircle /> : <AiOutlinePlayCircle />}
      />
    </VStack>
  )
}

export default Breathe
