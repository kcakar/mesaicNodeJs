const express = require('express');
const multer = require("multer");
const router = express.Router();
const uuidv1 = require('uuid/v1');

const db=require('./../helpers/db');

//storage info for avatar images
var storage = multer.diskStorage({
  destination: __dirname+ '/../public/images/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + uuidv1()+".png")
  }
})
const upload = multer({ storage: storage })


/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log("REQUEST HERE")
  try{
    db.getStudents((error,results)=>{
      if(!error)
      {
        res.send(results);
      }
      else{
        res.send([]);
      }
    })
  }
  catch(ex)
  {
    res.send([]);
  }
});

// GET A SINGE STUDENT
router.get('/student/:id', function(req, res, next) {
  // let student=mock.find(student=>{return student.id==req.params.id});
  console.log("REQUEST HERE")
  try{
    db.getStudent(req.params.id,(error,result)=>{
      if(!error)
      {
        res.send({success:true,student:result});
      }
      else{
        res.send({success:false,student:{}});
      }
    })
  }
  catch(ex)
  {
    res.send({success:false,student:{}});
  }
});

//UPDATE A STUDENT
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

//ADD A STUDENT
router.post('/newstudent/', function(req, res, next) {
  let newStudent=req.body;
  newStudent.id=uuidv1();
  mock.push(newStudent);
  res.send({success:true, message : "Student is added."});
});

//UPLOAD AN AVATAR
router.post('/SaveProfilePicture/',upload.single("image"),function(req, res, next) {
  const tempPath = req.file.path;
  res.send({success:true,url:"http://"+req.get('host')+"/images/"+req.file.filename});
});

//DELETE A STUDENT
router.delete('/delete/:id', function(req, res, next) {
  console.log("DELETE REQUEST HERE")
  try{
    db.deleteStudent(req.params.id,(error)=>{
      if(!error)
      {
        res.send({success:true});
      }
      else{
        res.send({success:false});
      }
    })
  }
  catch(ex)
  {
    res.send({success:false});
  }
});

module.exports = router;
