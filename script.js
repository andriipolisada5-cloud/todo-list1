document.addEventListener('DOMContentLoaded', function () {
    
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
    const drawer = document.getElementById('task-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const cancelDrawerBtn = document.getElementById('cancel-drawer-btn');
    const saveDrawerBtn = document.getElementById('save-drawer-btn');
    const deleteDrawerBtn = document.getElementById('delete-drawer-btn');
    const editTaskTitle = document.getElementById('edit-task-title');
    const editTaskDesc = document.getElementById('edit-task-desc');

    let todos = JSON.parse(localStorage.getItem('myTodos')) || [];
    let currentFilter = 'all';
    let currentEditingIndex = null; 

    function saveToLocalStorage() {
        localStorage.setItem('myTodos', JSON.stringify(todos));
    }

    function updateStatistics() {
        let total = todos.length;
        let completed = todos.filter(todo => todo.completed).length;
        let remaining = total - completed;

        totalCount.innerText = total;
        completedCount.innerText = completed;
        remainingCount.innerText = remaining;
    }

    function render() {
        taskList.innerHTML = '';
        let searchText = searchInput.value.toLowerCase();

        todos.forEach(function (todo, index) {
            let taskText = todo.text.toLowerCase();
            if (!taskText.includes(searchText)) return;
            if (currentFilter === 'active' && todo.completed) return;
            if (currentFilter === 'completed' && !todo.completed) return;

            let li = document.createElement('li');
            
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.style.marginRight = '12px';
            checkbox.style.cursor = 'pointer';

            let textSpan = document.createElement('span');
            textSpan.innerText = todo.text;
            textSpan.style.flex = '1';

            if (todo.completed) {
                textSpan.style.textDecoration = 'line-through';
                textSpan.style.color = '#94A3B8';
            }

            checkbox.addEventListener('change', function (e) {
                e.stopPropagation(); 
                todo.completed = checkbox.checked;
                saveToLocalStorage();
                render();
            });

            li.addEventListener('click', function () {
                openDrawer(index);
            });

            li.appendChild(checkbox);
            li.appendChild(textSpan);
            taskList.appendChild(li);
        });

        updateStatistics();
    }

    function addNewTask() {
        let text = taskInput.value.trim();
        if (text === "") {
            alert("Hey! You can't add an empty task!");
            return;
        }

        todos.push({
            text: text,
            completed: false,
            description: ""
        });

        saveToLocalStorage();
        taskInput.value = '';
        render();
        taskInput.focus();
    }
    function openDrawer(index) {
        currentEditingIndex = index;
        let task = todos[index];
        
        editTaskTitle.value = task.text;
        editTaskDesc.value = task.description || "";
        
        drawer.classList.add('open'); 
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        currentEditingIndex = null;
    }
    saveDrawerBtn.addEventListener('click', function () {
        if (currentEditingIndex !== null) {
            let newTitle = editTaskTitle.value.trim();
            if (newTitle !== "") {
                todos[currentEditingIndex].text = newTitle;
                todos[currentEditingIndex].description = editTaskDesc.value;
                saveToLocalStorage();
                render();
                closeDrawer();
            }
        }
    });

    deleteDrawerBtn.addEventListener('click', function () {
        if (currentEditingIndex !== null) {
            todos.splice(currentEditingIndex, 1);
            saveToLocalStorage();
            render();
            closeDrawer();
        }
    });

    closeDrawerBtn.addEventListener('click', closeDrawer);
    cancelDrawerBtn.addEventListener('click', closeDrawer);

    addButton.addEventListener('click', addNewTask);

    taskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') addNewTask();
    });

    searchInput.addEventListener('input', render);

    function setActiveFilter(filterName, activeBtn) {
        currentFilter = filterName;
        
        [filterAll, filterActive, filterCompleted].forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        
        render();
    }

    filterAll.addEventListener('click', () => setActiveFilter('all', filterAll));
    filterActive.addEventListener('click', () => setActiveFilter('active', filterActive));
    filterCompleted.addEventListener('click', () => setActiveFilter('completed', filterCompleted));

    render();
});
