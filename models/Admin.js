const mongoose =require('mongoose');
const adminSchema=new mongoose.Schema({
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    email:{type:String,required:true},
    pw:{type:String,required:true},
    photo:{data:Buffer,contentType:String}
},{timestamps:true});
module.exports=mongoose.model('Admin',adminSchema);