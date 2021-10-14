//change the color to just take the name of the subject, and correspond that to the color

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
  //creates the outer container to hold the text in
  const divBlock = document.createElement("div");
  divBlock.classList.add("container-fluid", "assignment-block-btn", "btn");
  divBlock.style.backgroundImage = `linear-gradient(to right, ${subjectColor}, ${subjectColor} 25%, transparent 25%, transparent 100%)`;

  //holds the HTML of the name of the assignment
  const h6AssignmentName = document.createElement("h6");
  h6AssignmentName.classList.add("assignment-block-name");
  h6AssignmentName.append(assignmentName);

  //holds the HTML of the due time
  const pDueTime = document.createElement("p");
  pDueTime.classList.add("assignment-block-date");
  pDueTime.innerText = "Complete by: " + dueTime;

  //add those elements to the container block and return it
  divBlock.append(h6AssignmentName, pDueTime);
  return divBlock;
}

const assignmentBlock = createAssignmentBlock("red", "Assignment Name", "11:59 pm");
const assignmentBlock2 = createAssignmentBlock("blue", "Assignment Name 2", "11:15 am");
const assignmentBlock3 = createAssignmentBlock("#00FF00", "Assignment Name Super Long", "11:59 pm");
document.getElementById("assignment-block-container").append(assignmentBlock, assignmentBlock2, assignmentBlock3);
