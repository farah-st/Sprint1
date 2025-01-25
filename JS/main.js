// main.js

// Wait until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput'); // Input for task name
  const dateInput = document.getElementById('dateInput'); // Input for task date
  const addTaskButton = document.getElementById('addTaskButton'); // Button to add tasks
  const taskList = document.getElementById('taskList'); // List to display tasks
  const completedTaskList = document.getElementById('completedTaskList'); // List for completed tasks

  // Set today's date as the minimum selectable date in the date picker
  const currentDate = new Date(); // Get the current date
  const year = currentDate.getFullYear(); // Extract the year
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Extract the month (add 1 since months are 0-indexed)
  const day = String(currentDate.getDate()).padStart(2, '0'); // Extract the day
  const formattedDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD

  dateInput.setAttribute('min', formattedDate); // Set the minimum date allowed in the input field

  /**
   * Format a date string in YYYY-MM-DD format to a more readable format
   * Example: "2024-01-22" -> "January 22, 2024"
   * @param {string} inputDate - The date string in YYYY-MM-DD format
   * @returns {string} - Formatted date string
   */
  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split('-'); // Parse the input string
    const date = new Date(year, month - 1, day); // Create a date object in local time
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date); // Format to "Month Day, Year"
  }

  /**
   * Add a new task to the task list with the selected date and description
   */
  addTaskButton.addEventListener('click', () => {
    const taskValue = taskInput.value.trim(); // Get the task description
    const dateValue = dateInput.value; // Get the selected date

    // Validate that both task and date fields are filled
    if (!taskValue || !dateValue) {
      alert('Please fill in all fields.');
      return;
    }

    // Ensure the selected date is not in the past
    const selectedDate = new Date(dateValue); // Create a date object for the selected date
    selectedDate.setHours(0, 0, 0, 0); // Normalize to the start of the day
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    if (selectedDate < today) {
      alert('Please select a valid date (not in the past).');
      return;
    }

    const formattedDateValue = formatDate(dateValue); // Format the selected date

    // Check if a task group for the selected date already exists
    let group = document.querySelector(`[data-date="${dateValue}"]`);
    if (!group) {
      // Create a new task group for the selected date if it doesn't exist
      group = document.createElement('li');
      group.setAttribute('data-date', dateValue);
      group.innerHTML = `
        <button class="toggle-task">-</button>
        <strong>Date:</strong> ${formattedDateValue}
        <ul class="task-group"></ul>
      `;
      taskList.appendChild(group); // Append the group to the task list

      // Add functionality to toggle visibility of tasks in the group
      const toggleButton = group.querySelector('.toggle-task');
      toggleButton.addEventListener('click', () => {
        const taskGroup = group.querySelector('.task-group');
        if (taskGroup.style.display === 'none') {
          taskGroup.style.display = 'block';
          toggleButton.textContent = '-';
        } else {
          taskGroup.style.display = 'none';
          toggleButton.textContent = '+';
        }
      });
    }

    // Add the new task to the corresponding task group
    const taskGroup = group.querySelector('.task-group');
    const newTask = document.createElement('li');
    newTask.innerHTML = `
      <label class="task-item">
        <input type="checkbox" class="complete-task">
        <span class="task-text">${taskValue}</span>
      </label>
      <button class="delete-task">X</button>
    `;

    taskGroup.appendChild(newTask); // Append the task to the group

    // Add functionality to mark the task as completed
    const completeTaskCheckbox = newTask.querySelector('.complete-task');
    completeTaskCheckbox.addEventListener('change', () => {
      const taskText = newTask.querySelector('.task-text');
      if (completeTaskCheckbox.checked) {
        taskText.style.textDecoration = 'line-through'; // Strike-through for completed task
        taskText.style.color = '#aaa'; // Change text color to indicate completion

        // Move the task to the completed tasks section
        moveTask(newTask, completedTaskList);
      } else {
        taskText.style.textDecoration = 'none'; // Remove strike-through
        taskText.style.color = '#333'; // Reset text color

        // Move the task back to the to-do tasks section
        moveTask(newTask, taskGroup);
      }
    });

    // Add functionality to delete the task
    const deleteButton = newTask.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
      newTask.remove(); // Remove the task from the DOM
      if (!taskGroup.hasChildNodes()) {
        group.remove(); // Remove the group if no tasks remain
      }
    });

    // Clear the input fields
    taskInput.value = '';
    dateInput.value = '';
  });

  /**
   * Move a task from one group to another
   * @param {HTMLElement} task - The task element to move
   * @param {HTMLElement} targetGroup - The target group to move the task to
   */
  function moveTask(task, targetGroup) {
    targetGroup.appendChild(task); // Move the task to the target group

    // Remove empty groups from the "To-Do" section
    const parentGroup = task.parentElement.parentElement;
    if (parentGroup.classList.contains('task-group') && !parentGroup.hasChildNodes()) {
      parentGroup.parentElement.remove(); // Remove the parent group if it's empty
    }
  }
});





























  