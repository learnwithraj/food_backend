const express=require('express');
const { handleCreateUser, handleLoginuser } = require('../controllers/authController');
const router=express.Router();



router.post("/register",handleCreateUser);
router.post("/login",handleLoginuser);

module.exports=router;