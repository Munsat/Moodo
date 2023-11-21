import { useEffect, useState } from "react"
import {
  Card,
  VStack,
  Image,
  Stack,
  CardBody,
  Heading,
  Text,
  Box,
  Icon,
  Flex,
  Container,
  Spinner,
} from "@chakra-ui/react"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "../../firebaseConfig"
import { queryForAudioInfo } from "../../FirestoreQueries"
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer"

const Meditation = () => {
  const [allAudio, setAllAudio] = useState([])
  const [audioIndex, setAudioIndex] = useState(null)
  const [activeAudio, setActiveAudio] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // useEffect to fetch and set audio data when the component mounts
  useEffect(() => {
    const audioArr = []
    // Function to perform the Firestore query and update state
    const getAllAudio = async () => {
      try {
        // Fetching all audio information from Firestore
        const response = await queryForAudioInfo()
        // Mapping query results to an array
        response.forEach((snap) => {
          audioArr.push(snap.data())
        })
        // Setting the state with the fetched audio data
        setAllAudio(audioArr)
      } catch (err) {
        console.error(err)
      } finally {
        // Updating loading status after data fetching is complete
        setIsLoading(false)
      }
    }
    // Initiating the data fetching process
    setIsLoading(true)
    getAllAudio()
  }, [])

  // Function to handle loading the audio file for playback
  const handleSong = async (audio) => {
    const storageref = ref(storage, audio.url)
    try {
      // Fetching the download URL of the audio file from Firebase Storage
      const url = await getDownloadURL(storageref)
      setAudioUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  // Function to handle the click event on a specific audio card
  const handleClick = async (audio, index) => {
    // Loading the audio file and updating the active audio state
    await handleSong(audio)
    setActiveAudio(audio)
    setAudioIndex(index)
  }

  // Function to handle the change of the currently playing audio
  const handleSongChange = (audio, index) => {
    setActiveAudio(audio)
    setAudioIndex(index)
  }

  // If still loading, render a Spinner component
  if (isLoading)
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
  // Once loading is complete, render the main content
  return (
    <Flex
      mt="5rem"
      display={{ xl: "flex" }}
      justifyContent="space-around"
      mx="auto"
      gap="3rem"
      maxW="100rem"
    >
      <VStack>
        {activeAudio ? (
          <AudioPlayer
            currentAudio={activeAudio}
            audioIndex={audioIndex}
            handleSongChange={handleSongChange}
            allAudio={allAudio}
            audioUrl={audioUrl}
          />
        ) : (
          <VStack mx="5rem" my={4}>
            <Flex
              aspectRatio={1.5 / 1}
              minW="350px"
              width={{ base: "100%", lg: "600px" }}
              bg="blackAlpha.100"
              justifyContent="center"
              alignItems="center"
            >
              <Icon
                as={BsMusicNoteBeamed}
                fontSize="7rem"
                color="gray.500"
              ></Icon>
            </Flex>
            <Box color="blackAlpha.400" textAlign="left" width="400px">
              <Box>███████ ██████████████</Box>
              <Box>██████████████ </Box>
            </Box>
          </VStack>
        )}
      </VStack>
      <VStack direction="column" gap=".6rem" w="100%">
        {allAudio.map((audio, index) => (
          <Card
            role="button"
            key={audio.url}
            id={audio.title}
            borderRadius={12}
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="filled"
            width={{ base: "100%", lg: "70%" }}
            maxW="40rem"
            minW="22rem"
            onClick={() => handleClick(audio, index)}
            bgColor={
              activeAudio?.title === audio.title
                ? "themeColor.beige"
                : "themeColor.pastel"
            }
            border={"1px"}
            borderColor={
              activeAudio?.title === audio.title
                ? "themeColor.yellow"
                : "transparent"
            }
            _hover={{
              bg: "themeColor.beige",
              border: "1px",
              borderColor: "themeColor.yellow",
              transition: "all 400ms ease-in-out",
            }}
          >
            <Image
              objectFit="cover"
              maxW={{ base: "100%", sm: "100px" }}
              src={audio.imageUrl}
              alt={audio.title}
            />

            <Stack>
              <CardBody>
                <Heading size="sm">{audio.title}</Heading>
                <Text fontSize="sm">{audio.artist}</Text>
              </CardBody>
            </Stack>
          </Card>
        ))}
      </VStack>
    </Flex>
  )
}

export default Meditation
