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



// add a page not found

// on a post request, take the information and add it to the file
server.post("/addAssignment", function(req, res){
    addBlockToFile(req.body);
    res.redirect("/");
})

// deletes information for a user
server.post("/deleteAssignment", function(req, res){
    deleteBlockFromFile(req.body);
    res.redirect("/");
})

server.listen(port, function(error){
    if (error){
        console.log('Something went wrong',  error)
    }
    else {
        console.log('Server is listening on port ' + port);
    }
});


function addBlockToFile(formInput){
    // checks if input is empty
    if(JSON.stringify(formInput) === '{}')
        return;
    let date = new Date(convertingDateFormat(formInput.dueDate));
    let key = (date.getMonth()+1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString();
    for (let i = 0; i<assignmentEntries.length; i++){
        // if there is a key
        if (assignmentEntries[i].includes(key + "\`")){
            // added to existing key
            assignmentEntries[i] = assignmentEntries[i].concat(";" + formInput.assignName + "|" + formInput.subjectColor + "|" + formInput.dueTime);
            // add back to file
            let data = assignmentEntries.filter(Boolean).join("\r\n") + "\r\n";
            fs.writeFile(pathToDataFile, data, (err) => {
                if (err) console.log(err);
            });
            // return
            return;
        }
    }
    // if no other key there
    let data = key + "\`" + formInput.assignName + "|" + formInput.subjectColor + "|" + formInput.dueTime;
    assignmentEntries.push(data);
    fs.appendFile(pathToDataFile, data + "\r\n", (err) => {
        if (err) console.log(err);
    });
    
}

function deleteBlockFromFile(formInput){
    // checks if input is empty
    if(JSON.stringify(formInput) === '{}')
        return;
    let date = new Date(formInput.dueDate);
    let key = (date.getMonth()+1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString();
    for (let i = 0; i<assignmentEntries.length; i++){
        // see if entry matches the key
        if (assignmentEntries[i].includes(key + "\`")){
            // see if there is only one assignment
            let assignments = assignmentEntries[i].split('`')[1].split(";");
            if (assignments.length == 1){
                assignmentEntries[i] = "";
            }
            // there is more than one assignment on that day
            else{
                // for every assignment due that day
                for (let j = 0; j<assignments.length; j++){
                    // if that assignment has the matching name and time and color of the assignment to delete
                    if (assignments[j].includes(formInput.assignName) && assignments[j].includes(formInput.dueTime) && assignments[j].toLowerCase().includes(formInput.subjectColor)){
                        console.log(assignments[j])
                        assignments[j] = "";
                    }
                    let newAssignments = new Array();
                    // for each assignment
                    for (assignment of assignments){
                        // if the assignment wasn't set to empty
                        if (assignment != "")
                            // add that assignment back
                            newAssignments.push(assignment);
                    }
                    let tempArr = assignmentEntries[i].split('`');
                    tempArr[1] = newAssignments.join(";");
                    assignmentEntries[i] = tempArr.join('`');

                }
            }
            // add back to file
            let data = assignmentEntries.filter(Boolean).join("\r\n");
            if (data.length>0)
                data += "\r\n";
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