const express=require('express');
const router=express.Router();
const {hellow,addAuteur,getData,getPhoto,deleteAuteur,updateAuteur,searchAuteur,latestAddAuteur,getNbrAuteurParTheme}=require('../controllers/auteurCotroller');
const {requireSignIn}=require("../middlewares/auth");
router.get("/hellow",requireSignIn,hellow);
router.post("/addAuteur",requireSignIn,addAuteur);
router.post("/getData/:offset",requireSignIn,getData);
router.get("/getPhoto/:_id",getPhoto);
router.post("/deleteAuteur/:_id",requireSignIn,deleteAuteur);
router.post("/updateAuteur/:_id",requireSignIn,updateAuteur);
router.post("/searchAuteur",requireSignIn,searchAuteur);
router.post("/latestAddAuteur",requireSignIn,latestAddAuteur);
router.post("/getNbrAuteurParTheme",requireSignIn,getNbrAuteurParTheme);
module.exports=router;

