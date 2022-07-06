// createAssignmentBlock is designed to create a block containing
// the information needed to display it to the user.
//
// Preconditions: subjectColor is a valid CSS color, assignmentName
// is a valid length, and dueTime is of proper format
// 
// Postconditions: an EventListener is placed on the return element and
// when that element is double clicked, it is deleted from the document
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
    // add an event listener
    assignmentContainer.addEventListener("dblclick", deleteAssignmentBlock);
    // return item
    return assignmentContainer;
}


// this function creates an event listener for when the form is submitted
function createFormEventListener() {
    const form = document.getElementById("form");
    if (form){
        form.addEventListener("submit", validateForm );
    }
}

// this function validates the form by making sure the entries are valid
function validateForm(event){
    const form = event.target;
    // checks to see if the element is a form element
    if (form.tagName == 'FORM' && form.id == "form"){
        const formData = new FormData(form);
        // get all the data from the form
        const values = Array.from(formData.values());
        // check if the assignment name is to long
        if (values[0].length > 256){
            alert("Assignment name too many characters (max 256)");
            event.preventDefault();
            // ************* reset name field ***************
            return;
        }
        // check if the color is valid
        const colors = ['red', 'blue', 'black', 'green', 'yellow', 'orange', 'purple', 'pink']
        if (!colors.includes(values[1].toLowerCase())){
            alert("Not a valid color!");
            event.preventDefault();
            // ************* reset color field ***************
            return;
        }
        // ****************** check if time is valid *********************


        // all form elements are valid so create the block
        const assignmentElement = createAssignmentBlock(values[0], values[1], values[2]);

        // ******************* add to correct day container *********************
        document.getElementById("c6").append(assignmentElement);
    }
    else{
        console.log("not a form element");
    }
};

// deletes an assignment block
function deleteAssignmentBlock (event) {
    // gets the target of the double clicks (could be a p/h6 tag or the div for those tags)
    const element = event.target;
    // if its one of the divs that was double clicked
    if (element.classList.contains("assignment-block-name") || element.classList.contains("assignment-block-time"))
        // remove the outer most div container for the assignment block
        element.parentNode.parentNode.removeChild(element.parentNode);
    // if its the p tag or h6 tag text that was double clicked
    else
        // remove the outer most div container for the assignment block
        element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
}

// sets the numbers for the days of the week and background for the current day
function setDayNumbers (d){
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // holds the current date
    var date = new Date(d.getTime());
    // holds the index of the current date (ex. Tuesday = 2, Sunday = 0)
    const currrentDOTWIndex = weekdays.indexOf(date.toLocaleDateString('en-us', {weekday: 'long'}));
    // sets the day numbers for the current date and the days before it
    for (let i = currrentDOTWIndex; i >= 0; i--){
        // gets the element and changes the inside content
        document.getElementById("day-" + date.getDay()).innerHTML = weekdays[i] + "<br />" + date.getDate();
        date.setDate(date.getDate() - 1);
    }
    // resets to the current date
    date = new Date(d.getTime());
    // sets the day numbers for the days after the current date
    for (let i = currrentDOTWIndex + 1; i < 7; i++){
        // increments to the next day
        date.setDate(date.getDate() + 1);
        // gets the element and changes the inside content
        document.getElementById("day-" + date.getDay()).innerHTML = weekdays[i] + "<br />" + date.getDate();
    }
}
// holds the current day the screen is showing
var currentDate = new Date();

// add an event listener to the week arrows
    // left week arrow
document.getElementById("left-week-arrow").addEventListener("click", function() {
    document.getElementById("day-" + new Date().getDay()).classList.remove("current-day");
    currentDate.setDate(currentDate.getDate() - 7);
    setDayNumbers(currentDate);
    if (currentDate.getDay() == new Date().getDay() && currentDate.getFullYear() == new Date().getFullYear() && currentDate.getDate() == new Date().getDate()){
        // sets the current day backround to be blue
        document.getElementById("day-" + new Date().getDay()).classList.add("current-day");
    }
});
    // right week arrow
document.getElementById("right-week-arrow").addEventListener("click", function() {
    document.getElementById("day-" + new Date().getDay()).classList.remove("current-day");
    currentDate.setDate(currentDate.getDate() + 7);
    setDayNumbers(currentDate);
    if (currentDate.getDay() == new Date().getDay() && currentDate.getFullYear() == new Date().getFullYear() && currentDate.getDate() == new Date().getDate()){
        // sets the current day backround to be blue
        document.getElementById("day-" + new Date().getDay()).classList.add("current-day");
    }
});


// when the add assignment button is clicked it calls the createEventListener() function
document.getElementById("addAssignmentBtn").addEventListener("click", async function (){
    createFormEventListener();
});

// sets the current day backround to be blue
document.getElementById("day-" + new Date().getDay()).classList.add("current-day");

// sets the day numbers
setDayNumbers (new Date());

// testing by manually creating the assignment blocks
const assignmentBlock = createAssignmentBlock("blue", "Speech 3", "11:15 am");
const assignmentBlock2 = createAssignmentBlock("red", "Homework 6", "12:20 pm");
const assignmentBlock3 = createAssignmentBlock("green", "Quiz 6", "11:59 pm");
const assignmentBlock4 = createAssignmentBlock("black", "WebWork HW", "11:59 pm");
document.getElementById("c3").append(assignmentBlock, assignmentBlock2, assignmentBlock3);
document.getElementById("c1").append(assignmentBlock4);

