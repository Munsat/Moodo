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

// AudioPlayer component for playing audio tracks
const AudioPlayer = ({
  currentAudio,
  audioIndex,
  allAudio,
  audioUrl,
  handleSongChange,
}) => {
  // Refs for controlling audio and progress bar
  const audioRef = useRef()
  const progressBarRef = useRef()
  const intervalRef = useRef()

  // State for controlling play/pause, duration, and current time
  const [isPlaying, setIsPlaying] = useState(true)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState("")

  // Effect for handling play/pause and updating current time
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

  // Function to format time in minutes and seconds
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

  // Event handler for metadata (duration) of the audio track
  const handleMetadata = (event) => {
    setDuration(event.target.duration)
    audioRef.current.currentTime = 0

    setCurrentTime(0)
  }
  // Event handler for changing the progress bar value
  const handleProgressBarChange = (v) => {
    audioRef.current.currentTime = v
  }
  // Event handler for the end of the audio track
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
      {/* Display audio track image */}
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
        {/* Progress bar */}
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
