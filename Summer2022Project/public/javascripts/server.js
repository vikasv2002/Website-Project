// need npm install express, ejs, body-parser --save
// used npm install -g nodemon

// declare variables
var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var fs = require("fs");
const path = require('path');
// string variable representing path to data.txt file
const pathToDataFile = path.join(__dirname, '..', 'files', 'data.txt');
const port = 3000;
server.use(express.static("public"));
server.use(bodyParser.urlencoded({extended: true}));
server.use(express.json({limit: "1mb"}))
// array to hold assignment entries
var assignmentEntries;

// reads the file and populates assignmentEntries array
fs.readFile(pathToDataFile, 'utf-8', (err, data) => {
    assignmentEntries = data.split("\r\n");
})

// loads home page
server.get("/", function(req, res){
    res.render("index.ejs");
})

// loads login page
server.get("/login", function(req, res){
    res.render("loginPage.ejs");
})

// loads register page
server.get("/register", function(req, res){
    res.send("loginPage.ejs");
})

//  ************** add a page not found

// on a post request, take the information and add it to the file
server.post("/addAssignment", function(req, res){
    addBlockToFile(req.body);
    // send you back to the home page
    res.redirect("/");
})

// deletes information for a user
server.post("/deleteAssignment", function(req, res){
    deleteBlockFromFile(req.body);
    // send you back to the home page
    res.redirect("/");
})

// has the application listen on the port provided
server.listen(port, function(error){
    // if there was an error, display it to console
    if (error){
        console.log('Something went wrong',  error)
    }
    // else, log what port the server is listening on
    else {
        console.log('Server is listening on port ' + port);
    }
});

// this function adds an assignment block to the file storing all the assignment
// block information
//
// Preconditions: formInput is either empty or valid data
//
// Postconditions: data.txt is updated with the information provided with the param formInput
//
// @param formInput
//        the body of the POST request
// 
function addBlockToFile(formInput){
    // checks if input is empty
    if(JSON.stringify(formInput) === '{}')
        return;
    // store the date
    let date = new Date(convertingDateFormat(formInput.dueDate));
    // store the key
    let key = (date.getMonth()+1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString();
    // for every assignment the user has
    for (let i = 0; i<assignmentEntries.length; i++){
        // check if the key of the new assignment matches the key of a prexisting block
        if (assignmentEntries[i].includes(key + "\`")){
            // added to existing key
            assignmentEntries[i] = assignmentEntries[i].concat(";" + formInput.assignName + "|" + formInput.subjectColor + "|" + formInput.dueTime);
            // set data to all the entries
            let data = assignmentEntries.filter(Boolean).join("\r\n") + "\r\n";
            // add back to file
            fs.writeFile(pathToDataFile, data, (err) => {
                if (err) console.log(err);
            });
            // return
            return;
        }
    }
    // if no other assignment has the same key
    let data = key + "\`" + formInput.assignName + "|" + formInput.subjectColor + "|" + formInput.dueTime;
    // add the new assignment to the assignmentsEntries arr
    assignmentEntries.push(data);
    // append it to the file
    fs.appendFile(pathToDataFile, data + "\r\n", (err) => {
        if (err) console.log(err);
    });
    
}

// this function deletes an assignment block from the file
//
// Preconditions: formInput is either empty or valid data
//
// Postconditions: data.txt is updated by removing the data provided by the param formInput
//
// @param formInput
//        the body of the POST request
// 
function deleteBlockFromFile(formInput){
    // checks if input is empty
    if(JSON.stringify(formInput) === '{}')
        return;
    // holds the date
    let date = new Date(formInput.dueDate);
    // stores the key
    let key = (date.getMonth()+1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString();
    // for every assignment the user has
    for (let i = 0; i<assignmentEntries.length; i++){
        // check if the key of the new assignment matches the key of a prexisting block
        if (assignmentEntries[i].includes(key + "\`")){
            // holds all the assignments for that key (day)
            let assignments = assignmentEntries[i].split('`')[1].split(";");
            // if there is only
            if (assignments.length == 1){
                // remove that entry
                assignmentEntries[i] = "";
            }
            // else, if there is more than one assignment on that day
            else{
                // for every assignment due that day
                for (let j = 0; j<assignments.length; j++){
                    // if that assignment has the matching name and time and color of the assignment to delete
                    if (assignments[j].includes(formInput.assignName) && assignments[j].includes(formInput.dueTime) && assignments[j].toLowerCase().includes(formInput.subjectColor)){
                        // delete that assignment
                        assignments[j] = "";
                    }
                }
                // an array to hold the new list of assignments for that day
                let newAssignments = new Array();
                // for each assignment
                for (assignment of assignments){
                    // if the assignment wasn't set to empty
                    if (assignment != "")
                        // add that assignment back
                        newAssignments.push(assignment);
                }
                // temp arr hold the line of data for that key (day), split on the key
                let tempArr = assignmentEntries[i].split('`');
                // tempArr[0] = key, tempArr[1] = assignment data      (thus we want to join on the post-deletion data)
                tempArr[1] = newAssignments.join(";");
                // set that entry to be the key with the updated post-deletion data
                assignmentEntries[i] = tempArr.join('`');
            }
            // data holds updated data
            let data = assignmentEntries.filter(Boolean).join("\r\n");
            // makes sure if data file is blank, it doesnt add another new line
            if (data.length>0)
                data += "\r\n";
            // updates file with new data
            fs.writeFile(pathToDataFile, data, (err) => {
                if (err) console.log(err);
            });
            return;

        }
    }
}

// converts yyyy-mm-dd to mm/dd/yyyy format
// 
// Preconditions: n/a
// 
// Postconditions: n/a
// 
// @param oldDateStr
//        the string of the day in the old format (yyyy-mm-dd)
// 
// @return returns a string in the new format (mm/dd/yyyy)
function convertingDateFormat (oldDateStr){
    dateArr = oldDateStr.split('-');
    dateArr.push(dateArr.shift());
    return dateArr.join("/");
}