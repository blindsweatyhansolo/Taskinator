var buttonE1 = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// function to create new task
// (li element with assigned text and class name, appended to selected ul)
var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task";
    tasksToDoEl.appendChild(listItemEl);
};

// click event on button that calls back the createTaskHandler function
buttonE1.addEventListener("click", createTaskHandler);