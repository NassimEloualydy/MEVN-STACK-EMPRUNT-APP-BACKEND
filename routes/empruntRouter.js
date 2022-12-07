const express=require("express");
const router=express.Router();
const {hellow,getClient,getLivre,addEmprunt,getData,deleteEmprunt,updateEmprunt,search,getNbreEmpruntClient,getNbrEmpruntLivre,getLatestAdded}=require("../controllers/empruntController");
const {requireSignIn}=require("../middlewares/auth");
router.get("/hellow",hellow);
router.post("/getClient",requireSignIn,getClient);
router.post("/getLivre",requireSignIn,getLivre);
router.post("/addEmprunt",requireSignIn,addEmprunt);
router.post("/getData/:offset",requireSignIn,getData);
router.post("/deleteEmprunt/:id",requireSignIn,deleteEmprunt);
router.post("/updateEmprunt/:_id",requireSignIn,updateEmprunt);
router.post("/search",requireSignIn,search);
router.post("/getNbreEmpruntClient",requireSignIn,getNbreEmpruntClient);
router.post("/getNbrEmpruntLivre",requireSignIn,getNbrEmpruntLivre);
router.post("/getLatestAdded",requireSignIn,getLatestAdded);
module.exports=router;

