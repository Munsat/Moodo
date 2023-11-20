import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import AddEntry from "./AddEntry"
import { addJournalEntry } from "../../FirestoreQueries"

beforeEach(() => {
  vi.resetAllMocks()
})
const setGroupedData = vi.fn()

const mockMoodEntries = {
  "mock-date": [
    {
      id: "mock-id-1",
      created_on: Date.now("2/2/2023"),
      updated_on: Date.now("2/2/2023"),
      text: "mock-text-1",
      userId: "mock-user-id-1",
    },
  ],
}
it("should render an input field on mount", () => {
  render(
    <AddEntry groupedData={mockMoodEntries} setGroupedData={setGroupedData} />
  )
  expect(
    screen.getByPlaceholderText("What's on your mind?")
  ).toBeInTheDocument()
})

it("should display the userinput", async () => {
  const user = userEvent.setup()
  screen.debug()
  render(
    <AddEntry groupedData={mockMoodEntries} setGroupedData={setGroupedData} />
  )
  const textArea = screen.getByPlaceholderText("What's on your mind?")
  await user.click(textArea)
  await user.keyboard("feeling down...")

  expect(textArea.value).toEqual("feeling down...")
})

it("should call onSubmit only when textarea has input ", async () => {
  const user = userEvent.setup()
  vi.mock("../../FirestoreQueries", () => ({
    addJournalEntry: vi.fn(),
  }))

  vi.mock("../../contexts/AuthProvider", () => ({
    useAuth: () => ({ user: { uid: 42 } }),
  }))
  const setGroupedData = vi.fn()

  const entryRes = { id: "mock-entry-id" }
  addJournalEntry.mockResolvedValueOnce(entryRes)
  screen.debug()
  render(
    <AddEntry groupedData={mockMoodEntries} setGroupedData={setGroupedData} />
  )
  const textArea = screen.getByPlaceholderText("What's on your mind?")
  await user.click(textArea)
  await user.keyboard("feeling down...")
  await user.click(screen.getByRole("button", { name: "Submit" }))

  expect(setGroupedData).toHaveBeenCalled(1)
  expect(screen.queryByLabelText("error-message")).not.toBeInTheDocument()
})

it("should show an error if field is empty when onSubmit is called", async () => {
  const user = userEvent.setup()
  vi.mock("../../FirestoreQueries", () => ({
    addJournalEntry: vi.fn(),
  }))

  vi.mock("../../contexts/AuthProvider", () => ({
    useAuth: () => ({ user: { uid: 42 } }),
  }))
  const setGroupedData = vi.fn()

  const entryRes = { id: "mock-entry-id" }
  addJournalEntry.mockResolvedValueOnce(entryRes)
  screen.debug()
  render(
    <AddEntry groupedData={mockMoodEntries} setGroupedData={setGroupedData} />
  )
  const textArea = screen.getByPlaceholderText("What's on your mind?")
  await user.click(textArea)
  await user.click(screen.getByRole("button", { name: "Submit" }))
  expect(screen.getByLabelText("error-message")).toBeInTheDocument()
  expect(setGroupedData).not.toBeCalled()
})
