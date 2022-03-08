var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// function to create new task
// (li element with assigned text and class name, appended to selected ul)
var createTaskHandler = function() {
    // prevents the default browser action of refreshing page when form is submitted
    event.preventDefault();

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task";
    tasksToDoEl.appendChild(listItemEl);
};

// submit event on form that calls back the createTaskHandler function
formEl.addEventListener("submit", createTaskHandler);