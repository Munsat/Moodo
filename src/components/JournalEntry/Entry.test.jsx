import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { updateJournalEntry } from "../../FirestoreQueries"
import Entry from "./Entry"

beforeEach(() => {
  vi.resetAllMocks()
})
const setGroupedData = vi.fn()

const mockMoodEntries = {}

const mockEntry = {
  id: "mock-id-2",
  created_on: Date.now("2/2/2023"),
  updated_on: Date.now("2/2/2023"),
  text: "mock-text-current",
  userId: "mock-user-id-1",
}

it("should render individual entry", () => {
  render(
    <Entry
      each={mockEntry}
      groupedData={mockMoodEntries}
      setGroupedData={setGroupedData}
    />
  )
  expect(screen.getByText("mock-text-current")).toBeInTheDocument()
})

it("should render both edit and delete buttons", () => {
  render(
    <Entry
      each={mockEntry}
      groupedData={mockMoodEntries}
      setGroupedData={setGroupedData}
    />
  )
  expect(screen.getByLabelText("edit-button")).toBeInTheDocument()
  expect(screen.getByLabelText("delete-button")).toBeInTheDocument()
})

it("should render input field on clicking edit button", async () => {
  const user = userEvent.setup()
  render(
    <Entry
      each={mockEntry}
      groupedData={mockMoodEntries}
      setGroupedData={setGroupedData}
    />
  )
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  await user.click(screen.getByLabelText("edit-button"))
  expect(screen.getByRole("textbox")).toBeInTheDocument()
})

it("should have the same value as text before editing", async () => {
  const user = userEvent.setup()
  render(
    <Entry
      each={mockEntry}
      groupedData={mockMoodEntries}
      setGroupedData={setGroupedData}
    />
  )
  await user.click(screen.getByLabelText("edit-button"))
  expect(screen.getByRole("textbox").value).toBe("mock-text-current")
})

it("should render error message if enter is pressed when input field is empty", async () => {
  const user = userEvent.setup()
  render(
    <Entry
      each={mockEntry}
      groupedData={mockMoodEntries}
      setGroupedData={setGroupedData}
    />
  )
  expect(screen.queryByLabelText("error-message")).not.toBeInTheDocument()
  await user.click(screen.getByLabelText("edit-button"))
  await user.clear(screen.getByRole("textbox"))
  await user.keyboard("{Enter}")
  expect(screen.getByLabelText("error-message")).toBeInTheDocument()
})

it("should save the edited value", async () => {
  const user = userEvent.setup()
  vi.mock("../../FirestoreQueries", () => ({
    updateJournalEntry: vi.fn(),
  }))

  vi.mock("../../contexts/AuthProvider", () => ({
    useAuth: () => ({ user: { uid: "mock-user-id-1" } }),
  }))

  updateJournalEntry.mockResolvedValue({
    id: "mock-id-2",
    created_on: Date.now("2/2/2023"),
    updated_on: Date.now("2/2/2023"),
    text: "new-text",
    userId: "mock-user-id-1",
  })
  render(
    <Entry
      each={mockEntry}
      groupedData={mockMoodEntries}
      setGroupedData={setGroupedData}
    />
  )

  await user.click(screen.getByLabelText("edit-button"))
  await user.clear(screen.getByRole("textbox"))
  await user.keyboard("new text")
  expect(screen.getByRole("textbox").value).toEqual("new text")
  await user.keyboard("{Enter}")
  expect(updateJournalEntry).toHaveBeenCalledWith("mock-id-2", {
    text: "new text",
    updated_on: expect.any(Date),
  })
  expect(setGroupedData).toHaveBeenCalled(1)
})
