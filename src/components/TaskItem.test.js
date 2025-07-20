// src/components/TaskItem.test.js
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import TaskItem from "./TaskItem.vue";

// Test suite for the TaskItem component
describe("TaskItem.vue", () => {
  // A helper function to create a default set of props for our component
  const createProps = (overrides) => ({
    task: {
      _id: "task1",
      title: "Default Task Title",
      description: "Default description.",
      status: "pending", // Correctly uses status
      ...overrides,
    },
  });

  // Test Case 1: Does it render correctly?
  it("should render the task title and description from props", () => {
    // Arrange
    const props = createProps({
      title: "Learn Frontend Testing",
      description: "Write a test for the TaskItem component.",
    });
    // Act
    const wrapper = mount(TaskItem, {
      props,
      global: {
        plugins: [createPinia()],
      },
    });

    // Assert
    expect(wrapper.find('[data-testid="task-title"]').text()).toBe(
      "Learn Frontend Testing"
    );
    expect(wrapper.find('[data-testid="task-description"]').text()).toBe(
      "Write a test for the TaskItem component."
    );
  });

  // Test Case 2: Does it handle conditional rendering?
  it("should apply a line-through class to the title when the task is completed", () => {
    // Arrange
    const props = createProps({ status: "completed" }); // Set status to completed

    // Act
    const wrapper = mount(TaskItem, {
      props,
      global: {
        plugins: [createPinia()],
      },
    });

    // Assert: Find the title element specifically and check its classes.
    expect(wrapper.find('[data-testid="task-title"]').classes()).toContain(
      "line-through"
    );
  });

  // Test Case 3: Does it emit events correctly?
  it('should emit a "delete-task" event with the task ID when the delete button is clicked', async () => {
    // Arrange
    const props = createProps({ _id: "task-to-delete" });
    const wrapper = mount(TaskItem, {
      props,
      global: {
        plugins: [createPinia()],
      },
    });

    // Act
    await wrapper.find('[data-testid="delete-button"]').trigger("click");

    // Assert
    expect(wrapper.emitted()).toHaveProperty("delete-task");
    expect(wrapper.emitted("delete-task")).toHaveLength(1);
    expect(wrapper.emitted("delete-task")[0]).toEqual(["task-to-delete"]);
  });
});
