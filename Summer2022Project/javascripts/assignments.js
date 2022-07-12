// createAssignmentBlock is designed to create a block containing
// the information needed to display it to the user.
//
// Preconditions: subjectColor is a valid CSS color, assignmentName
// is a valid length, and dueTime is of proper format
// 
// Postconditions: an EventListener is placed on the return element and
// when that element is double clicked, it is deleted from the document
//     txt document containing all assignment blocks is updated with the
// information of the current block crerated
//     id of the block is set to month/date/yyyy
//
// @param subjectColor
//        The color of the subject the assignment is for; ex. Red
// @param assignmentName
//        The name for the assignment
// @param dueTime
//        The time at which it is due; ex. 11:59pm
// @param dueDate
//        The date at which it is due; ex. 7/6/2022
//
// @return an element containg the HTML code of the block
function createAssignmentBlock(subjectColor, assignmentName, dueTime, dueDate){

    // creates the outer container to hold the text in
    const assignmentContainer = document.createElement("div");
        // sets the class names
    assignmentContainer.classList.add("container-fluid", "assignment-block-btn", "btn");
        // sets the color gradient on the left
    assignmentContainer.style.backgroundImage = `linear-gradient(to right, ${subjectColor}, ${subjectColor} 25%, transparent 25%, transparent 100%)`;
        // store the color in accent-color to be grabbed easily later
    assignmentContainer.style.accentColor = `${subjectColor}`;

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
    // add an id to the container
    let date = new Date(dueDate);
    assignmentContainer.setAttribute('id', date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear());
    // return item
    return assignmentContainer;
}

// adds the information of an assignment to local storage
// sets the key as the mm/dd/yyyy and if there is already a key at that date
//      it appends the information of this assignment to what is already there
//
// Preconditions: all the parameters are valid
// 
// Postconditions: local storage is updated with key: mm/dd/yyyy and value: ...;name|color|time
//                  ...; being any previous values under same key
//
// @param month
//        month of the assignment due date (in mm format)
// @param date
//        number date of the assignment due date (in dd format)
// @param fullYear
//        year of the assignment due date (in yyyy format)
// @param name
//        name of the assignment
// @param color
//        color of the assignment block
// @param time
//        time at which the assignment is due
//
function addBlockToStorage(month, date, fullYear, name, color, time){
    // if there is already an assignment with the same key (same day)
    if (localStorage.getItem(month.toString() + "/" + date.toString() + "/" + fullYear.toString())){
        // append this assignment to what is currently there
        localStorage.setItem(month + "/" + date + "/" + fullYear, localStorage.getItem(month + "/" + date + "/" + fullYear) + ";" + name + "|" + color + "|" + time)
    }
    // else this is the first assignment due that day
    else
        // set the key as the day and the value as the name|color|time
        localStorage.setItem(month.toString() + "/" + date.toString() + "/" + fullYear.toString(),  name + "|" + color + "|" + time);
}

// this function adds all the assignments due that day to the container block
//     corresponding to which dotw it is (ex. container block 2 for Mon. for 7/11/2022)
// 
// Preconditions: valid parameters
// 
// Postconditions: the assignments are added to the correct container
// 
// @param month
//        month of the day requested (in mm format)
// @param date
//        number date of the day requested (in dd format)
// @param fullYear
//        year of the day requested (in yyyy format)
//
function addBlockToPage(month, date, fullYear){
    // if there is assignments on the day requested
    if (!localStorage.getItem(month + "/" + date + "/" + fullYear))
        // exit out of the function
        return;
    // holds all the assignments as strings in an array
    let assignmentBlocks = localStorage.getItem(month + "/" + date + "/" + fullYear).split(";");
    // for each assignment string in the array holding them
    for (const assignmentBlock of assignmentBlocks){
        // array to hold each element of the assignment stored in the string
        let assignmentArr = assignmentBlock.split("|");
        //                       gets the correct container to display block to                          adds the HTML element returned by calling the createAssignmentBlock function
        document.getElementById("c" + new Date(month + "/" + date + "/" + fullYear).getDay()).append(createAssignmentBlock(assignmentArr[1], assignmentArr[0], assignmentArr[2], month + "/" + date + "/" + fullYear));
    }
}

// this function creates an event listener for when the form is submitted
// 
// Preconditions: the form elements id is "form"
// 
// Postconditions: event listener is created and it's listening for a submit
// 
function createFormEventListener() {
    const form = document.getElementById("form");
    if (form){
        form.addEventListener("submit", validateForm );
    }
}

// this function validates the form by making sure the entries are valid
// 
// Preconditions: the forms id is "form"
// 
// Postconditions: adds the information to local storage to elements are valid
// 
// @param event
//        the event that was submitted
//
function validateForm(event){
    var form = event.target;
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
        // checks to see if the name has a | or ;
        if (values[0].includes("|") || values[0].includes(";")){
            alert("Assignment name cannot contain '|' or ';'");
            event.preventDefault();
            // ************* reset name field ***************
            return;
        }
        // check if the color is valid
        const colors = ['red', 'blue', 'black', 'green', 'yellow', 'orange', 'purple', 'pink', 'white']
        if (!colors.includes(values[1].toLowerCase())){
            alert("Not a valid color!");
            event.preventDefault();
            // ************* reset color field ***************
            return;
        }
        // ****************** check if time is valid *********************


        // ****************** check if day is valid *********************

        // all form elements are valid so add information to storage
        let date = new Date(values[2]);
        addBlockToStorage(date.getMonth()+1, date.getDate(), date.getFullYear(), values[0], values[1].toLowerCase(), values[3]);
    }
    else{
        console.log("not a form element");
    }
};

// deletes an assignment block if it was double clicked
// 
// Preconditions: n/a
// 
// Postconditions: removes the item from local storage and removes it from the current 
//                     container block so it is no longer displayed
// 
// @param event
//        the element that was double clicked
//
function deleteAssignmentBlock (event) {
    // gets the target of the double clicks (could be a p/h6 tag or the div for those tags)
    const element = event.target;
    // if its one of the divs that was double clicked
    if (element.classList.contains("assignment-block-name") || element.classList.contains("assignment-block-time")){
        // array to hold all the assignments due that day
        assignmentsArr = localStorage.getItem(element.parentNode.id).toString().split(";");
        // if there is only one assignment that day
        if (assignmentsArr.length == 1){
            // remove from local storage
            localStorage.removeItem(element.parentNode.id);
        }
        // else if there is more than one assignment due that day
        else {
            // for every assignment due that day
            for (let i = 0; i<assignmentsArr.length; i++){
                // if that assignment has the matching name and time and color of the assignment to delete
                if (assignmentsArr[i].includes(element.parentNode.firstChild.firstChild.innerText.toString()) && assignmentsArr[i].includes(element.parentNode.lastChild.firstChild.innerText.toString().split(": ")[1]) && assignmentsArr[i].includes(element.parentNode.style.accentColor.toString())){
                    // set it to empty
                    assignmentsArr[i] = "";
                    break;
                }
            }
            // rebuild to have local storage still keep its previous items due that day
            let newAssignments = new Array();
            // for each assignment
            for (assignment of assignmentsArr){
                // if the assignment wasn't set to empty
                if (assignment != "")
                    // add that assignment back
                    newAssignments.push(assignment);
            }
            // set the assignments for that day to be what it was without the newly deleted assignment
            localStorage.setItem(element.parentNode.id, newAssignments.join(";"));
        }
        // remove the outer most div container for the assignment block
        element.parentNode.parentNode.removeChild(element.parentNode);
    }
    // if its the p tag or h6 tag text that was double clicked
    else{
        // array to hold all the assignments due that day
        assignmentsArr = localStorage.getItem(element.parentNode.parentNode.id).toString().split(";");
        // if there is only one assignment that day
        if (assignmentsArr.length == 1){
            // remove from local storage
            localStorage.removeItem(element.parentNode.parentNode.id);
        }
        // else if there is more than one assignment due that day
        else {
            // for every assignment due that day
            for (let i = 0; i<assignmentsArr.length; i++){
                // if that assignment has the matching name and time and color of the assignment to delete
                if (assignmentsArr[i].includes(element.parentNode.parentNode.firstChild.firstChild.innerText.toString()) && assignmentsArr[i].includes(element.parentNode.parentNode.lastChild.firstChild.innerText.toString().split(": ")[1]) && assignmentsArr[i].includes(element.parentNode.parentNode.style.accentColor.toString())){
                    // set it to empty
                    assignmentsArr[i] = "";
                    break;
                }
            }
            // rebuild to have local storage still keep its previous items due that day
            let newAssignments = new Array();
            // for each assignment
            for (assignment of assignmentsArr){
                // if the assignment wasn't set to empty
                if (assignment != "")
                    // add that assignment back
                    newAssignments.push(assignment);
            }
            // set the assignments for that day to be what it was without the newly deleted assignment
            localStorage.setItem(element.parentNode.parentNode.id, newAssignments.join(";"));
        }
        // remove the outer most div container for the assignment block
        element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
    }
}

// sets the numbers for the days of the week
// 
// Preconditions: d is a valid date object
// 
// Postconditions: Weekday names are set then a <br> with the day number in corresponding container block
// 
// @param d
//        represets the day for which its weeks numbers need to be set
//
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
        // displays assignments block for this day
        addBlockToPage(date.getMonth()+1, date.getDate(), date.getFullYear());
        // decrements to previous day
        date.setDate(date.getDate() - 1);
    }
    // resets to the current date
    date = new Date(d.getTime());
    // sets the day numbers for the days after the current date
    for (let i = currrentDOTWIndex + 1; i < 7; i++){
        // increments to the next day
        date.setDate(date.getDate() + 1);
        // displays assignments block for this day
        addBlockToPage(date.getMonth()+1, date.getDate(), date.getFullYear());
        // gets the element and changes the inside content
        document.getElementById("day-" + date.getDay()).innerHTML = weekdays[i] + "<br />" + date.getDate();
    }
}

// sets the month name to be either the month of the current day or the month corresponding to the
//     Wednesday of that week
// 
// Preconditions: d is valid date object
// 
// Postconditions: month is set
// 
// @param d
//        represents the day that needs its month set
//        
function setMonthName (d){
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // if we are on the default week
    if (document.getElementById("day-" + new Date().getDay()).classList.contains("current-day")){
        // sets the month name
        document.getElementById("month-name").innerHTML = months[new Date().getMonth()] + " " + new Date().getFullYear();
    }
    else{
        var date = new Date(d.getTime());
        // gets the wednesday of that week
        date.setDate(date.getDate() + (3 - date.getDay()));
        // sets the month name
        document.getElementById("month-name").innerHTML = months[date.getMonth()] + " " + date.getFullYear();
    }
}

// clears every assignment off the page
// 
// Preconditions: n/a
// 
// Postconditions: all of the container blocks for assignments is empty
// 
function clearAllBlocks(){
    for (let i = 0; i<7; i++){
        document.getElementById("c" + i).replaceChildren();
    }
}

// sets the current day backround to be blue
document.getElementById("day-" + new Date().getDay()).classList.add("current-day");

// sets the day numbers
setDayNumbers (new Date());

// sets the month name
setMonthName (new Date());

// holds the current day the screen is showing
var currentDate = new Date();

// add an event listener to the week arrows
    // left week arrow
document.getElementById("left-week-arrow").addEventListener("click", function() {
    // remove the blue background on the current day
    document.getElementById("day-" + new Date().getDay()).classList.remove("current-day");
    // sets the currentdate back one week
    currentDate.setDate(currentDate.getDate() - 7);
    // remove current blocks on the page
    clearAllBlocks();
    // set the day numbers for the new week
    setDayNumbers(currentDate);
    // if the week is the current week
    if (currentDate.getDay() == new Date().getDay() && currentDate.getFullYear() == new Date().getFullYear() && currentDate.getDate() == new Date().getDate()){
        // sets the current day backround to be blue
        document.getElementById("day-" + new Date().getDay()).classList.add("current-day");
    }
    // sets the month names
    setMonthName(currentDate);
});
    // right week arrow
document.getElementById("right-week-arrow").addEventListener("click", function() {
    // remove the blue background on the current day
    document.getElementById("day-" + new Date().getDay()).classList.remove("current-day");
    // sets the currentdate forward one week
    currentDate.setDate(currentDate.getDate() + 7);
    // remove current blocks on the page
    clearAllBlocks();
    // set the day numbers for the new week
    setDayNumbers(currentDate);
    // if the week is the current week
    if (currentDate.getDay() == new Date().getDay() && currentDate.getFullYear() == new Date().getFullYear() && currentDate.getDate() == new Date().getDate()){
        // sets the current day backround to be blue
        document.getElementById("day-" + new Date().getDay()).classList.add("current-day");
    }
    // sets the month
    setMonthName(currentDate);
});


// when the add assignment button is clicked it calls the createEventListener() function
document.getElementById("addAssignmentBtn").addEventListener("click", async function (){
    createFormEventListener();
});