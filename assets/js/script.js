var taskIdCounter = 0;
// create variables by searching their matching id names in the DOM
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");

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
            type: taskTypeInput
        };
        createTaskEl(taskDataObj);
    }
};

// function to create new task using object values from taskFormHandler
var createTaskEl = function(taskDataObj) {
    // create list item, with class name
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    // add task id as custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    
    // create div to hold task info and add to list item, give class name and html content
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    // add new div to list item
    listItemEl.appendChild(taskInfoEl);
    
    // set taskActionsEl to createTaskActions function with argument of
    // taskIdCounter to correspond with the current task id, add to list item
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    // add entire list item to list
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

    // add new select element to container
    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;

};

var completeEditTask = function(taskName, taskType, taskId) {
    // find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new name and type values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // alert success, reset form
    alert("Task updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
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

// function to delete a task based on taskId as argument from taskButtonHandler()
var deleteTask = function(taskId) {
    // get task list element matching task-item class with attribute data-task-id, apply taskId, remove
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    };

// function to edit a task, with taskId as argument from taskButtonHandler()
var editTask = function(taskId) {
    // get task list element matching task-item class with attribute data-task-id, apply taskId
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    // get content from task name and type, searching only within taskSelected element
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    
    // change #save-task button to "Save Task" from "Add Task" to show a user is in edit mode
    document.querySelector("#save-task").textContent = "Save Task";

    // load task's attributes to form to show which task is being edited
    formEl.setAttribute("data-task-id", taskId);
};

pageContentEl.addEventListener("click", taskButtonHandler);

// submit event on form that calls back the taskFormHandler function
formEl.addEventListener("submit", taskFormHandler);