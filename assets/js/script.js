var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;

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
    editButtonEl.setAttribute = ("data-task-id", taskId);
    // add new edit button to container
    actionContainerEl.appendChild(editButtonEl);

    // create delete button with text, two class names, and custom data-task-id attribute
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute = ("data-task-id", taskId);
    // add new delete button to container
    actionContainerEl.appendChild(deleteButtonEl);

    // create (select) status dropdown with class name, multiple attributes
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute = ("name", "status-change");
    statusSelectEl.setAttribute = ("data-task-id", taskId);
    
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


// submit event on form that calls back the taskFormHandler function
formEl.addEventListener("submit", taskFormHandler);