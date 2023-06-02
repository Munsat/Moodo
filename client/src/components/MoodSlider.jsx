import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
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
} from "@chakra-ui/react";
import { VscSmiley } from "react-icons/vsc";
import { useRef, useState } from "react";

import { useFireStore } from "../contexts/FirestoreProvider";
import { useAuth } from "../contexts/AuthProvider";

const MoodSlider = () => {
  const [feel, setFeel] = useState("");
  const [input, setInput] = useState("");
  const [moodDetail, setMoodDetail] = useState(null);
  const [error, setError] = useState(null);

  const { addMoodInfoToFirestore } = useFireStore();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const handleMoodBarChange = (e) => {
    if (e === 0) {
      setFeel("depressed");
    } else if (e === 25) {
      setFeel("sad");
    } else if (e === 50) {
      setFeel("alright");
    } else if (e === 75) {
      setFeel("happy");
    } else if (e === 100) {
      setFeel("amazing");
    }
  };

  const handleMoodBarSubmit = async (e) => {
    e.preventDefault();

    if (feel && input.length > 0) {
      const moodBody = {
        feel: feel,
        date: new Date(),
        description: input.trim(),
        userId: user.uid,
      };
      try {
        const moodRes = await addMoodInfoToFirestore(moodBody);
        setMoodDetail({
          id: moodRes.id,
          ...moodBody,
        });

        toast({
          title: "Mood added!",
          description: "Your current mood has been recorded.",
          status: "success",
          position: "bottom-right",
          duration: 9000,
          isClosable: true,
        });
        setInput("");
        onClose();
      } catch (err) {
        console.log(err);
      }
    } else {
      setError("Oh no! You can't leave it blank.");
    }
  };
  return (
    <VStack
      m={20}
      bg="themeColor.pastel"
      p="5rem"
      borderRadius={40}
      w="40rem"
      zIndex={100}
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
          <ModalHeader>What's on your mind?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                ref={initialRef}
                borderColor="gray.400"
                focusBorderColor="themeColor.brown"
                maxLength="200"
                type="text"
                minH="150px"
                placeholder="Describe how you are feeling right now or what's going on in your life ..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />

              <FormHelperText textAlign="end">
                {200 - input.length} characters left.
              </FormHelperText>
              {error && <Text color="red">{error}</Text>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
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

      <Heading>Mood Tracker</Heading>
      <Text fontSize="2xl">How are you doing today?</Text>
      <Text aria-label="current mood" mt={5}>
        I am {feel || "..."}
      </Text>
      <Slider
        aria-label="mood-slider"
        defaultValue={0}
        step={25}
        colorScheme="orange"
        onChange={handleMoodBarChange}
      >
        <SliderMark value={0} mt="5" ml="-2.5" fontSize="md">
          Awful
        </SliderMark>
        <SliderMark value={25} mt="5" ml="-2.5" fontSize="md">
          Bad
        </SliderMark>
        <SliderMark value={50} mt="5" ml="-2.5" fontSize="md">
          Ok
        </SliderMark>
        <SliderMark value={75} mt="5" ml="-2.5" fontSize="md">
          Good
        </SliderMark>
        <SliderMark value={100} mt="5" ml="-2.5" fontSize="md">
          Great!{" "}
        </SliderMark>

        <SliderTrack bg="yellow.100">
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box color="orange.400" as={VscSmiley} />
        </SliderThumb>
      </Slider>

      <Button
        type="submit"
        onClick={feel ? onOpen : null}
        mt={10}
        bgColor="themeColor.yellow"
      >
        Confirm
      </Button>
    </VStack>
  );
};

export default MoodSlider;
