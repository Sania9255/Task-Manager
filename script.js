const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const statsText = document.getElementById('statsText');
const themeToggle = document.getElementById('themeToggle');
const popSound = document.getElementById('popSound');

// State Management
let tasks = JSON.parse(localStorage.getItem('interactive_tasks')) || [];

// Initial Load
function init() {
    render();
    applyTheme();
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = { id: Date.now(), text, completed: false };
    tasks.push(newTask);
    
    // Play sound
    popSound.currentTime = 0;
    popSound.play();

    taskInput.value = '';
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressBar.style.width = `${percent}%`;
    statsText.innerText = `${percent}% Completed`;
}

function saveAndRender() {
    localStorage.setItem('interactive_tasks', JSON.stringify(tasks));
    render();
}

function render() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="${task.completed ? 'checked' : ''}">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
        `;
        taskList.appendChild(li);
    });
    updateProgress();
}

// Theme Toggle logic
function toggleTheme() {
    // Uses .dataset instead of getAttribute
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Uses .dataset instead of setAttribute
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    themeToggle.innerText = newTheme === 'dark' ? '☀️' : '✨';
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    // Fix: Using .dataset.theme handles 'data-theme' automatically
    document.documentElement.dataset.theme = savedTheme; 
    themeToggle.innerText = savedTheme === 'dark' ? '☀️' : '✨';
}

addBtn.onclick = addTask;
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});
document.getElementById('clearAll').onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
};

init();