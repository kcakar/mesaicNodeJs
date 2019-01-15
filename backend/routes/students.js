const express = require('express');
const multer = require("multer");
const router = express.Router();
const uuidv1 = require('uuid/v1');

const db=require('./../helpers/db');
const studentModel= require('./../models/studentModel');


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
    })
  }
  catch(ex)
  {
    res.send({success:false,student:{}});
  }
});

//ADD A STUDENT
router.post('/newstudent/', function(req, res, next) {
  console.log("ADD REQUEST HERE")
  try{
    let newStudent=req.body;
    newStudent.id=uuidv1(); //generating id for the new student

    const checkResult=studentModel.checkStudentModel(newStudent);     //checking if student has the required fields filled.
    console.log(checkResult);
    if(!checkResult.isError)
    {
      db.addStudent(newStudent,(error)=>{
        if(!error)
        {
          res.send({success:true, message : "Student is added.",id:newStudent.id});
        }
      });
    }
    else{
      res.send({success:false, message : "Could not add the student.\n"+checkResult.errorMessage});
    }
  }
  catch(ex)
  {
    console.log(ex)
    res.send({success:false, message : "Could not add the student."});
  }
});

//UPLOAD AN AVATAR
router.post('/SaveProfilePicture/',upload.single("image"),function(req, res, next) {
  const tempPath = req.file.path;
  res.send({success:true,url:"http://"+req.get('host')+"/images/"+req.file.filename});
});

//UPDATE A STUDENT
router.post('/student/', function(req, res, next) {
  console.log("UPDATE REQUEST HERE")
  try{
    db.editStudent(req.body,(error)=>{
      if(!error)
      {
        res.send({success:true, message : "Student is updated."});
      }
    })
  }
  catch(ex)
  {
    res.send({success:false, message : "Could not update the student."});
  }
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
    })
  }
  catch(ex)
  {
    res.send({success:false});
  }
});

module.exports = router;
