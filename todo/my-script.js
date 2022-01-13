let esObj = {
    accept_click: "add",
    runnings: null,
    editing: undefined,
    counter: 0,
};

let priority = (document.querySelector(".task-card_priority-block_checkbox")).children[0];
let toDoCard = document.querySelector(".task-card");
let desc_input = document.querySelector(".task-card_description");
let accept_button = document.querySelector(".task-card_buttons-block_button-save");
let cancel_button = document.querySelector(".task-card_buttons-block_button-cancel");
let task_field = document.querySelector(".task-container_task-field");

for (const i of document.querySelector(".task-container_head-panel_add-panel").children) {
    i.addEventListener('click', function() {

        console.log(esObj.runnings);
        if (esObj.runnings === null) {
            esObj.runnings = "adding";
            esObj.accept_click = "add";
            toDoCard.classList.remove("none");
            elementPositioning();
            if (desc_input.value) {
                desc_input.value = null;
            }
            priority.setAttribute("src", "res/checkbox-empty.svg");
        } else if (esObj.runnings === "adding") {
            alert("Firstly, add or cancel current task!");
        } else if (esObj.runnings === "editing") {
            alert("Adding forbidden! Firstly complete editing operation!");
        } else if (esObj.runnings === "confirmation") {
            alert("Confirm deleting!");
        }
    });
}

for (const i of document.querySelector(".task-card_priority-block").children) {
    i.addEventListener('click', function() {
        if (priority.getAttribute("src") === "res/checkbox-empty.svg") {
            priority.setAttribute("src","res/checkbox.svg");
        } else {
            priority.setAttribute("src","res/checkbox-empty.svg");
        }
    });
}

function accept_button_click() {

    if (esObj.accept_click === "add") { 
        console.log(esObj.runnings);
        let buffer_array = buildingTaskElement(desc_input.value);
        let single_task = buffer_array[0];
        let isPrimaryTask = buffer_array[1];
        insertTask(isPrimaryTask, single_task, false);
        toDoCard.classList.add("none");
        esObj.runnings = null;

    } else if (esObj.accept_click === "edit") {
        console.log(esObj.runnings);
        let buffer_array = editTask(desc_input.value);
        let single_task = buffer_array[0];
        let isPrimaryTask = buffer_array[1];
        insertTask(isPrimaryTask, single_task), false;
        toDoCard.classList.add("none");
        esObj.editing = undefined;
        esObj.runnings = null;
    }
}
accept_button.addEventListener('click', accept_button_click); 

cancel_button.addEventListener('click', function() {
    toDoCard.classList.add("none");
    esObj.runnings = null;
});

function buildingTaskElement(taskName) {
     
    let checkbox_img = document.createElement("img");
    checkbox_img.setAttribute("src", "res/checkbox-empty.svg");
    let taskContainerSingleTaskCheckbox = document.createElement("div");
    taskContainerSingleTaskCheckbox.classList.add("task-container_single-task_checkbox");
    taskContainerSingleTaskCheckbox.appendChild(checkbox_img);
     
    let priority_img = document.createElement("img");
    let isPrimaryTask = true;
    priority_img.setAttribute("src", "res/priority.svg");
    if (priority.getAttribute("src") === "res/checkbox-empty.svg") {
        priority_img.classList.add("visibility");
        isPrimaryTask = false;
    }
    let taskContainerSingleTaskPriority = document.createElement("div");
    taskContainerSingleTaskPriority.classList.add("task-container_single-task_priority");
    taskContainerSingleTaskPriority.appendChild(priority_img);
     
    let taskContainerSingleTaskDesc = document.createElement("div");
    taskContainerSingleTaskDesc.classList.add("task-container_single-task_description");

    if (taskName) {
        taskContainerSingleTaskDesc.innerText = taskName;  
    } else {
        taskContainerSingleTaskDesc.innerText = "Задача " + 
        String(esObj.counter + 1);
        esObj.counter++;
    }
     
    let pencil_img = document.createElement("img");
    pencil_img.setAttribute("src", "res/pencil.svg");
    let taskContainerSingleTaskPencil = document.createElement("div");
    taskContainerSingleTaskPencil.classList.add("task-container_single-task_pencil");
    taskContainerSingleTaskPencil.appendChild(pencil_img);
     
    let trashbin_img = document.createElement("img");
    trashbin_img.setAttribute("src", "res/trashbin.svg");
    let taskContainerSingleTaskTrashbin = document.createElement("div");
    taskContainerSingleTaskTrashbin.classList.add("task-container_single-task_trashbin");
    taskContainerSingleTaskTrashbin.appendChild(trashbin_img);
     
    let innerBlock1 = document.createElement("div");
    innerBlock1.classList.add("task-container_single-task_inner-block1");
    innerBlock1.appendChild(taskContainerSingleTaskCheckbox);
    innerBlock1.appendChild(taskContainerSingleTaskPriority);
    innerBlock1.appendChild(taskContainerSingleTaskDesc);
     
    let innerBlock2 = document.createElement("div");
    innerBlock2.classList.add("task-container_single-task_inner-block2");
    innerBlock2.appendChild(taskContainerSingleTaskPencil);
    innerBlock2.appendChild(taskContainerSingleTaskTrashbin);
     
    let taskContainerSingleTask = document.createElement("div");
    taskContainerSingleTask.classList.add("task-container_single-task");
    taskContainerSingleTask.appendChild(innerBlock1);
    taskContainerSingleTask.appendChild(innerBlock2);
     
    checkbox_img.setAttribute("onclick", "delegate()");
    pencil_img.setAttribute("onclick", "delegate()");
    trashbin_img.setAttribute("onclick", "delegate()");
     
    return [taskContainerSingleTask, isPrimaryTask];
}

function insertTask(isPrimary, elem, isDone) {
    let active_tasks = task_field.children;
    if (isDone) {
        task_field.appendChild(elem);
    } else {
        if (active_tasks.length === 0 || !isPrimary) {
            task_field.appendChild(elem);
        } else {
            for (const i of active_tasks) {

                let img = (i.querySelector(".task-container_single-task_priority").children)[0];
                if (img.className === "visibility") {
                    task_field.insertBefore(elem, i);
                    break;
                }
            }
        }
    }
}

function delegate() {
    let clicked = event.target;
    console.log(clicked);
    let generalSibling = ((clicked.parentNode).parentNode).parentNode;
    if (clicked.getAttribute("src") === "res/trashbin.svg") {
        if (esObj.runnings === null) {
            confirmtaion(generalSibling);
        }
    } else if (clicked.getAttribute("src") === "res/pencil.svg") {
        console.log(esObj.runnings);
        if (esObj.runnings === null) {
            esObj.runnings = "editing";
            esObj.accept_click = "edit";
            toDoCard.classList.remove("none");
            elementPositioning();
            esObj.editing = generalSibling;
            desc_input.value = generalSibling.querySelector(".task-container_single-task_description").innerText;
            if ((generalSibling.querySelector(".task-container_single-task_priority")).children[0].className === "visibility") {
                priority.setAttribute("src", "res/checkbox-empty.svg");
            } else {
                priority.setAttribute("src", "res/checkbox.svg");
            }
        } else if (esObj.runnings === "editing") {
            alert("You're already editing one of the task!");
        } else if (esObj.runnings === "adding") {
            alert("Editing forbidden! Firstly complete adding operation!");
        } else if (esObj.runnings === "confirmation") {
            alert("Confirm deleting!");
        }
    } else if (clicked.getAttribute("src") === "res/checkbox.svg") {
        if (esObj.runnings ===  null) {
            generalSibling.querySelector(".task-container_single-task_description").classList.remove("crossed");
            generalSibling.querySelector(".task-container_single-task_pencil").firstChild.setAttribute("src", "res/pencil.svg");
            generalSibling.querySelector(".task-container_single-task_trashbin").firstChild.setAttribute("src", "res/trashbin.svg");
            clicked.setAttribute("src", "res/checkbox-empty.svg");
            if (generalSibling.querySelector(".task-container_single-task_priority").firstChild.className === "visibility") {
                insertTask(false, generalSibling, false);
            } else {
                insertTask(true, generalSibling, false);
            }
        }
    } else if (clicked.getAttribute("src") === "res/checkbox-empty.svg") {
        if (esObj.runnings === null) {
            generalSibling.querySelector(".task-container_single-task_description").classList.add("crossed");
            generalSibling.querySelector(".task-container_single-task_pencil").firstChild.setAttribute("src", "res/pencil-grey.svg");
            generalSibling.querySelector(".task-container_single-task_trashbin").firstChild.setAttribute("src", "res/trashbin-grey.svg");
            clicked.setAttribute("src", "res/checkbox.svg");
            insertTask(false, generalSibling, true); 
        }
    }
}

function editTask(taskName) {
    let priority_img = esObj.editing.querySelector(".task-container_single-task_priority").children[0];
    let isPrimaryTask = true;
    priority_img.setAttribute("src", "res/priority.svg");
    priority_img.classList.remove("visibility");
    if (priority.getAttribute("src") === "res/checkbox-empty.svg") {
        priority_img.classList.add("visibility");
        isPrimaryTask = false;
    }
    esObj.editing.querySelector(".task-container_single-task_description").innerText = taskName;
    return [esObj.editing, isPrimaryTask];
}

let confirm_window = document.querySelector(".confirm-window");
function confirmtaion(elem) {
    esObj.runnings = "confirmation";
    confirm_window.classList.remove("none");
    confirm_window.querySelector(".confirm-window_title").innerText = "Вы действительно хотите удалить " 
    + elem.querySelector(".task-container_single-task_description").innerText + "?";
    elementPositioning();
    let yes_button = confirm_window.querySelector(".confirm-window_inner-block_button-accept");
    let no_button = confirm_window.querySelector(".confirm-window_inner-block_button-decline");
    yes_button.addEventListener('click', function() {
        elem.parentNode.removeChild(elem);
        esObj.runnings = null;
        confirm_window.classList.add("none");
    });
    no_button.addEventListener('click', function() {
        confirm_window.classList.add("none");
    });
}

function elementPositioning() {
    let window_width = window.innerWidth;
    let confirm_window_width = confirm_window.offsetWidth;
    confirm_window.style.left = (Number(window_width / 2 - (confirm_window_width / 2))) + "px";
    let task_field_width = document.querySelector(".task-container").offsetWidth;
    console.log(task_field_width);
    let task_field_leftMargin = window_width * 0.2;
    toDoCard.style.left = (Number(task_field_width + task_field_leftMargin)) + "px";
    console.log(window_width, confirm_window_width, task_field_leftMargin);
} 
window.onresize = elementPositioning;
