import {
  Button,
  Container,
  Text,
  VStack,
  ButtonGroup,
  Heading,
  Spinner,
} from "@chakra-ui/react"
import { Chart } from "react-google-charts"
import { useAuth } from "../../contexts/AuthProvider"
import { useEffect, useState } from "react"
import moodGraphStyles from "./MoodGraph.module.css"
import MoodDisplays from "./MoodDisplays"
import { Link as ReactLink } from "react-router-dom"
import { queryForMoodInfo } from "../../FirestoreQueries"

const MoodGraph = () => {
  const { user } = useAuth()
  const [chartData, setChartData] = useState([])
  const [moodData, setMoodData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const getQuery = async () => {
      const queryArr = []
      const moodsArr = []
      try {
        const queryRes = await queryForMoodInfo(user.uid)
        queryRes.forEach((snap) => {
          const data = snap.data()
          moodsArr.push({ id: snap.id, ...data })
          queryArr.push([
            new Date(data["date"].toDate()).toLocaleString().split(",")[0],
            data["feel"][1],
            snap.id,
          ])
        })
        setMoodData(moodsArr.sort((a, b) => b.date - a.date))
        setChartData(queryArr)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    setIsLoading(true)
    getQuery()
  }, [])

  const getColor = (value) => {
    if (value < 25) {
      return "color: #FF7878"
    } else if (value < 50) {
      return "color: #FFC93C"
    } else if (value < 75) {
      return "color: #F3F0D7"
    } else {
      return "#CEE5D0"
    }
  }

  const groupedData = chartData.reduce((acc, [date, value]) => {
    if (acc[date]) {
      acc[date].moods.push(value)
    } else {
      acc[date] = {
        moods: [value],
      }
    }
    return acc
  }, {})

  const avgData = Object.entries(groupedData).map(([date, { moods }]) => {
    const average = moods.reduce((acc, value) => acc + value, 0) / moods.length
    return [date, average, getColor(average)]
  })

  const options = {
    title: "Mood Graph",
    backgroundColor: {
      fill: "transparent",
    },
    vAxis: {
      title: "Moods",
      ticks: [
        { v: 0, f: "Awful" },
        { v: 25, f: "Bad" },
        { v: 50, f: "Ok" },
        { v: 75, f: "Good" },
        { v: 100, f: "Great" },
      ],
    },
    bar: {
      groupWidth: "10%",
    },
    dataOpacity: 0.8,
    legend: {
      position: "none",
    },
  }
  const data = chartData && [["Date", "Mood", { role: "style" }], ...avgData]
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
  if (chartData.length !== 0)
    return (
      <Container maxW={"980px"}>
        {avgData[0] && avgData.pop()[1] < 50 ? (
          <VStack bgColor="themeColor.beige" p={4} mt={5} borderRadius={15}>
            <Text>
              You seem sad... Would you like me to provide you some helpful
              facts to deal with depression?
            </Text>
            <ButtonGroup>
              <Button
                target="_blank"
                bgColor={"themeColor.pastel"}
                as={ReactLink}
                to={
                  "https://www.lifeline.org.au/media/0jsl1fs2/rev1_ll-4pp-fact-sheet_depression.pdf"
                }
              >
                Depression Fact Sheet
              </Button>
              <Button
                bgColor={"themeColor.red"}
                as={ReactLink}
                to={"tel:+61 131114"}
              >
                Crisis Hotline
              </Button>
            </ButtonGroup>
          </VStack>
        ) : (
          <></>
        )}
        <Chart
          className={moodGraphStyles.chart}
          chartType="ColumnChart"
          data={data}
          options={options}
          width={"100%"}
          height={"500px"}
          data-testid="chart-component"
        />
        {moodData && (
          <MoodDisplays
            moodData={moodData}
            setMoodData={setMoodData}
            chartData={chartData}
            setChartData={setChartData}
          />
        )}
      </Container>
    )
  return (
    <Heading textAlign="center">Sorry there is no information to show.</Heading>
  )
}

export default MoodGraph
