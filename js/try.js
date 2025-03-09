const swich_mode = document.getElementById("swich_mode");
const img_change = document.getElementById("img_change");
const todo_value = document.getElementById("todo_value");
const add_todo = document.getElementById("add_todo");
const todo_container = document.getElementById("todo_container");

let filter = "all"; // Default filter
let isLightMode = false; // Track the current mode

swich_mode.addEventListener("click", function() {
    const body = document.querySelector("body");
    const cover = document.querySelector(".cover-img");
    const dark_mode_elements = document.querySelectorAll(".dark-mode");
    
    // Toggle background color
    const newBackgroundColor = body.style.backgroundColor === "white" ? "hsl(235, 21%, 11%)" : "white";
    body.style.backgroundColor = newBackgroundColor;

    // Toggle background image
    const newCoverImage = cover.style.backgroundImage.includes("bg-desktop-light.jpg") 
        ? "url('images/bg-desktop-dark.jpg')" 
        : "url('images/bg-desktop-light.jpg')";
        console.log(newCoverImage)
    cover.style.backgroundImage = newCoverImage;

    // Toggle icon image
    img_change.src = img_change.src.includes("icon-moon.svg") 
        ? "images/icon-sun.svg" 
        : "images/icon-moon.svg";

    // Toggle dark/light mode classes
    dark_mode_elements.forEach(element => {
        element.classList.toggle("light-mode");
    });

    isLightMode = !isLightMode; // Toggle mode
    renderTodoList();
});


let todo_list = [];
if (localStorage.getItem("todo_list") !== null) {
    todo_list = JSON.parse(localStorage.getItem("todo_list"));
}

add_todo.addEventListener("click", function() {
    console.log(isLightMode);
    const todo = todo_value.value.trim();
    if (todo === "") return; // Prevent adding empty todos
    todo_value.value = "";
    todo_list.push({ text: todo, completed: false, mode: isLightMode ? "light-mode" : "dark-mode" });
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
    // todo_container.innerHTML = `
    //     <div class="w-100 p-3 position-1 ${isLightMode ? "light-mode" : "dark-mode"}">
    //         <div class="d-flex justify-content-between align-items-center">
    //             <div class="d-flex gap-3 align-items-center w-100 justify-content-between ${isLightMode ? "light-mode" : "dark-mode"}">
    //                 <p class="text_LightGray">there is ${todo_list.length} items</p>
    //                 <div class="d-flex gap-3 align-items-center ${isLightMode ? "light-mode" : "dark-mode"}">
    //                     <button class="btn-costum btn-1" id="filter_all">All</button>
    //                     <button class="btn-costum btn-1" id="filter_active">Active</button>
    //                     <button class="btn-costum btn-1" id="filter_completed">Completed</button>
    //                 </div>
    //                 <button class="btn-costum btn-1" id="clear_completed">Clear Completed</button>
    //             </div>
    //         </div>
    //     </div>`;

    // Filter the todo list based on the selected filter
    let filtered_todo_list = todo_list;
    if (filter === "active") {
        filtered_todo_list = todo_list.filter(todo => !todo.completed);
    } else if (filter === "completed") {
        filtered_todo_list = todo_list.filter(todo => todo.completed);
    }
    todo_container.innerHTML = "";
    // Append each todo item
    filtered_todo_list.forEach((todo, index) => {
        console.log(isLightMode)
        
        todo_container.innerHTML += `
            <div class="d-flex gap-3 underline align-items-center " id="todo_item_${index}">
                <div>
                    <input type="checkbox" class="cbx2" id="cbx_${index}" ${todo.completed ? "checked" : ""} style="display: none;">
                    <label for="cbx_${index}" class="check">
                        <svg width="18px" height="18px" viewBox="0 0 18 18">
                            <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
                            <polyline points="1 9 7 14 15 4"></polyline>
                        </svg>
                    </label>
                </div>
                <h5 class="rounded rounded-2 w-100 py-3 p-0 m-0  ${todo.completed ? "line-through text-darkgray" : "white-text"} ${isLightMode ? "text-dark" :"text-white"}" id="todo_${index}">${todo.text}</h5>
                <a href="#" class="delete-todo" data-index="${index}"><i class="fa-solid fa-trash text-danger fs-4"></i></a>
            </div>`;
    });

    // Add event listeners to the checkboxes
    document.querySelectorAll(".cbx2").forEach((checkbox, index) => {
        checkbox.addEventListener("change", function() {
            const todoText = document.getElementById(`todo_${index}`);
            todo_list[index].completed = checkbox.checked;
            localStorage.setItem("todo_list", JSON.stringify(todo_list));
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
    const filter_all = document.getElementById("filter_all");
    const filter_active = document.getElementById("filter_active");
    const filter_completed = document.getElementById("filter_completed");
    const clear_completed = document.getElementById("clear_completed");
    console.log(filter_all)
    filter_all.addEventListener("click", function() {
        filter = "all";
        renderTodoList();
        setActiveButton(filter_all);
    });


    filter_active.addEventListener("click", function() {
        filter = "active";
        renderTodoList();
        setActiveButton(filter_active);
    });

    filter_completed.addEventListener("click", function() {
        filter = "completed";
        renderTodoList();
        setActiveButton(filter_completed);
    });

    clear_completed.addEventListener("click", function() {
        todo_list = todo_list.filter(todo => !todo.completed);
        localStorage.setItem("todo_list", JSON.stringify(todo_list));
        renderTodoList();
    });

    // Function to update the todo count
    updateTodoCount();
}

function setActiveButton(activeButton) {
    const filterButtons = [document.getElementById("filter_all"), document.getElementById("filter_active"), document.getElementById("filter_completed")];
    filterButtons.forEach(button => {
        button.classList.remove("blue");
        button.classList.add("text_LightGray");
    });
    activeButton.classList.add("blue");
    activeButton.classList.remove("text_LightGray");
}

function updateTodoCount() {
    document.querySelector(".text_LightGray").innerHTML = `there is ${todo_list.length} items`;
}

// Initial render
renderTodoList();


console.log("youho");