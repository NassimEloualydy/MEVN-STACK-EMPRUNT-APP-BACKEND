const mongoose=require('mongoose');
const auteurSchema=new mongoose.Schema({
    photo:{data:Buffer,contentType:String},
    cni:{type:String,required:true},
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    datNaissance:{type:String,required:true},
    sexe:{type:String,required:true},
    theme:{type:String,required:true},
},{timestamps:true});
module.exports=mongoose.model("Auteur",auteurSchema);
