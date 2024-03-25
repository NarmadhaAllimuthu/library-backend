
var express = require('express');
const { userCreation } = require('../Models/userModels');
var router = express.Router();
const bcrypt = require('bcrypt');
const { Reader } = require('../Models/readerModels');
const auth = require('../authorization');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', async function (req, res, next) {

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const hashConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);

    const checkUser = await userCreation.find({ userFirstName: req.body.userFirstName });
    const checkUser2 = await userCreation.find({ userFirstName: req.body.userLastName });

    if (checkUser.length > 0 || checkUser2.length > 0) {
      res.status(401).json({ message: "User already exists. Change data to register." });
    }

    else if (hashPassword === hashConfirmPassword) {
      req.body.password = hashPassword
      req.body.confirmPassword = hashPassword
      const { userFirstName, userLastName, emailId, password, confirmPassword } = req.body;
      const newuserCreation = new userCreation({
        userFirstName,
        userLastName,
        emailId,
        password,
        confirmPassword
      });
      const registeredUser = await newuserCreation.save();
      console.log(registeredUser);
      res.status(201).send("Registered successfully !");


    } else {
      res.json({ message: "Passwords do not match" });

    }
  } catch (error) {
    console.log("Error", error);
    res.json({ message: "Something went wrong" });
  }

});



router.post('/login', async (req, res) => {
  try {
    const user = await userCreation.findOne({ emailId: req.body.emailId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      console.log(token);

      user.token = token;
      await user.save();

      res.json({ token, user, message: "Login Successfully" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});




router.post("/createReader" ,auth,async(req,res)=>{
  try{

      const existingreader = await Reader.findOne({readerName:req.body.readerName});
      if(existingreader){
          res.status(400).json({message:"reader already exists"});
      } else{
          const {readerName,readerAddress,readerContact} = req.body;

          const readerId = "C" + (await Reader.countDocuments() + 1)+"ID";

          const newreader = new Reader({
              readerId,
              readerName,
              readerAddress
              ,readerContact
          })
          const result = await newreader.save();
          res.status(200).json({message:"reader created successfully"});

      }

  }catch(err){

      console.log(err);
      res.status(500).json({message:err.message});
  
  }
})











module.exports = router;
