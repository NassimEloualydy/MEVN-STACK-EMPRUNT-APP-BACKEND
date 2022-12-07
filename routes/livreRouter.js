const express=require('express');
const router=express.Router();
const {requireSignIn}=require('../middlewares/auth');
const {hellow,getAuteur,addLivre,getData,getPhoto,deleteLivre,updateLivre,searchLivre,getNbrLivreByAuteur,getNbrLivreParTheme,getLatestAdded}=require('../controllers/livreController');
router.get("/hellow",hellow);
router.post("/getAuteur/:theme",requireSignIn,getAuteur);
router.post("/addLivre",requireSignIn,addLivre);
router.post("/getData/:offset",requireSignIn,getData);
router.get("/getPhoto/:_id",getPhoto);
router.post("/deleteLivre/:_id",requireSignIn,deleteLivre);
router.post("/updateLivre/:_id",requireSignIn,updateLivre)
router.post("/searchLivre",requireSignIn,searchLivre);
router.post("/getNbrLivreByAuteur",requireSignIn,getNbrLivreByAuteur);
router.post("/getNbrLivreParTheme",requireSignIn,getNbrLivreParTheme);
router.post("/getLatestAdded",requireSignIn,getLatestAdded);
module.exports=router;

