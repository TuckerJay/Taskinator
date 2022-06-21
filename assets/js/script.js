var tasks = [];

var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");

var tasksToDoEl = document.querySelector("#tasks-to-do");

var tasksInProgressEl = document.querySelector("#tasks-in-progress");

var tasksCompletedEl = document.querySelector("#tasks-completed");

var pageContentEl = document.querySelector("#page-content");



var taskFormHandler = function(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;

    var taskTypeInput = document.querySelector("select[name='task-type']").value;


    // check valid input
    if(!taskNameInput || !taskTypeInput) {

        alert("You need to fill out the task form!");

        return false;
    }


    // Reset
    formEl.reset();


    // edit T/F var
    var isEdit = formEl.hasAttribute("data-task-id");

   
    if (isEdit) {

        var taskId = formEl.getAttribute("data-task-id");

        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {

        // package up data as an object
        var taskDataObj = {

            name: taskNameInput,

            type: taskTypeInput,

            status: "to do"

        };

        //send it as an argument to createTaskEl
        createTaskEl(taskDataObj);

    }
    

};



var createTaskEl = function(taskDataObj) {

    // create list item
    var listItemEl = document.createElement("li");

    listItemEl.className = "task-item";


    // add custom task id

    listItemEl.setAttribute("data-task-id", taskIdCounter);


    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");

    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";   
    
    listItemEl.appendChild(taskInfoEl);


    // call list item button creation function and append to list item
    var taskActionsEl = createTaskActions(taskIdCounter);

    listItemEl.appendChild(taskActionsEl);


    // obj id
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();


    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);


    // increase task id counter
    taskIdCounter ++;

};


var createTaskActions = function(taskId) {

    var actionContrainerEl = document.createElement("div");

    actionContrainerEl.className = "task-actions";

    // create edit button

    var editButtonEl = document.createElement("button");

    editButtonEl.textContent = "Edit";

    editButtonEl.className = "btn edit-btn";

    editButtonEl.setAttribute("data-task-id", taskId);


    actionContrainerEl.appendChild(editButtonEl);


    // create delete button

    var deleteButtonEl = document.createElement("button");

    deleteButtonEl.textContent = "Delete";

    deleteButtonEl.className = "btn delete-btn";

    deleteButtonEl.setAttribute("data-task-id", taskId);


    actionContrainerEl.appendChild(deleteButtonEl);


    // add dropdown

    var statusSelectEl = document.createElement("select");

    statusSelectEl.className = "select-status";

    statusSelectEl.setAttribute("name", "status-change");

    statusSelectEl.setAttribute("data-task-id", taskId);


    actionContrainerEl.appendChild(statusSelectEl);


    // add dropdown options

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {

        var statusOptionEl = document.createElement("option");

        statusOptionEl.textContent = statusChoices[i];

        statusOptionEl.setAttribute("value", statusChoices[i]);


        statusSelectEl.appendChild(statusOptionEl);

    }


    return actionContrainerEl;

};


var editTask = function(taskId) {

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")


    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    
    document.querySelector("input[name='task-name']").value = taskName;

    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";


    formEl.setAttribute("data-task-id", taskId);

};


var completeEditTask = function(taskName, taskType, taskId) {

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");


    taskSelected.querySelector("h3.task-name").textContent = taskName;

    taskSelected.querySelector("span.task-type").textContent = taskType;


    // array check
    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id === parseInt(taskId)) {

            tasks[i].name = taskName;

            tasks[i].type = taskType;

        }

    }

    saveTasks();


    alert("Task Updated!");


    formEl.removeAttribute("data-task-id");

    document.querySelector("#save-task").textContent = "Add Task";

};


var deleteTask = function(taskId) {

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.remove();


    var updatedTaskArr = [];


    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id !== parseInt(taskId)) {

            updatedTaskArr.push(tasks[i]);

        }

    }


    tasks = updatedTaskArr;

    saveTasks();

};


var taskStatusChangeHandler = function(event) {

    var taskId = event.target.getAttribute("data-task-id");


    var statusValue = event.target.value.toLowerCase();


    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");


    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }


    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id === parseInt(taskId)) {

            tasks[i].status = statusValue;

        }

    }

    saveTasks();

};


var taskButtonHandler = function(event) {

    var targetEl = event.target;


    // edit button clicked
    if (targetEl.matches(".edit-btn")) {

        var taskId = targetEl.getAttribute("data-task-id");

        editTask(taskId)

    }


    // delete button clicked
    else if (targetEl.matches(".delete-btn")) {

        var taskId = event.target.getAttribute("data-task-id");

        deleteTask(taskId);

    }

};


var saveTasks = function () {

    localStorage.setItem("tasks", JSON.stringify(tasks));

};


formEl.addEventListener("submit", taskFormHandler);


pageContentEl.addEventListener("click", taskButtonHandler);


pageContentEl.addEventListener("change", taskStatusChangeHandler);