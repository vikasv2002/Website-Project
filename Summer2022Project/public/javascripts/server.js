var express = require("express");
var server = express();
const port = 3000;

server.use(express.static("public"));

server.get("/", function(req, res){
    res.render("index.ejs");
})

server.listen(port, function(error){
    if (error){
        console.log('Something went wrong',  error)
    }
    else {
        console.log('Server is listening on port ' + port);
    }
});