import { render, screen, within } from "@testing-library/react"
import MoodDisplays from "./MoodDisplays"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { deleteMood } from "../../FirestoreQueries"

beforeEach(() => {
  // vi.clearAllMocks();
  vi.resetAllMocks()
})

const mockMoodEntries = [
  {
    id: "mock-id-1",
    date: {
      toDate: () => new Date(),
    },

    description: "mock-description-1",
    feel: ["mock-sad", 50],
    userId: "mock-user-id-1",
  },
  {
    id: "mock-id-2",
    date: {
      toDate: () => new Date(),
    },

    description: "mock-description-2",
    feel: ["mock-happy", 50],
    userId: "mock-user-id-1",
  },
]

it("should render a list of mood entries on mount", () => {
  render(<MoodDisplays moodData={mockMoodEntries} />)
  const moodEntry = screen.getByText("I feel mock-sad")
  expect(moodEntry).toBeInTheDocument()
})

it("should open open an alert when the bin icon is clicked", async () => {
  const user = userEvent.setup()

  render(<MoodDisplays moodData={mockMoodEntries} />)
  const container = screen.getByTestId("mood-entry-0")
  const binIcon1 = within(container).getByLabelText("delete-button")
  await user.click(binIcon1)

  expect(screen.findByRole("button", { name: /Delete/ }))
})

it("should delete an entry when the delete btn is clicked", async () => {
  vi.mock("../../FirestoreQueries", () => ({
    deleteMood: vi.fn(),
  }))

  vi.mock("../../contexts/AuthProvider", () => ({
    useAuth: () => ({ user: { uid: "mock-user-id-1" } }),
  }))

  const setMoodData = vi.fn()
  const setChartData = vi.fn()

  const user = userEvent.setup()
  const mockMoodEntries = [
    {
      id: "mock-id-1",
      date: {
        toDate: () => new Date(),
      },

      description: "mock-description-1",
      feel: ["mock-sad", 50],
      userId: "mock-user-id-1",
    },
    {
      id: "mock-id-2",
      date: {
        toDate: () => new Date(),
      },

      description: "mock-description-2",
      feel: ["mock-happy", 50],
      userId: "mock-user-id-1",
    },
  ]

  render(
    <MoodDisplays
      moodData={mockMoodEntries}
      setMoodData={setMoodData}
      chartData={mockMoodEntries}
      setChartData={setChartData}
    />
  )
  const container1 = screen.getByTestId("mood-entry-0")
  const binIcon1 = within(container1).getByLabelText("delete-button")
  await user.click(binIcon1)
  const deleteBtn = await screen.findByRole("button", { name: "Delete" })

  await user.click(deleteBtn)
  expect(setMoodData).toHaveBeenCalled()
  expect(deleteMood).toHaveBeenCalled()
  expect(setMoodData).toHaveBeenCalledWith([
    {
      id: "mock-id-2",
      date: expect.any(Object),

      description: "mock-description-2",
      feel: ["mock-happy", 50],
      userId: "mock-user-id-1",
    },
  ])
  expect(setMoodData).toHaveBeenCalled(1)
  // await waitForElementToBeRemoved(() => container1)

  // expect(container1).not.toBeInTheDocument();
})
