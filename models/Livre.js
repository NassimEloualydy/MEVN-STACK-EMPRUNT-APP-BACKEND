const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;
const livreSchema=new mongoose.Schema({
    photo:{data:Buffer,contentType:String},
    code :{type:String,required:true},
    desi :{type:String,required:true},
    qte :{type:String,required:true},
    prix :{type:String,required:true},
    theme :{type:String,required:true},
    dateEdition :{type:String,required:true},
    auteur :{type:ObjectId,ref:"Auteur",required:true}
},{timestamps:true});
module.exports=mongoose.model("livre",livreSchema);
