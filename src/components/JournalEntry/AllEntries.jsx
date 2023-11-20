import { Card, CardBody, HStack, Heading, VStack } from "@chakra-ui/react"

import Entry from "./Entry"
import { format } from "date-fns"

const AllEntries = ({ groupedData, setGroupedData }) => {
  console.log(groupedData)
  return (
    <VStack w="100%" spacing={6} align="stretch" mt="3rem">
      {groupedData &&
        Object.entries(groupedData).map(([date, entries]) => (
          <Card
            bg="themeColor.beige"
            opacity=".85"
            variant="elevated"
            borderRadius="3rem"
            key={date}
          >
            <CardBody w="100%">
              <HStack
                display={{ lg: "flex" }}
                px={{ sm: 3 }}
                py={8}
                m={{ sm: 3 }}
                borderRadius={7}
                maxW="100%"
              >
                <Heading size="lg">{format(new Date(date), "dd")} </Heading>
                <Heading size="lg">{format(new Date(date), "MMM")}</Heading>
                <VStack
                  alignItems="start"
                  spacing={4}
                  borderLeftColor="themeColor.brown"
                  borderLeftWidth="1px"
                  pl="2rem"
                  w="100%"
                >
                  {entries.map((each) => (
                    <Entry
                      each={each}
                      setGroupedData={setGroupedData}
                      groupedData={groupedData}
                      key={each.id}
                    />
                  ))}
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
    </VStack>
  )
}

export default AllEntries
