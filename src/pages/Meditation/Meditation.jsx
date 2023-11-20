import { getDownloadURL, ref } from "firebase/storage"
import { useEffect, useState } from "react"
import { queryForAudioInfo } from "../../FirestoreQueries"
import { storage } from "../../firebaseConfig"

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
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer"

const Meditation = () => {
  const [allAudio, setAllAudio] = useState([])
  const [audioIndex, setAudioIndex] = useState(null)
  const [activeAudio, setActiveAudio] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const audioArr = []
    const getAllAudio = async () => {
      try {
        const response = await queryForAudioInfo()
        response.forEach((snap) => {
          audioArr.push(snap.data())
        })
        setAllAudio(audioArr)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    setIsLoading(true)
    getAllAudio()
  }, [])

  const handleSong = async (audio) => {
    const storageref = ref(storage, audio.url)
    try {
      const url = await getDownloadURL(storageref)
      setAudioUrl(url)
    } catch (err) {
      console.error(err)
    }
  }

  const handleClick = async (audio, index) => {
    await handleSong(audio)
    setActiveAudio(audio)
    setAudioIndex(index)
  }

  const handleSongChange = (audio, index) => {
    setActiveAudio(audio)
    setAudioIndex(index)
  }
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
