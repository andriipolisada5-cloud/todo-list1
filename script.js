const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');

const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const remainingCount = document.getElementById('remaining-count');

const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

let todos = JSON.parse(localStorage.getItem('myTodos')) || []; 
let currentFilter = 'all';

function updateStatistics() {
    let total = todos.length;
    
    let completed = todos.filter(function(todo) {
        return todo.completed === true;
    }).length;
    
    let remaining = total - completed;
    
    totalCount.innerText = total;
    completedCount.innerText = completed;
    remainingCount.innerText = remaining;
}

function render() {
    taskList.innerHTML = '';
    
    let searchText = searchInput.value.toLowerCase();
    
    todos.forEach(function(todo, index) {
        let taskText = todo.text.toLowerCase();
        if (!taskText.includes(searchText)) {
            return; 
        }
        
        if (currentFilter === 'active' && todo.completed) {
            return;
        }
        if (currentFilter === 'completed' && !todo.completed) {
            return;
        }
        
        let li = document.createElement('li');
        li.innerText = todo.text;
        
        if (todo.completed) {
            li.style.textDecoration = 'line-through';
            li.style.opacity = '0.5';
        }
        
        let deleteBtn = document.createElement('button');
        deleteBtn.innerText = '❌';
        deleteBtn.style.marginLeft = '10px';
        
        deleteBtn.addEventListener('click', function() {
            todos.splice(index, 1);
            localStorage.setItem('myTodos', JSON.stringify(todos));
            render(); 
        });
        
        li.addEventListener('click', function(event) {
            if (event.target !== deleteBtn) {
                todo.completed = !todo.completed;
                localStorage.setItem('myTodos', JSON.stringify(todos));
                render(); 
            }
        });
        
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateStatistics();
}

function addNewTask() {
    let text = taskInput.value.trim();
    
    if (text === "") {
        alert("Эй! Нельзя добавить пустую задачу!");
        return; 
    }
    
    let newTodo = { 
        text: text, 
        completed: false 
    };
    
    todos.push(newTodo);
    localStorage.setItem('myTodos', JSON.stringify(todos));
    taskInput.value = '';
    render();             
    taskInput.focus();    
}

addButton.addEventListener('click', function() {
    addNewTask();
});

taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

searchInput.addEventListener('input', function() {
    render(); 
});

filterAll.addEventListener('click', function() {
    currentFilter = 'all';
    render();
});

filterActive.addEventListener('click', function() {
    currentFilter = 'active';
    render();
});

filterCompleted.addEventListener('click', function() {
    currentFilter = 'completed';
    render();
});

render();