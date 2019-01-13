var express = require('express');
const multer = require("multer");
var router = express.Router();
var fs = require('fs');
const uuidv1 = require('uuid/v1');

const mock=[{"id":"e35b3093-0fcf-4436-833f-5fc9fd8f550a","firstName":"Chantel","lastName":"Laurabee","birthDate":"12.07.2004","hobbies":"","photoUrl":"/img/default.png","dateCreated":"2019-01-13T20:47:58.6269067+03:00"},
{"id":"7556c681-b260-4302-bedf-3c6daa136e0f","firstName":"Mike","lastName":"Taqqu","birthDate":"24.10.2004","hobbies":"","photoUrl":"/img/default.png","dateCreated":"2019-01-13T20:47:58.6269065+03:00"},
{"id":"590f9f83-6676-4b44-9225-a6490e0794b4","firstName":"Chanelle","lastName":"Majercik","birthDate":"29.07.2004","hobbies":"","photoUrl":"/img/default.png","dateCreated":"2019-01-13T20:47:58.6269062+03:00"},
{"id":"f67106f8-965f-40b4-9bfe-20caa0c0c42c","firstName":"Amado","lastName":"D'amico","birthDate":"22.04.2004","hobbies":"","photoUrl":"/img/default.png","dateCreated":"2019-01-13T20:47:58.626906+03:00"},
{"id":"a5a55c84-4c9d-4797-a790-29d2fd03c682","firstName":"Shirleen","lastName":"D'amico","birthDate":"4.02.2004","hobbies":"","photoUrl":"/img/default.png","dateCreated":"2019-01-13T20:47:58.6269057+03:00"},
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(mock);
});

router.get('/student/:id', function(req, res, next) {
  let student=mock.find(student=>{return student.id==req.params.id});
  res.send({success:true,student:student});
});

router.post('/student/', function(req, res, next) {
  let student=mock.find(student=>{return student.id==req.body.id});
  student.firstName=req.body.firstName;  
  student.lastName=req.body.lastName;  
  student.birthDate=req.body.birthDate;  
  student.hobbies=req.body.hobbies;  
  student.dateCreated=req.body.dateCreated;  
  student.photoUrl=req.body.photoUrl;  
  res.send({success:true, message : "Student is updated."});
});

router.post('/newstudent/', function(req, res, next) {
  let newStudent=req.body;
  newStudent.id=uuidv1();
  mock.push(newStudent);
  res.send({success:true, message : "Student is added."});
});

var storage = multer.diskStorage({
  destination: __dirname+ '/../public/images/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + uuidv1()+".png")
  }
})

const upload = multer({ storage: storage })

router.post('/SaveProfilePicture/',
upload.single("image"),
function(req, res, next) {
  const tempPath = req.file.path;
  res.send({success:true,url:"http://"+req.get('host')+"/images/"+req.file.filename});
});

router.delete('/delete/:id', function(req, res, next) {
  console.log(req.params.id);
  
  let studentIndex=mock.findIndex(student=>student.id==req.params.id);
  console.log("studentIndex:"+studentIndex);
  if (studentIndex > -1) {
    mock.splice(studentIndex, 1);
  }
  res.send({success:true});
});

module.exports = router;
