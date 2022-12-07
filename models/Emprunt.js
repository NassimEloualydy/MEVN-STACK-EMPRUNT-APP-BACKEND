const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;
const empruntSchema=new mongoose.Schema({
 client:{type:ObjectId,ref:"Client",required:true},
 livre:{type:ObjectId,ref:"Livre",required:true},
 qte :{type:String,required:true},
 prix :{type:String,required:true},
 dateEmprunt :{type:String,required:true},
 dateReteur :{type:String,required:true}
},{timestamps:true});
module.exports=mongoose.model("Emprunt",empruntSchema);