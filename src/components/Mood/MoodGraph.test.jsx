import { render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import MoodGraph from "./MoodGraph"
import { queryForMoodInfo } from "../../FirestoreQueries"
import { BrowserRouter } from "react-router-dom"
import { Chart } from "react-google-charts"

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
})

it("should render mood entries recieved from firestore", async () => {
  vi.mock("../../FirestoreQueries", () => ({
    queryForMoodInfo: vi.fn(),
  }))

  vi.mock("../../contexts/AuthProvider", () => ({
    useAuth: () => ({ user: { uid: 42 } }),
  }))

  const mockMoodEntries = [
    {
      data: () => ({
        id: "mock-id-1",
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-1",
        feel: ["mock-feel-1", 50],
        userId: "mock-user-id-1",
      }),
    },
    {
      data: () => ({
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-2",
        feel: ["mock-feel-2", 50],
        userId: "mock-user-id-2",
      }),
    },
  ]

  queryForMoodInfo.mockResolvedValue(mockMoodEntries)

  render(<MoodGraph />)
  await waitFor(() => {
    expect(screen.getByText(/mock-description-1/i)).toBeInTheDocument()
  })
})

it("should render the loading spinner when isLoading is true", () => {
  render(<MoodGraph />)
  expect(screen.getByText("...LOADING")).toBeInTheDocument()
})

it("should render the popup for depression factsheet when the average mood is below 50", async () => {
  const mockMoodEntries = [
    {
      data: () => ({
        id: "mock-id-1",
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-1",
        feel: ["mock-feel-1", 40],
        userId: "mock-user-id-1",
      }),
    },
    {
      data: () => ({
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-2",
        feel: ["mock-feel-2", 20],
        userId: "mock-user-id-2",
      }),
    },
    {
      data: () => ({
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-3",
        feel: ["mock-feel-3", 20],
        userId: "mock-user-id-3",
      }),
    },
  ]

  vi.mock("react-google-charts", () => ({
    Chart: vi.fn(),
  }))

  vi.mock("../../FirestoreQueries", () => ({
    queryForMoodInfo: vi.fn(),
  }))

  vi.mock("../../contexts/AuthProvider", () => ({
    useAuth: () => ({ user: { uid: 42 } }),
  }))

  queryForMoodInfo.mockResolvedValue(mockMoodEntries)
  render(
    <BrowserRouter>
      <MoodGraph />
    </BrowserRouter>
  )
  expect(await screen.findByText("Depression Fact Sheet")).toBeInTheDocument()
})

it("should call the graph component", async () => {
  const mockMoodEntries = [
    {
      data: () => ({
        id: "mock-id-1",
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-1",
        feel: ["mock-feel-1", 40],
        userId: "mock-user-id-1",
      }),
    },
    {
      data: () => ({
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-2",
        feel: ["mock-feel-2", 20],
        userId: "mock-user-id-2",
      }),
    },
    {
      data: () => ({
        date: {
          toDate: () => new Date(),
        },

        description: "mock-description-3",
        feel: ["mock-feel-3", 20],
        userId: "mock-user-id-3",
      }),
    },
  ]

  vi.mock("react-google-charts", () => ({
    Chart: vi.fn(),
  }))

  vi.mock("../../FirestoreQueries", () => ({
    queryForMoodInfo: vi.fn(),
  }))

  vi.mock("../../contexts/AuthProvider", () => ({
    useAuth: () => ({ user: { uid: 42 } }),
  }))

  queryForMoodInfo.mockResolvedValue(mockMoodEntries)
  render(
    <BrowserRouter>
      <MoodGraph />
    </BrowserRouter>
  )
  expect(await screen.findByText("Depression Fact Sheet")).toBeInTheDocument()
  expect(Chart).toHaveBeenCalled()
  expect.objectContaining({ chartType: "ColumnChart" })
  // expect(screen.getByTestId('chart-component'))
})
