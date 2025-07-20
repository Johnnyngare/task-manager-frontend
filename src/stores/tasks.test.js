// src/stores/tasks.test.js
import { setActivePinia, createPinia } from "pinia";
import { useTasksStore } from "./tasks"; // Import your store definition
import axios from "axios"; // Import axios to mock it

// --- MOCK SETUP ---

// 1. Mock the entire axios module
jest.mock("axios");

// 2. Mock the router to prevent 'import.meta' errors from its dependencies
jest.mock("../router", () => ({}));

// 3. Mock the auth store dependency to isolate the tasks store
jest.mock("./auth", () => ({
  useAuthStore: () => ({
    isUserAuthenticated: true, // Assume user is always authenticated for these tests
  }),
}));

// 4. Mock the vue-toastification dependency
jest.mock("vue-toastification", () => ({
  useToast: () => ({
    error: jest.fn(), // Mock the error function
    success: jest.fn(), // Mock the success function
  }),
}));

// --- TEST SUITE ---

describe("Pinia Tasks Store", () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and clear all mocks before each test
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  // Test Case 1: The "Happy Path" for fetching tasks
  it("fetchTasks should populate the tasks state from a successful API call", async () => {
    // Arrange:
    const mockTasks = [
      { _id: "1", title: "Task 1" },
      { _id: "2", title: "Task 2" },
    ];
    axios.get.mockResolvedValue({ data: mockTasks });

    // Act:
    const store = useTasksStore();
    await store.fetchTasks(); // Call with no filters

    // Assert:
    expect(axios.get).toHaveBeenCalledTimes(1);

    // **FIX APPLIED HERE:** The test now correctly expects the second argument.
    expect(axios.get).toHaveBeenCalledWith("/api/tasks", { params: {} });

    expect(store.tasks).toEqual(mockTasks);
    expect(store.error).toBe(null);
  });

  // Test Case 2: Handling API errors
  it("fetchTasks should set the error state if the API call fails", async () => {
    // Arrange:
    const mockError = new Error("Network Error 500");
    axios.get.mockRejectedValue(mockError);

    // Act:
    const store = useTasksStore();
    await store.fetchTasks();

    // Assert:
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(store.tasks).toEqual([]); // Tasks array should remain empty
    expect(store.error).toBe("Network Error 500"); // Error state should be set
  });

  // Test Case 3: Testing an action that adds a task
  it("createTask should make a POST request and add the new task to the state", async () => {
    // Arrange:
    const newTaskData = { title: "A new task", description: "from a test" };
    const returnedTask = { _id: "3", ...newTaskData };
    axios.post.mockResolvedValue({ data: returnedTask });

    // Act:
    const store = useTasksStore();
    await store.createTask(newTaskData);

    // Assert:
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith("/api/tasks", newTaskData);
    expect(store.tasks[0]).toEqual(returnedTask);
    expect(store.error).toBe(null);
  });
});
