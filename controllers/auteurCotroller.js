const Auteur=require('../models/Auteur');
const formidable=require('formidable');
const joi=require('joi');
const fs=require('fs');
const { syncBuiltinESMExports } = require('module');
exports.hellow=(req,res)=>{
    return res.json({msg:"Hellow"});
}
exports.addAuteur= (req,res)=>{
const form=new formidable.IncomingForm();
form.keepExtensions=true;
form.parse(req,async (err,fields,files)=>{
   if(!files.photo)       
   return res.status(400).json({err:"SVP la photo est obligatoire !!"});

   const {cni,nom,prenom,datNaissance,sexe,theme}=fields;
   
   const schema=new joi.object({
    cni:joi.string().required().messages({"any.required":"SVP le cni est obligatoire !!","string.empty":"SVP le cni est obligatoire !!"}),
    nom:joi.string().required().messages({"any.required":"SVP le nom est obligatoire !!","string.empty":"SVP le nom est obligatoire !!"}),
    prenom:joi.string().required().messages({"any.required":"SVP le prenom est obligatoire !!","string.empty":"SVP le prenom est obligatoire !!"}),
    datNaissance:joi.string().required().messages({'any.required':"SVP la date de naissance est obligatoire !!",'string.empty':"SVP la date de naissance est obligatoire !!"}),
    sexe:joi.string().required().messages({"any.required":"SVP le sexe est obligatoire !!","string.empty":"SVP le sexe est obligatoire !!"}),
    theme:joi.string().required().messages({"any.required":"SVP le theme est obligatoire !!","string.empty":"SVP le theme est obligatoire !!"})
   });
   const {error}=schema.validate({cni,nom,prenom,datNaissance,sexe,theme});
   if(error)
    return res.status(400).json({err:error.details[0].message});
    var c=await Auteur.find({cni}).select("-photo");
    if(c.length!=0)
    return res.status(400).json({err:"SVP cet cni exit deja !!"});
    c=await Auteur.find().select("-photo").and([{nom},{prenom}]);
    if(c.length!=0)
    return res.status(400).json({err:"SVP le nom et le prenom exist deja !!"});
    const a=new Auteur();
    a.nom=nom;
    a.cni=cni;
    a.prenom=prenom;
    a.datNaissance=datNaissance;
    a.sexe=sexe;
    a.theme=theme;
    a.datNaissance=datNaissance;
    a.photo.data=fs.readFileSync(files.photo.path);
    a.photo.contentType=files.photo.type;
    a.save((err,a)=>{
        if(err)
         return res.status(400).json({err});
         return res.json({msg:"Ajouter avec success !!"});
    })
});
}
exports.getData=(req,res)=>{
    const offset=req.params.offset;
    Auteur.find().select("-photo").skip(offset).limit(5).exec((err,auteurs)=>{
        if(err) 
        return res.status(400).json({err});
        return res.json({auteurs});
    })
}
exports.getPhoto=(req,res)=>{
    const _id=req.params._id;
    Auteur.findOne({_id}).exec((err,a)=>{
       if(err)
       return res.status(400).json({err});
       const {data,contenType}=a.photo;
       res.set("contentType",contenType);
       return res.send(data);
    });
}
exports.deleteAuteur=(req,res)=>{
    const _id=req.params._id;
    Auteur.findOne({_id}).exec((err,a)=>{
        if(err)
         return res.status(400).json({err});
         a.remove((err,a)=>{
            if(err)
            return res.status(400).json({err});
            return res.json({msg:"supprimer avec success !!"});
         })
    })
}
exports.updateAuteur=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,async (err,fields,files)=>{
        if(err)
        return res.status(400).json({err});
        const {cni,nom,prenom,datNaissance,sexe,theme}=fields;
        const _id=req.params._id; 
        const schema=new joi.object({
         cni:joi.string().required().messages({"any.required":"SVP le cni est obligatoire !!","string.empty":"SVP le cni est obligatoire !!"}),
         nom:joi.string().required().messages({"any.required":"SVP le nom est obligatoire !!","string.empty":"SVP le nom est obligatoire !!"}),
         prenom:joi.string().required().messages({"any.required":"SVP le prenom est obligatoire !!","string.empty":"SVP le prenom est obligatoire !!"}),
         datNaissance:joi.string().required().messages({'any.required':"SVP la date de naissance est obligatoire !!",'string.empty':"SVP la date de naissance est obligatoire !!"}),
         sexe:joi.string().required().messages({"any.required":"SVP le sexe est obligatoire !!","string.empty":"SVP le sexe est obligatoire !!"}),
         theme:joi.string().required().messages({"any.required":"SVP le theme est obligatoire !!","string.empty":"SVP le theme est obligatoire !!"})
        });
        const {error}=schema.validate({cni,nom,prenom,datNaissance,sexe,theme});
        if(error)
         return res.status(400).json({err:error.details[0].message});
         var c= await Auteur.find().select("-photo").and([{_id:{$ne:_id}},{cni}]);
         if(c.length!=0)
        return res.status(400).json({err:"SVP cet cni exist deja !!"});
          c=await Auteur.find().select("-photo").and([{nom},{prenom},{_id:{$ne:_id}}]);
        if(c.length!=0)
        return res.status(400).json({err:"SVP le nom et le prenom exsit deja !!"});
        Auteur.findOne({_id}).exec((err,a)=>{
         if(err)
          return res.status(400).json({err});
          a.nom=nom;
          a.cni=cni;
          a.prenom=prenom;
          a.datNaissance=datNaissance;
          a.sexe=sexe;
          a.theme=theme;
          a.datNaissance=datNaissance;
          if(files.photo){
              a.photo.data=fs.readFileSync(files.photo.path);
              a.photo.contentType=files.photo.type;
          }
         a.save((err,a)=>{
            if(err)
             return res.status(400).json({err});
             return res.json({msg:"Moddifier avec success "});
         })      
        });
     
    });
}
exports.searchAuteur=(req,res)=>{
    const {cni,nom,prenom,datNaissance,sexe,theme}=req.body;
    const searchQuery={};
    searchQuery.cni={$regex:'.*'+cni+'.*',$options:'i'};
    searchQuery.nom={$regex:'.*'+nom+'.*',$options:'i'};
    searchQuery.prenom={$regex:'.*'+prenom+'.*',$options:'i'};
    searchQuery.datNaissance={$regex:'.*'+datNaissance+'.*',$options:'i'};
    searchQuery.sexe={$regex:'.*'+sexe+'.*',$options:'i'};
    searchQuery.theme={$regex:'.*'+theme+'.*',$options:'i'};
    Auteur.find(searchQuery).select("-photo").exec((err,auteurs)=>{
        if(err)
         return res.status(400).json({err});
         return res.json({auteurs});
    })
}
exports.latestAddAuteur=(req,res)=>{
    Auteur.find().select("-photo").limit(4).skip(0).sort([["createdAt","desc"]]).exec((err,auteurs)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({auteurs});
    });
}
exports.getNbrAuteurParTheme=(req,res)=>{
    Auteur.aggregate([{
        $group:{_id:{theme:"$theme"},count:{$sum:1}}
    }]).exec((err,auteurs)=>{
       if(err)
        return res.status(400).json({err});
        return res.json({auteurs});
    });
}