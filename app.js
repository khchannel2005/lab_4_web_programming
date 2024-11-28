const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false,
        };
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";

        const newTodo = todoListUL.lastChild;
        newTodo.classList.add("added");
    }
}

function updateTodoList() {
    todoListUL.innerHTML = "";
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}

function createTodoItem(todo, todoIndex) {
    const todoId = `todo-${todoIndex}`;
    const todoLI = document.createElement("li");
    todoLI.className = "todo";

    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">${todo.text}</label>
        <button class="edit-button">
            ✏️
        </button>
        <button class="delete-button">
            🗑️
        </button>
    `;

    const editButton = todoLI.querySelector(".edit-button");
    editButton.addEventListener("click", () => editTodoItem(todoIndex));

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => deleteTodoItem(todoIndex));

    const checkbox = todoLI.querySelector("input");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    });

    return todoLI;
}

function editTodoItem(todoIndex) {
    const todoElement = todoListUL.children[todoIndex];
    const todoTextLabel = todoElement.querySelector(".todo-text");

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = allTodos[todoIndex].text;
    inputField.className = "edit-input";
    todoTextLabel.replaceWith(inputField);

    inputField.addEventListener("blur", () => {
        const newText = inputField.value.trim();
        if (newText) {
            allTodos[todoIndex].text = newText;
            saveTodos();
            updateTodoList();
        } else {
            updateTodoList();
        }
    });

    inputField.focus();
}

function deleteTodoItem(todoIndex) {
    const todoElement = todoListUL.children[todoIndex];
    todoElement.classList.add("removed");
    setTimeout(() => {
        allTodos = allTodos.filter((_, i) => i !== todoIndex);
        saveTodos();
        updateTodoList();
    }, 300);
}

function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}
