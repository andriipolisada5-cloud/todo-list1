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
        if (!totalCount || !completedCount || !remainingCount) return;
        let total = todos.length;
        let completed = todos.filter(todo => todo.completed).length;
        let remaining = total - completed;

        totalCount.innerText = total;
        completedCount.innerText = completed;
        remainingCount.innerText = remaining;
    }

    function render() {
        if (!taskList) return;
        taskList.innerHTML = '';
        let searchText = searchInput ? searchInput.value.toLowerCase() : '';

        todos.forEach(function (todo, index) {
            let taskText = todo.text.toLowerCase();
            if (searchText && !taskText.includes(searchText)) return;
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
        if (!taskInput) return;
        
        let text = taskInput.value.trim();
        
        if (text === "") {
            alert("Please enter a task name!");
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
        if (!drawer) return;
        currentEditingIndex = index;
        let task = todos[index];
        
        if (editTaskTitle) editTaskTitle.value = task.text;
        if (editTaskDesc) editTaskDesc.value = task.description || "";
        
        drawer.classList.add('open');
    }

    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('open');
        currentEditingIndex = null;
    }

    if (saveDrawerBtn) {
        saveDrawerBtn.addEventListener('click', function () {
            if (currentEditingIndex !== null && editTaskTitle) {
                let newTitle = editTaskTitle.value.trim();
                if (newTitle !== "") {
                    todos[currentEditingIndex].text = newTitle;
                    todos[currentEditingIndex].description = editTaskDesc ? editTaskDesc.value : "";
                    saveToLocalStorage();
                    render();
                    closeDrawer();
                }
            }
        });
    }

    if (deleteDrawerBtn) {
        deleteDrawerBtn.addEventListener('click', function () {
            if (currentEditingIndex !== null) {
                todos.splice(currentEditingIndex, 1);
                saveToLocalStorage();
                render();
                closeDrawer();
            }
        });
    }

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (cancelDrawerBtn) cancelDrawerBtn.addEventListener('click', closeDrawer);

    if (addButton) {
        addButton.addEventListener('click', addNewTask);
    }

    if (taskInput) {
        taskInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                addNewTask();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', render);
    }

    function setActiveFilter(filterName, activeBtn) {
        currentFilter = filterName;
        [filterAll, filterActive, filterCompleted].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
        render();
    }

    if (filterAll) filterAll.addEventListener('click', () => setActiveFilter('all', filterAll));
    if (filterActive) filterActive.addEventListener('click', () => setActiveFilter('active', filterActive));
    if (filterCompleted) filterCompleted.addEventListener('click', () => setActiveFilter('completed', filterCompleted));

    render();
});
