import {
  HStack,
  Heading,
  Icon,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { FaPlay, FaPause } from "react-icons/fa"
const AudioPlayer = ({
  currentAudio,
  audioIndex,
  allAudio,
  audioUrl,
  handleSongChange,
}) => {
  const audioRef = useRef()
  const progressBarRef = useRef()
  const intervalRef = useRef()

  const [isPlaying, setIsPlaying] = useState(true)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    if (audioUrl) {
      if (isPlaying) {
        audioRef.current.play()
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
          setCurrentTime(audioRef.current.currentTime)
        }, 500)
      } else {
        audioRef.current.pause()
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, audioRef, currentAudio])

  const formatTime = (time) => {
    if (time) {
      const min = Math.floor(time / 60)
      const minutes = min < 10 ? "0" + min : min

      const sec = Math.floor(time) % 60
      const seconds = sec < 10 ? "0" + sec : sec
      return `${minutes}:${seconds}`
    }
    return `00:00`
  }

  const handleMetadata = (event) => {
    setDuration(event.target.duration)
    audioRef.current.currentTime = 0

    setCurrentTime(0)
  }

  const handleProgressBarChange = (v) => {
    audioRef.current.currentTime = v
  }

  const handleEnd = () => {
    clearInterval(intervalRef.current)
    if (audioIndex >= allAudio.length - 1) {
      handleSongChange(null, 0)
    } else {
      handleSongChange(allAudio[audioIndex + 1], audioIndex + 1)
    }

    audioRef.current.currentTime = 0
    setCurrentTime(0)
  }
  return (
    <VStack my={7}>
      <Image
        objectFit="cover"
        maxW={{ base: "90%", sm: "90%", md: "70%" }}
        aspectRatio={1.5 / 1}
        src={currentAudio.imageUrl}
        alt={currentAudio.title}
      />
      <Heading size="sm">{currentAudio.title}</Heading>
      <Text>{currentAudio.artist} </Text>
      <HStack width="80%" justifyContent="center">
        {!isPlaying ? (
          <Icon role="button" as={FaPlay} onClick={() => setIsPlaying(true)}>
            Play
          </Icon>
        ) : (
          <Icon role="button" as={FaPause} onClick={() => setIsPlaying(false)}>
            Pause
          </Icon>
        )}
        <audio
          ref={audioRef}
          src={audioUrl}
          type="audio/mpeg"
          onLoadedMetadata={handleMetadata}
          onEnded={handleEnd}
        ></audio>
        <Text>{formatTime(currentTime)}</Text>
        <Slider
          aria-label="slider-ex-1"
          min={0}
          max={duration}
          ref={progressBarRef}
          value={currentTime}
          minW={"220px"}
          onChange={handleProgressBarChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text>{formatTime(duration)}</Text>
      </HStack>
    </VStack>
  )
}

export default AudioPlayer
