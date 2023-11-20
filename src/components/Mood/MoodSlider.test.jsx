import { render, screen } from "@testing-library/react"
import MoodSlider from "./MoodSlider"
import { AuthProvider } from "../../contexts/AuthProvider"
import { BrowserRouter } from "react-router-dom"
import userEvent from "@testing-library/user-event"

it("should render a slider to get mood input", () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <MoodSlider />
      </AuthProvider>
    </BrowserRouter>
  )

  const slider = screen.getByLabelText("mood-slider")
  expect(slider).toBeInTheDocument()
})

it("should update slider value on interaction", async () => {
  const user = userEvent.setup()
  render(
    <BrowserRouter>
      <AuthProvider>
        <MoodSlider />
      </AuthProvider>
    </BrowserRouter>
  )
  const slider = screen.getByLabelText("mood-slider")
  await user.click(slider)
  await user.keyboard("{arrowright}")
  expect(slider).toHaveAttribute("aria-valuenow", "25")
  expect(screen.getByLabelText("current-mood")).toHaveTextContent(["I am sad"])
})

it("should show a modal on clicking the confirm button only if the mood slider is used", async () => {
  const user = userEvent.setup()
  render(
    <BrowserRouter>
      <AuthProvider>
        <MoodSlider />
      </AuthProvider>
    </BrowserRouter>
  )
  const slider = screen.getByLabelText("mood-slider")
  const confirmBtn = screen.getByTestId("mood-submit")

  await user.click(slider)
  await user.keyboard("{arrowright}")
  await user.click(confirmBtn)

  const modalHeader = await screen.findByText("What's on your mind?")
  expect(modalHeader).toBeInTheDocument()
})
