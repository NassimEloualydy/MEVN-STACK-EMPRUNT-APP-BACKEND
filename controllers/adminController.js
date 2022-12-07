const formidable=require('formidable');
const Admin=require('../models/Admin');
const joi=require('joi');
const fs=require('fs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
exports.hellow=(req,res)=>{
    return res.json({msg:" its enmme"});
}
exports.inscrire=(req,res)=>{
const form=new formidable.IncomingForm();
form.keepExtensions=true;
form.parse(req, async (err,fields,files)=>{
    const {nom,prenom,email,pw}=fields;
const Schema=new joi.object({
    nom:joi.string().required().messages({'string.empty':"SVP le nom est obligatoire !!",'any.required':"SVP le nom est obligatoire !!"}),
    prenom:joi.string().required().messages({'string.empty':"SVP le prenom est obligatoire !!",'any.required':"SVP le prenom est obligatoire !!"}),
    email:joi.string().required().messages({'string.empty':"SVP le email est obligatoire !!",'any.required':"SVP le email est obligatoire !!"}),
    pw:joi.string().required().messages({'string.empty':"SVP le mot de passe est obligatoire !!",'any.required':"SVP le mot de passe est obligatoire !!"}),
});

     const {error}=Schema.validate({nom,prenom,email,pw});
     if(error)
     return res.status(400).json({err:error.details[0].message});

    if(!files.photo)
    return res.status(400).json({err:"SVP la photo est obligatoire !!!"});
    var c=await Admin.find().select("-photo").and([{nom},{prenom}]);
    if(c.length!=0)
    return res.status(400).json({err:"SVP le nom et le prenom exist deja !!"});
    c=await Admin.find({email}).select("-photo");
    if(c.length!=0)
    return res.status(400).json({err:"SVP cet email exist deja !!"});
    c=await Admin.find({pw}).select("-photo");
    if(c.length!=0)
    return res.status(400).json({err:"SVP cet mot de passe exist deja !!"});
    const a=new Admin();
    a.nom=nom;
    a.prenom=prenom;
    a.email=email;
    a.pw=pw;
    a.photo.data=fs.readFileSync(files.photo.path);
    a.photo.contentType=files.photo.type;
    a.save((err,a)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({msg:"Insciption avec succes"});
    })
});
}
exports.cnx= async (req,res)=>{
    const {email,pw}=req.body;

    Admin.findOne({email}).exec((err,a)=>{
        if(err || !a)
         return res.status(400).json({err:"SVP le email est introuvable"});
         if(a.pw!=pw)
         return res.status(400).json({err:"SVP le mot de passe est uncompatible avec cet email !!"});
         const token=jwt.sign({_id:a._id},process.env.JWT_SECRETE);
         res.cookie('token',token,{expire:new Date()+800000});
         const {nom,prenom,_id}=a;
         return res.json({token,nom,prenom,_id});
    })
}
exports.getPhoto=(req,res)=>{
    const _id=req.params.id;
    Admin.findOne({_id}).exec((err,a)=>{
        if(err)
        return res.status(400).json({err});
        const {data,contentType}=a.photo;
        res.set('Content-Type',contentType);
        return res.send(data);
    })
}
exports.getCompt=(req,res)=>{
    const _id=req.params._id;
    Admin.findOne({_id}).exec((err,a)=>{
     if(err)
      return res.status(400).json({err});
      return res.json({a})
    });
}

exports.updateCompt=(req,res)=>{
    const form = new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req, async (err,fields,files)=>{
     if(err)
     return res.status(400).json({err});
     const {nom,prenom,email,pw,_id}=fields;
     const Schema=new joi.object({
        nom:joi.string().required().messages({'string.empty':"SVP le nom est obligatoire !!",'any.required':"SVP le nom est obligatoire !!"}),
        prenom:joi.string().required().messages({'string.empty':"SVP le prenom est obligatoire !!",'any.required':"SVP le prenom est obligatoire !!"}),
        email:joi.string().required().messages({'string.empty':"SVP le email est obligatoire !!",'any.required':"SVP le email est obligatoire !!"}),
        pw:joi.string().required().messages({'string.empty':"SVP le mot de passe est obligatoire !!",'any.required':"SVP le mot de passe est obligatoire !!"}),
    });
    
         const {error}=Schema.validate({nom,prenom,email,pw});
         if(error)
         return res.status(400).json({err:error.details[0].message});
    
     var c=await Admin.find().select("-photo").and([{_id:{$ne:_id}},{nom},{prenom}]);
     if(c.length!=0)
     return res.status(400).json({err:"SVP le nom et le prenom exist deja !!"});
     c=await Admin.find().select("-photo").and([{_id:{$ne:_id}},{email}]);
     if(c.length!=0)
     return res.status(400).json({err:"SVP cet email exist deja !!"});
     c=await Admin.find().select("-photo").and([{_id:{$ne:_id}},{pw}]);
     if(c.length!=0)
     return res.status(400).json({err:"SVP cet mot de passe exist deja !!"});

     Admin.findOne({_id}).exec((err,a)=>{           
        a.nom=nom;
        a.prenom=prenom;
        a.email=email;
        a.pw=pw;
        if(files.photo){
            a.photo.data=fs.readFileSync(files.photo.path);
            a.photo.contentType=files.photo.type;
        
                    }
   
                    a.save((err,a)=>{
                        if(err)
                        return res.status(400).json({err});
                        const token=jwt.sign({_id:a._id},process.env.JWT_SECRETE);
                        res.cookie('token',token,{expire:new Date()+800000});
                        const {nom,prenom,_id}=a;
                        return res.json({token,nom,prenom,_id});
               
                    })
     });
    });
}