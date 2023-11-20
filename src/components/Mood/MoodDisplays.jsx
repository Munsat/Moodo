import {
  Badge,
  Card,
  CardBody,
  HStack,
  Heading,
  IconButton,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { format } from "date-fns"
import { useState } from "react"
import { AiFillDelete } from "react-icons/ai"
import { deleteMood } from "../../FirestoreQueries"
import DeletePopUp from "../DeletePopUp/DeletePopUp"

const MoodDisplays = ({ moodData, setMoodData, chartData, setChartData }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteId, setDeleteId] = useState(null)

  const handleMoodDelete = async (moodId) => {
    try {
      await deleteMood(moodId)
      setMoodData(moodData.filter((mood) => mood.id !== moodId))
      setChartData(chartData.filter((each) => each[2] !== moodId))

      toast({
        title: `Entry Deleted!`,
        description: ` The mood entry has been deleted from your log.`,
        status: "warning",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    } catch (err) {
      console.error(err)
    }

    onClose()
  }
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={6}
      align="stretch"
    >
      <DeletePopUp
        deleteId={deleteId}
        isOpen={isOpen}
        onClose={onClose}
        handleDelete={handleMoodDelete}
      />
      {moodData &&
        moodData.map((each, index) => {
          return (
            <Card
              bg="themeColor.beige"
              variant="elevated"
              borderRadius={20}
              key={each.date}
              py=".4rem"
              data-testid={`mood-entry-${index}`}
            >
              <CardBody>
                <HStack
                  p={3}
                  my={5}
                  display={{ sm: "flex" }}
                  bgColor="themeColor.pastel"
                  borderRadius={7}
                  justifyContent="space-between"
                >
                  <Heading fontSize="lg">I feel {each.feel[0]}</Heading>
                  <Badge
                    bgColor="themeColor.darkPastel"
                    fontSize=".6rem"
                    p=".4rem"
                    borderRadius={10}
                  >
                    {format(
                      new Date(each.date.toDate()),
                      `do MMM 'at' hh:mm aa`
                    )}
                  </Badge>
                  <IconButton
                    aria-label="delete-button"
                    icon={<AiFillDelete />}
                    color="themeColor.red"
                    bgColor="transparent"
                    position="absolute"
                    right="0"
                    bottom="0"
                    mr="2.0rem"
                    mb=".3rem"
                    onClick={() => {
                      onOpen()
                      setDeleteId(each.id)
                    }}
                    _hover={{ bg: "transparent", color: "red.600" }}
                  ></IconButton>
                </HStack>

                <Text mx={3} w="95%">
                  {each.description}
                </Text>
              </CardBody>
            </Card>
          )
        })}
    </VStack>
  )
}

export default MoodDisplays
