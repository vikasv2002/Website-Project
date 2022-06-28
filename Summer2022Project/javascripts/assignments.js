// createAssignmentBlock is designed to create a block containing
// the information needed to display it to the user.
//
// Preconditions: subjectColor is a valid CSS color, assignmentName
// is a valid length, and dueTime is of proper format
//
// @param subjectColor
//        The color of the subject the assignment is for; ex. Red
// @param assignmentName
//        The name for the assignment
// @param dueTime
//        The time at which it is due; ex. 11:59pm
//
// @return an element containg the HTML code of the block
function createAssignmentBlock(subjectColor, assignmentName, dueTime){

    // creates the outer container to hold the text in
    const assignmentContainer = document.createElement("div");
        // sets the class names
    assignmentContainer.classList.add("container-fluid", "assignment-block-btn", "btn");
        // sets the color gradient on the left
    assignmentContainer.style.backgroundImage = `linear-gradient(to right, ${subjectColor}, ${subjectColor} 25%, transparent 25%, transparent 100%)`;

    // creates the container to hold the name
    const nameContainer = document.createElement("div");
        // adds the classes
    nameContainer.classList.add("container-fluid", "assignment-block-name");
    // h6 name tag
    const name = document.createElement("h6");
        // adds the classes
    name.classList.add("assignment-name");
        // sets the inner text
    name.append(assignmentName);
    // append h6 name tag to its container
    nameContainer.append(name);


    // creates the container to hold the time
    const timeContainer = document.createElement("div");
        // sets the class names
    timeContainer.classList.add("container-fluid", "assignment-block-time");
    // creates p tag to hold complete by time
    const time = document.createElement("p");
        // adds the class
    time.classList.add("assignment-time");
        // sets the inner text
    time.innerText = "Complete by: " + dueTime;
    // appends p tag to its container
    timeContainer.append(time);

    // append both containers to outside container
    assignmentContainer.append(nameContainer, timeContainer);
    // return item
    return assignmentContainer;
}

const assignmentBlock = createAssignmentBlock("blue", "Speech 3", "11:15 am");
const assignmentBlock2 = createAssignmentBlock("red", "Homework 6", "12:20 pm");
const assignmentBlock3 = createAssignmentBlock("green", "Quiz 6", "11:59 pm");
const assignmentBlock4 = createAssignmentBlock("black", "WebWork HW", "11:59 pm");
document.getElementById("c3").append(assignmentBlock, assignmentBlock2, assignmentBlock3);
document.getElementById("c1").append(assignmentBlock4);

const form = document.getElementById("form");

function serializeForm(){
    form.addEventListener('submit', function(){
        console.log($('form').serialize());
    })
}

const addAssignmentButton = document.getElementById("addAssignmentBtn");

addAssignmentButton.addEventListener("click")