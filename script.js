// Using DOM to Select Elements.
const taskInputField = document.getElementById('taskInput');
const taskCategoryDropdown = document.getElementById('taskCategory');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const totalTasks = document.getElementById('totalTasks');
const pendingTasks = document.getElementById('pendingTasks');
const completedTasks = document.getElementById('completedTasks');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Variables
const savedTasks = localStorage.getItem('tasks');
let tasks =  savedTasks ? JSON.parse(savedTasks) : [];

// Using Form event listener.
taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); // preventing reload after submission.

    // getting value from user.
    const taskText = taskInputField.value.trim();
    const taskCategory = taskCategoryDropdown.value;

    // check for empty input Field
    if (taskText === '') {
        alert('Please enter a task.'); // jusr using normal alert can use some element to do this thing better.
        return;
    }
    const id = crypto.randomUUID();

    // creating object and storeing data.
    const task = {
        id: id,
        task: taskText,
        category: taskCategory,
        completed: false
    };

    tasks.push(task);
    taskToStorage(tasks);

    taskInputField.value = '';
    taskInputField.focus();

    // displaying data
    renderTasks();
})

searchInput.addEventListener('input', renderTasks);
categoryFilter.addEventListener('change', renderTasks);

// function for displaying data
function renderTasks() {
    // filtering before display.
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.task.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === 'all' ||
            task.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // import to avoid duplicate tasks.
    taskList.innerHTML = '';

    // checks for empty task array or no task in search.
    if (filteredTasks.length === 0) {
        emptyMessage.style.display = 'block';

        if (tasks.length === 0) {
            emptyMessage.textContent = 'No tasks available. Please add a task.';
        } else {
            emptyMessage.textContent = 'No tasks match your search or filter criteria.';
        }

        // for count of tasks
        totalTasks.textContent = tasks.length;
        pendingTasks.textContent = tasks.filter(task => !task.completed).length;
        completedTasks.textContent = tasks.filter(task => task.completed).length;
        return;
    } else {
        emptyMessage.style.display = 'none';
    }

    // looping through array, creating element and displaying each task.
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.task;
        taskElement.appendChild(taskTitle);

        const taskCategory = document.createElement('p');
        taskCategory.textContent = `Category: ${task.category}`;
        taskElement.appendChild(taskCategory);

        const taskStatus = document.createElement('p');
        taskStatus.textContent = task.completed ? 'Completed' : 'Pending';
        taskStatus.style.color = task.completed ? 'green' : 'red';
        taskElement.appendChild(taskStatus);

        const taskCompleteButton = document.createElement('button');
        taskCompleteButton.className = "complete-button";
        taskCompleteButton.textContent = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        taskCompleteButton.addEventListener('click', () => {
            task.completed = !task.completed;
            taskToStorage(tasks);
            renderTasks();
        });
        taskElement.appendChild(taskCompleteButton);

        const taskDeleteButton = document.createElement('button');
        taskDeleteButton.className = "delete-button";
        taskDeleteButton.textContent = 'Delete';
        taskDeleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            taskToStorage(tasks);
            renderTasks();
        });
        taskElement.appendChild(taskDeleteButton);

        taskList.appendChild(taskElement);

    });

    totalTasks.textContent = tasks.length;
    pendingTasks.textContent = tasks.filter(task => !task.completed).length;
    completedTasks.textContent = tasks.filter(task => task.completed).length;


};

function taskToStorage(tasksArray) {
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

renderTasks();