//Create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var db;
//Connect to the database
MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database.db("mydb");
  //Start the web server
  app.listen(8080);
  console.log("Server is running at http://localhost:8080");
});
//Serve static files
app.use(express.static('public'));
//Process GET requests
app.get('/getcomments', function(req, res) {
  console.log("GET request received at /getcomments");
  //Get the comments from the "comments" collection.
  db.collection("comments").find({}).toArray(function(err, result) {
    if (err) throw err;
    //Send the result to the client as JSON.
    res.json(result);
  });
});
//Process POST requests
app.post('/postcomment', urlencodedParser, function(req, res) {
  console.log("POST request received at /postcomment");
  //Get the name and comment strings.
  var name = req.body.name;
  var comment = req.body.comment;
  //Store them in a JavaScript object.
  var commentObject = {name: name, comment: comment};
  //Insert the object into the "comments" collection.
  db.collection("comments").insertOne(commentObject, function(err, result) {
    if (err) throw err;
    console.log("1 comment inserted");
    //Send the result to the client.
    res.send("Thank you for your comment.");
  });
});
