const buttons = document.querySelectorAll(".btn-1");
const swich_mode = document.getElementById("swich_mode");
const img_change = document.getElementById("img_change");
const todo_value = document.getElementById("todo_value");
const add_todo = document.getElementById("add_todo");
const todo_container = document.getElementById("todo_container");

buttons.forEach((button) => {
    button.addEventListener("click", function() {
        // Reset the color of all buttons
        buttons.forEach(btn => {
            btn.classList.remove("blue");
            btn.classList.add("text-LightGray");
        });

        // Set the color of the clicked button
        button.classList.add("blue");
        button.classList.remove("text-LightGray");
    });
});

swich_mode.addEventListener("click", function() {
    const dark_mode_elements = document.querySelectorAll(".dark-mode");
    const body = document.querySelector("body");
    const cover = document.querySelector(".cover-img");
    body.style.backgroundColor = body.style.backgroundColor === "white" ? "hsl(235, 21%, 11%)" : "white";
    cover.style.backgroundColor = cover.style.backgroundColor === "white" ? "hsl(235, 21%, 11%)" : "white";
    console.log(dark_mode_elements);
    console.log("Current image source:", img_change.src);
    img_change.src = img_change.src.includes("icon-moon.svg") ? "images/icon-sun.svg" : "images/icon-moon.svg";
    console.log("Updated image source:", img_change.src);
    dark_mode_elements.forEach(element => {
        element.classList.toggle("light-mode");
    });
});

const todo_list = [];

add_todo.addEventListener("click", function() {
    const todo = todo_value.value.trim();
    if (todo === "") return; // Prevent adding empty todos
    todo_value.value = "";
    todo_list.push(todo);
    localStorage.setItem("todo_list", JSON.stringify(todo_list));
    console.log("Current todo list:", todo_list);

    renderTodoList();
});

// Add event listener to the input field to trigger the add button on Enter key press
todo_value.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        add_todo.click();
    }
});

function renderTodoList() {
    // Clear the container
    todo_container.innerHTML = `
        <div class="w-100 p-3 position-1">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex gap-3 align-items-center w-100 justify-content-between dark-mode">
                    <p class="text_LightGray">there is ${todo_list.length} items</p>
                    <div class="d-flex gap-3 align-items-center dark-mode">
                        <button class="btn-costum btn-1">All</button>
                        <button class="btn-costum btn-1">Active</button>
                        <button class="btn-costum btn-1">Completed</button>
                    </div>
                    <button class="btn-costum btn-1">Clear Completed</button>
                </div>
            </div>
        </div>`;

    // Append each todo item
    todo_list.forEach((todo, index) => {
        todo_container.innerHTML += `
            <div class="d-flex gap-3 underline align-items-center" id="todo_item_${index}">
                <div>
                    <input type="checkbox" class="cbx2" id="cbx_${index}" style="display: none;">
                    <label for="cbx_${index}" class="check">
                        <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                        </svg>
                    </label>
                </div>
                <h5 class="dark-mode rounded rounded-2 w-100 py-3 p-0 m-0 white-text" id="todo_${index}">${todo}</h5>
                <a href="#" class="delete-todo" data-index="${index}"><i class="fa-solid fa-trash text-danger fs-4"></i></a>
            </div>`;
    });

    // Add event listeners to the checkboxes
    document.querySelectorAll(".cbx2").forEach((checkbox, index) => {
        checkbox.addEventListener("change", function() {
            const todoText = document.getElementById(`todo_${index}`);
            if (checkbox.checked) {
                todoText.classList.add("line-through");
                todoText.classList.add("text-darkgray");
            } else {
                todoText.classList.remove("line-through");
                todoText.classList.add("white-text");
            }
        });
    });

    // Add event listeners to the delete icons
    document.querySelectorAll(".delete-todo").forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", function(event) {
            event.preventDefault();
            const index = deleteIcon.getAttribute("data-index");
            todo_list.splice(index, 1);
            localStorage.setItem("todo_list", JSON.stringify(todo_list));
            renderTodoList();
        });
    });

    // Re-apply event listeners to the buttons
    const buttons = document.querySelectorAll(".btn-costum.btn-1");
    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            // Reset the color of all buttons
            buttons.forEach(btn => {
                btn.classList.remove("blue");
                btn.classList.add("text-LightGray");
            });

            // Set the color of the clicked button
            button.classList.add("blue");
            button.classList.remove("text-LightGray");
        });
    });

    // Function to update the todo count
    updateTodoCount();
}

function updateTodoCount() {
    document.querySelector(".text-LightGray").textContent = `there is ${todo_list.length} items`;
}

// Initial render
renderTodoList();