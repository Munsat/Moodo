import "@testing-library/jest-dom"

import createFetchMock from "vitest-fetch-mock"
import { vi } from "vitest"
import ResizeObserver from "resize-observer-polyfill"

const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

global.ResizeObserver = ResizeObserver
