const authTitle = document.getElementById('auth-title');
const authBtn = document.getElementById('auth-btn');
const toggleAuthBtn = document.getElementById('toggle-auth');
const authDiv = document.getElementById('auth');
const todoDiv = document.getElementById('todo');
const taskTitleInput = document.getElementById('task-title');
const taskBodyInput = document.getElementById('task-body');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');
const nom = document.getElementsByClassName("nom");

let currentUser = localStorage.getItem('currentUser');

// Check if user is already logged in
if (currentUser) {
    authDiv.style.display = 'none';
    todoDiv.style.display = 'block';
    loadTasks();
}

// Toggle between signup and login
toggleAuthBtn.addEventListener('click', () => {
    if (authTitle.textContent === 'Inscription') {
        authTitle.textContent = 'Connexion';
        authBtn.textContent = 'Se connecter';
    } else {
        authTitle.textContent = 'Inscription';
        authBtn.textContent = 'S\'inscrire';
    }
});

// Handle user authentication
authBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (authTitle.textContent === 'Inscription') {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            alert('Cet utilisateur existe déjà.');
        } else {
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Inscription réussie !');
        }
    } else {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username] === password) {
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            alert('Connexion réussie !');
            authDiv.style.display = 'none';
            todoDiv.style.display = 'block';
            loadTasks();
        } else {
            alert('Nom d\'utilisateur ou mot de passe incorrect.');
        }
    }
});

// Add task
document.getElementById('add-task').addEventListener('click', () => {
    const title = taskTitleInput.value;
    const body = taskBodyInput.value;

    if (title && body) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        tasks[currentUser] = tasks[currentUser] || [];
        tasks[currentUser].push({ title, body });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskTitleInput.value = '';
        taskBodyInput.value = '';
        loadTasks();
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});

// Load tasks
function loadTasks() {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = tasks[currentUser] || [];

    userTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.body}</p>
            <button class="edit-btn" onclick="editTask(${index})">Modifier</button>
            <button class="delete-btn" onclick="deleteTask(${index})">Supprimer</button>
        `;
        taskList.appendChild(li);
    });
}

// Edit task
window.editTask = function(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = tasks[currentUser] || [];
    const task = userTasks[index];
    taskTitleInput.value = task.title;
    taskBodyInput.value = task.body;

    deleteTask(index);
};

// Delete task
window.deleteTask = function(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const userTasks = tasks[currentUser] || [];
    userTasks.splice(index, 1);
    tasks[currentUser] = userTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
};

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    currentUser = null;
    authDiv.style.display = 'block';
    todoDiv.style.display = 'none';
    taskList.innerHTML = '';
    var a = prompt("Tu veux vraiment te deconnecter ?");
    alert(a);
});

// Show logout button
if (currentUser) {
    logoutBtn.style.display = 'block';
}
