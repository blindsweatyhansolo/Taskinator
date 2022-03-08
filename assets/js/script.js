var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// function to collect form's values, package into an object, and pass into createTaskEl function
var taskFormHandler = function(event) {
    // prevents the default browser action of refreshing page when form is submitted
    event.preventDefault();
    
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // form validation for empty strings (here ! (not) is checking if variable is falsy)
    // can also be (taskNameInput === "" || taskTypeInput === "")
    if (!taskNameInput || !taskTypeInput) {
        alert("Must fill out the task form!");
        return false;
    }

    // reset form to default upon submission
    formEl.reset();

    // // reset form fields for next task to be entered
    // document.querySelector("input[name='task-name']").value = "";
    // document.querySelector("select[name='task-type']").selectedIndex = 0;

    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    
    // send above as argument to createTaskEl function
    createTaskEl(taskDataObj);
};

// function to create new task using object values from taskFormHandler
var createTaskEl = function(taskDataObj) {
    // create list item, with class name
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    
    // create div to hold task info and add to list item, give class name and html content
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    // add new div to list item
    listItemEl.appendChild(taskInfoEl);
    
    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
};


// submit event on form that calls back the taskFormHandler function
formEl.addEventListener("submit", taskFormHandler);