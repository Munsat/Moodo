import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DeletePopUp from "./DeletePopUp"
import { vi } from "vitest"

it("should render the delete alert box", async () => {
  const handleDelete = vi.fn()
  const onClose = vi.fn()
  render(
    <DeletePopUp
      handleDelete={handleDelete}
      isOpen={true}
      onClose={onClose}
      deleteId={"mock-id"}
    />
  )

  const popUp = screen.getByText("Delete Entry")
  expect(popUp).toBeInTheDocument()
  const cancelBtn = screen.getByRole("button", { name: "Cancel" })
  await userEvent.click(cancelBtn)
  expect(onClose).toHaveBeenCalled()
})
