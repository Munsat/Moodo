import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import AllEntries from "./AllEntries"

beforeEach(() => {
  vi.resetAllMocks()
})
const setGroupedData = vi.fn()

const mockMoodEntries = {
  "mock-date-1": [
    {
      id: "mock-id-1",
      created_on: Date.now("2/2/2023"),
      updated_on: Date.now("2/2/2023"),
      text: "mock-text-1",
      userId: "mock-user-id-1",
    },
  ],
  "mock-date-2": [
    {
      id: "mock-id-1",
      created_on: Date.now("2/2/2023"),
      updated_on: Date.now("2/2/2023"),
      text: "mock-text-2",
      userId: "mock-user-id-1",
    },
  ],
}
it("should render an input field on mount", () => {
  render(
    <AllEntries groupedData={mockMoodEntries} setGroupedData={setGroupedData} />
  )
  expect(screen.getByText("mock-text-1")).toBeInTheDocument()
  expect(screen.getByText("mock-text-2")).toBeInTheDocument()
  expect(screen.queryByText("Feb")).toBeInTheDocument()
})
