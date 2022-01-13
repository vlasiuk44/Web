let essentialObj = {
    accept_bttn_click_purpose: "add",
    running_process: null,
    editingNode: undefined,
    counter: 0,
};
// searching for all necessary elements
let priority_checkbox = (document.querySelector(".task-card_priority-block_checkbox")).children[0];
let toDoCard = document.querySelector(".task-card");
let desc_input = document.querySelector(".task-card_description");
let accept_bttn = document.querySelector(".task-card_buttons-block_button-save");
let cancel_bttn = document.querySelector(".task-card_buttons-block_button-cancel");
let task_field = document.querySelector(".task-container_task-field");
// making card visible for the first time, update it
for (const i of document.querySelector(".task-container_head-panel_add-panel").children) {
    i.addEventListener('click', function() {
        // preventing simultaneous editing and adding
        console.log(essentialObj.running_process);
        if (essentialObj.running_process === null) {
            essentialObj.running_process = "adding";
            essentialObj.accept_bttn_click_purpose = "add";
            toDoCard.classList.remove("none");
            elementPositioning();
            if (desc_input.value) {
                desc_input.value = null;
            }
            priority_checkbox.setAttribute("src", "res/checkbox-empty.svg");
        } else if (essentialObj.running_process === "adding") {
            alert("Firstly, add or cancel current task!");
        } else if (essentialObj.running_process === "editing") {
            alert("Adding forbidden! Firstly complete editing operation!");
        } else if (essentialObj.running_process === "confirmation") {
            alert("Confirm deleting!");
        }
    });
}
// card checkbox clicking
for (const i of document.querySelector(".task-card_priority-block").children) {
    i.addEventListener('click', function() {
        if (priority_checkbox.getAttribute("src") === "res/checkbox-empty.svg") {
            priority_checkbox.setAttribute("src","res/checkbox.svg");
        } else {
            priority_checkbox.setAttribute("src","res/checkbox-empty.svg");
        }
    });
}
// listeners for card buttons
// accept-button 
function accept_bttn_click() {
    // in case if we want to add new task
    if (essentialObj.accept_bttn_click_purpose === "add") { 
        console.log(essentialObj.running_process);
        let buffer_array = buildingTaskElement(desc_input.value);
        let single_task = buffer_array[0];
        let isPrimaryTask = buffer_array[1];
        insertTask(isPrimaryTask, single_task, false);
        toDoCard.classList.add("none");
        essentialObj.running_process = null;
    // in case if we want to edit existing one
    } else if (essentialObj.accept_bttn_click_purpose === "edit") {
        console.log(essentialObj.running_process);
        let buffer_array = editTask(desc_input.value);
        let single_task = buffer_array[0];
        let isPrimaryTask = buffer_array[1];
        insertTask(isPrimaryTask, single_task), false;
        toDoCard.classList.add("none");
        essentialObj.editingNode = undefined;
        essentialObj.running_process = null;
    }
}
accept_bttn.addEventListener('click', accept_bttn_click); 
// cancel-button
cancel_bttn.addEventListener('click', function() {
    toDoCard.classList.add("none");
    essentialObj.running_process = null;
});
// create an element for task list
function buildingTaskElement(taskName) {
    //
    let checkbox_img = document.createElement("img");
    checkbox_img.setAttribute("src", "res/checkbox-empty.svg");
    let taskContainerSingleTaskCheckbox = document.createElement("div");
    taskContainerSingleTaskCheckbox.classList.add("task-container_single-task_checkbox");
    taskContainerSingleTaskCheckbox.appendChild(checkbox_img);
    //
    let priority_img = document.createElement("img");
    let isPrimaryTask = true;
    priority_img.setAttribute("src", "res/priority.svg");
    if (priority_checkbox.getAttribute("src") === "res/checkbox-empty.svg") {
        priority_img.classList.add("visibility");
        isPrimaryTask = false;
    }
    let taskContainerSingleTaskPriority = document.createElement("div");
    taskContainerSingleTaskPriority.classList.add("task-container_single-task_priority");
    taskContainerSingleTaskPriority.appendChild(priority_img);
    //
    let taskContainerSingleTaskDesc = document.createElement("div");
    taskContainerSingleTaskDesc.classList.add("task-container_single-task_description");
    // console.log(taskName);
    if (taskName) {
        taskContainerSingleTaskDesc.innerText = taskName;  
    } else {
        taskContainerSingleTaskDesc.innerText = "Задача " + 
        String(essentialObj.counter + 1);
        essentialObj.counter++;
    }
    //
    let pencil_img = document.createElement("img");
    pencil_img.setAttribute("src", "res/pencil.svg");
    let taskContainerSingleTaskPencil = document.createElement("div");
    taskContainerSingleTaskPencil.classList.add("task-container_single-task_pencil");
    taskContainerSingleTaskPencil.appendChild(pencil_img);
    //
    let trashbin_img = document.createElement("img");
    trashbin_img.setAttribute("src", "res/trashbin.svg");
    let taskContainerSingleTaskTrashbin = document.createElement("div");
    taskContainerSingleTaskTrashbin.classList.add("task-container_single-task_trashbin");
    taskContainerSingleTaskTrashbin.appendChild(trashbin_img);
    //
    let innerBlock1 = document.createElement("div");
    innerBlock1.classList.add("task-container_single-task_inner-block1");
    innerBlock1.appendChild(taskContainerSingleTaskCheckbox);
    innerBlock1.appendChild(taskContainerSingleTaskPriority);
    innerBlock1.appendChild(taskContainerSingleTaskDesc);
    //
    let innerBlock2 = document.createElement("div");
    innerBlock2.classList.add("task-container_single-task_inner-block2");
    innerBlock2.appendChild(taskContainerSingleTaskPencil);
    innerBlock2.appendChild(taskContainerSingleTaskTrashbin);
    //
    let taskContainerSingleTask = document.createElement("div");
    taskContainerSingleTask.classList.add("task-container_single-task");
    taskContainerSingleTask.appendChild(innerBlock1);
    taskContainerSingleTask.appendChild(innerBlock2);
    //
    checkbox_img.setAttribute("onclick", "delegate()");
    pencil_img.setAttribute("onclick", "delegate()");
    trashbin_img.setAttribute("onclick", "delegate()");
    //
    return [taskContainerSingleTask, isPrimaryTask];
}
// function of inserting elem 
function insertTask(isPrimary, elem, isDone) {
    let active_tasks = task_field.children;
    if (isDone) {
        task_field.appendChild(elem);
    } else {
        if (active_tasks.length === 0 || !isPrimary) {
            task_field.appendChild(elem);
        } else {
            for (const i of active_tasks) {
                // console.log(i);
                let img = (i.querySelector(".task-container_single-task_priority").children)[0];
                if (img.className === "visibility") {
                    task_field.insertBefore(elem, i);
                    break;
                }
            }
        }
    }
}
// delegation checkbox, trashbin, pencil
function delegate() {
    let clicked = event.target;
    console.log(clicked);
    let generalSibling = ((clicked.parentNode).parentNode).parentNode;
    if (clicked.getAttribute("src") === "res/trashbin.svg") {
        if (essentialObj.running_process === null) {
            confirmtaion(generalSibling);
        }
    } else if (clicked.getAttribute("src") === "res/pencil.svg") {
        console.log(essentialObj.running_process);
        if (essentialObj.running_process === null) {
            essentialObj.running_process = "editing";
            essentialObj.accept_bttn_click_purpose = "edit";
            toDoCard.classList.remove("none");
            elementPositioning();
            essentialObj.editingNode = generalSibling;
            desc_input.value = generalSibling.querySelector(".task-container_single-task_description").innerText;
            if ((generalSibling.querySelector(".task-container_single-task_priority")).children[0].className === "visibility") {
                priority_checkbox.setAttribute("src", "res/checkbox-empty.svg");
            } else {
                priority_checkbox.setAttribute("src", "res/checkbox.svg");
            }
        } else if (essentialObj.running_process === "editing") {
            alert("You're already editing one of the task!");
        } else if (essentialObj.running_process === "adding") {
            alert("Editing forbidden! Firstly complete adding operation!");
        } else if (essentialObj.running_process === "confirmation") {
            alert("Confirm deleting!");
        }
    } else if (clicked.getAttribute("src") === "res/checkbox.svg") {
        if (essentialObj.running_process ===  null) {
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
        if (essentialObj.running_process === null) {
            generalSibling.querySelector(".task-container_single-task_description").classList.add("crossed");
            generalSibling.querySelector(".task-container_single-task_pencil").firstChild.setAttribute("src", "res/pencil-grey.svg");
            generalSibling.querySelector(".task-container_single-task_trashbin").firstChild.setAttribute("src", "res/trashbin-grey.svg");
            clicked.setAttribute("src", "res/checkbox.svg");
            insertTask(false, generalSibling, true); 
        }
    }
}
// editing task
function editTask(taskName) {
    let priority_img = essentialObj.editingNode.querySelector(".task-container_single-task_priority").children[0];
    let isPrimaryTask = true;
    priority_img.setAttribute("src", "res/priority.svg");
    priority_img.classList.remove("visibility");
    if (priority_checkbox.getAttribute("src") === "res/checkbox-empty.svg") {
        priority_img.classList.add("visibility");
        isPrimaryTask = false;
    }
    essentialObj.editingNode.querySelector(".task-container_single-task_description").innerText = taskName;
    return [essentialObj.editingNode, isPrimaryTask];
}
// confiramtion of deleting
let confirm_window = document.querySelector(".confirm-window");
function confirmtaion(elem) {
    essentialObj.running_process = "confirmation";
    confirm_window.classList.remove("none");
    confirm_window.querySelector(".confirm-window_title").innerText = "Вы действительно хотите удалить " 
    + elem.querySelector(".task-container_single-task_description").innerText + "?";
    elementPositioning();
    let yes_bttn = confirm_window.querySelector(".confirm-window_inner-block_button-accept");
    let no_bttn = confirm_window.querySelector(".confirm-window_inner-block_button-decline");
    yes_bttn.addEventListener('click', function() {
        elem.parentNode.removeChild(elem);
        essentialObj.running_process = null;
        confirm_window.classList.add("none");
    });
    no_bttn.addEventListener('click', function() {
        confirm_window.classList.add("none");
    });
}
// tracking window resizing
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
