import { useRef, useState } from "react"
import { Link as ReactLink } from "react-router-dom"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { VscSmiley } from "react-icons/vsc"

import { useAuth } from "../../contexts/AuthProvider"
import { addMoodInfoToFirestore } from "../../FirestoreQueries"
import moodSliderStyles from "./MoodSlider.module.css"

const MoodSlider = () => {
  const [feel, setFeel] = useState("")
  const [input, setInput] = useState("")
  const [error, setError] = useState(null)

  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleMoodBarChange = (e) => {
    if (e === 0) {
      setFeel(["depressed", 0])
    } else if (e === 25) {
      setFeel(["sad", 25])
    } else if (e === 50) {
      setFeel(["alright", 50])
    } else if (e === 75) {
      setFeel(["happy", 75])
    } else if (e === 100) {
      setFeel(["amazing", 100])
    }
  }

  const handleMoodBarSubmit = async (e) => {
    e.preventDefault()
    if (feel && input.length > 0) {
      const moodBody = {
        feel: feel,
        date: new Date(),
        description: input.trim(),
        userId: user.uid,
      }
      try {
        await addMoodInfoToFirestore(moodBody)

        toast({
          title: "Mood added!",
          description: "Your current mood has been recorded.",
          status: "success",
          position: "bottom-right",
          duration: 9000,
          isClosable: true,
        })
        setInput("")
        onClose()
      } catch (err) {
        console.error(err)
      }
    } else {
      setError("Oh no! You can't leave it blank.")
    }
  }
  return (
    <VStack
      m={20}
      bg="themeColor.pastel"
      p="5rem"
      // minW='20rem'
      maxW="50rem"
      w={{ base: "100%", sm: "80%" }}
      textAlign="center"
      borderRadius={40}
      zIndex={100}
      opacity={0.9}
    >
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent bgColor="themeColor.beige">
          <ModalHeader>What&apos;s on your mind?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                ref={initialRef}
                borderColor="gray.400"
                focusBorderColor="themeColor.brown"
                maxLength="400"
                type="text"
                minH="150px"
                placeholder="Describe how you are feeling right now or what's going on in your life ..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <FormHelperText textAlign="end">
                {400 - input.length} characters left.
              </FormHelperText>
              {error && <Text color="red">{error}</Text>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              aria-label="mood-confirm-btn"
              bgColor="themeColor.yellow"
              colorScheme="yellow"
              mr={3}
              onClick={handleMoodBarSubmit}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Heading id="mood-tracker">Mood Tracker</Heading>
      <Text fontSize="2xl">How are you doing today?</Text>

      {
        <Image
          mt={2}
          boxSize="110px"
          src={`/${feel[0] || "alright"}.png`}
          alt="emoticon"
        />
      }
      <Text aria-label="current-mood" mt={3}>
        I am {feel[0] || "..."}
      </Text>
      <Slider
        minW="80%"
        aria-label="mood-slider"
        aria-labelledby="mood-tracker"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={feel[1]}
        defaultValue={0}
        step={25}
        colorScheme="orange"
        onChange={handleMoodBarChange}
      >
        <SliderMark value={0} mt="5" ml="-3" fontSize="md">
          Awful
        </SliderMark>
        <SliderMark value={25} mt="5" ml="-1" fontSize="md">
          Bad
        </SliderMark>
        <SliderMark value={50} mt="5" ml="-2" fontSize="md">
          Ok
        </SliderMark>
        <SliderMark value={75} mt="5" ml="-3" fontSize="md">
          Good
        </SliderMark>
        <SliderMark value={100} mt="5" ml="-1" fontSize="md">
          Great!{" "}
        </SliderMark>

        <SliderTrack bg="yellow.100">
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={6} aria-hidden>
          <Box color="orange.400" as={VscSmiley} />
        </SliderThumb>
      </Slider>

      <Button
        type="submit"
        onClick={feel ? onOpen : onClose}
        mt={10}
        bgColor="themeColor.yellow"
        colorScheme="yellow"
        aria-labelledby="mood-tracker"
        data-testid="mood-submit"
      >
        Confirm
      </Button>
      <Link
        fontSize="xl"
        fontWeight="bold"
        color="themeColor.red"
        as={ReactLink}
        to={"/moodgraph"}
        aria-label="click to checkout your mood graph"
        ref={finalRef}
        className={moodSliderStyles.graphLink}
      >
        Have a look at your Mood Graph
      </Link>
    </VStack>
  )
}

export default MoodSlider
