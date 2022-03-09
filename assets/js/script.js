var taskIdCounter = 0;
// create variables by searching their matching id names in the DOM
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

// (empty) array to hold tasks for saving 
var tasks = [];

// function to collect form's values, package into an object, and pass into createTaskEl function on SUBMIT
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

    var isEdit = formEl.hasAttribute("data-task-id");

        // if isEdit has data attribute (true), get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
        // no data attribute (false), package up data as object and pass to createTaskEl()
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj);
    }
};

// function to create new task using object values from taskFormHandler
var createTaskEl = function(taskDataObj) {
    // create list item, with class name
    // add task id as custom attribute
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    
    // create div to hold task info and add to list item, give class name and html content
    // add new div to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    
    // use taskIdCounter to create the id for taskDataObj, push into [tasks] object array
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // call function to save task to localStorage
    saveTasks();

    // set taskActionsEl to createTaskActions function with argument of
    // taskIdCounter to correspond with the current task id, add to list item
    // add entire list item to list
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

// function to create edit/delete buttons to new task
var createTaskActions = function(taskId) {
    // create new div container with class name "task-actions"
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button with text, two class names, and custom data-task-id attribute
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    // add new edit button to container
    actionContainerEl.appendChild(editButtonEl);

    // create delete button with text, two class names, and custom data-task-id attribute
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    // add new delete button to container
    actionContainerEl.appendChild(deleteButtonEl);

    // create (select) status dropdown with class name, multiple attributes
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    // add new select element to container
    actionContainerEl.appendChild(statusSelectEl);
    
    // create (option) array for dropdown, use for loop to create new option with text
    // and attributes, then append to (select) status dropdown
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        // add to (select) dropdown
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

// function to edit task
var completeEditTask = function(taskName, taskType, taskId) {
    // find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new name and type values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    // tasks[i].id checks if individual task's id property matches taskId, changed to integer with parseInt()
    // on match, verifies particular task is the one that needs to be updated, reassigns name and type
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    
    // alert success, reset form
    alert("Task updated!");

    formEl.removeAttribute("data-task-id");
    formEl.querySelector("#save-task").textContent = "Add Task";

    // call function to save task to localStorage
    saveTasks();
};

// function to match edit or delete element when a button is targeted, by way
// of matching the elements class name and attribute (data-task-id #), then returning
// variable taskId as argument for matching function 
var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;
    
    // if edit button clicked / else if delete button clicked, return as argument
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }    
};

// function to / with [change] event as argument
var taskStatusChangeHandler = function(event) {
    // get task items id
    var taskId = event.target.getAttribute("data-task-id");
    
    // find parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId  + "']");

    // get currently selected options value, convert to lowercase (for future-proofing)
    var statusValue = event.target.value.toLowerCase();

    // based on selected option value, moves taskSelected item to appropriate container
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's status in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    // call function to save task to localStorage
    saveTasks();
};

// function to edit a task, with taskId as argument from taskButtonHandler()
var editTask = function(taskId) {
    // get task list element matching task-item class with attribute data-task-id, apply taskId
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    // get content from task name and type, searching only within taskSelected element
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    // write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    
    // load task's attributes to form to show which task is being edited
    formEl.setAttribute("data-task-id", taskId);
    // change #save-task button to "Save Task" from "Add Task" to show a user is in edit mode
    formEl.querySelector("#save-task").textContent = "Save Task";
};

// function to delete a task based on taskId as argument from taskButtonHandler()
var deleteTask = function(taskId) {
    // get task list element matching task-item class with attribute data-task-id, apply taskId, remove
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks, if tasks[i].id doesn't match value of taskId, keep task and push it to new array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be same as updatedTaskArr
    tasks = updatedTaskArr;

    // call function to save task to localStorage
    saveTasks();
};
  
// function to save tasks to localStorage, executes everytime a task is added, updated or deleted
// change task values to strings with JSON.stringify()
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// function to load tasks from localStorage, convert from strings with JSON.parse()
var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");

    // if there are no tasks, set tasks to an empty array and return out of function
    if (!savedTasks) {
        return false;
    }
    console.log("Saved tasks found!");

    // parse into array of objects    
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array, pass each task object into createTaskEl()
    for (var i = 0; i < savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
    }
};

// create new task on SUBMIT event on form that calls taskFormHandler()
formEl.addEventListener("submit", taskFormHandler);

// event listener for edit and delete buttons that calls taskButtonHandler() on CLICK
pageContentEl.addEventListener("click", taskButtonHandler);

// event listener for status changes that calls taskStatusChangeHandler() on CHANGE
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();