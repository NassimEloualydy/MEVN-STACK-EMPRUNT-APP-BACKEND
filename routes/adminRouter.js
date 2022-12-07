const express=require('express');
const route=express.Router();
const {requireSignIn}=require("../middlewares/auth");
const {hellow,getPhoto,inscrire,cnx,getCompt,updateCompt}=require('../controllers/adminController');
route.post("/hellow",hellow);
route.post("/inscrire",inscrire);
route.post("/cnx",cnx);
route.get("/getPhoto/:id",getPhoto);
route.post("/getCompt/:_id",requireSignIn,getCompt);
route.post("/updateCompt/:_id",requireSignIn,updateCompt);
module.exports=route;
