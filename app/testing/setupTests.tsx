import "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/stores/store", () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeEach(() => {
  // Reset any global state or mocks before each test
  jest.clearAllMocks();
});
