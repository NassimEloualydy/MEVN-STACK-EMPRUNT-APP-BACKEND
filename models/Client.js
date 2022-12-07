const mongoose=require('mongoose');
const clientSchema=new mongoose.Schema({
    cni:{type:String,required:true},
    photo:{data:Buffer,contentType:String},
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    email:{type:String,required:true},
    tel:{type:String,required:true},
    adresse:{type:String,required:true},
    sexe:{type:String,required:true},
    priorite:{type:String,required:true}
},{
    timestamps:true
});
module.exports=mongoose.model("Client",clientSchema);