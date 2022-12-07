const livre=require('../models/Livre');
const Auteur=require('../models/Auteur');
const formidable=require('formidable');
const joi=require('joi');
const Livre = require('../models/Livre');
const fs=require('fs');
exports.hellow=(req,res)=>{
    return res.json({msg:"hellow"});
}
exports.getAuteur=(req,res)=>{
    const theme=req.params.theme;
    Auteur.find({theme}).select("-photo").exec((err,auteurs)=>{
        if(err)
         return res.status(400).json({err});
         return res.json({auteurs});
    })
}
exports.addLivre=(req,res)=>{
 const form=new formidable.IncomingForm();
 form.keepExtensions=true;
 form.parse(req,async (err,fields,files)=>{
   
   if(!files.photo)
   return res.status(400).json({err:"SVP la photo est obligatoire !!"});
   const {dateEdition,auteur,code,desi,prix,qte,theme}=fields;
  const schema=new joi.object({
      code:joi.string().required().messages({"string.empty":"SVP le code et obligatoire !!","any.required":"SVP le code et obligatoire !!"}),
      desi:joi.string().required().messages({"string.empty":"SVP la designation et obligatoire !!","any.required":"SVP la designation et obligatoire !!"}),
      qte:joi.string().required().pattern( /^\d+$/).messages({"string.empty":"SVP la qentite et obligatoire !!","any.required":"SVP la qentiter et obligatoire !!","string.pattern.base":"SVP la qentiter doit etr un chiffre !!"}),
      prix:joi.string().required().pattern( /^\d+$/).messages({"string.empty":"SVP le prix est obligatoire  !!","any.required":"SVP le prix et obligatoire !!","string.pattern.base":"svp le prix doit etre un entier !!"}),
      dateEdition:joi.string().required().messages({"string.empty":"SVP la date d'edition et obligatoire !!","any.required":"SVP la date d'edition et obligatoire !!"}),
      theme:joi.string().required().messages({"string.empty":"SVP le theme et obligatoire !!","any.required":"SVP le theme et obligatoire !!"}),
    auteur:joi.string().required().messages({"string.empty":"SVP l'auteur et obligatoire !!","any.required":"SVP l'auteur et obligatoire !!"}),
  });
  const {error}=schema.validate({dateEdition,auteur,code,desi,prix,qte,theme}); 
  if(error)
  return res.status(400).json({err:error.details[0].message});
  var c=await Livre.find({code}).select("-photo");
  if(c.length!=0)
  return res.status(400).json({err:"cet code exist deja !!"});
  c=await Livre.find({desi}).select("-photo");
  if(c.length!=0)
  return res.status(400).json({err:"SVP cet designation exisr deja !!"});
  l=new Livre();
  l.code=code;
  l.desi=desi;
  l.qte=qte;
  l.prix=prix; 
  l.dateEdition=dateEdition;
  l.theme=theme;
  l.auteur=auteur;
  l.photo.data=fs.readFileSync(files.photo.path);
  l.photo.contentType=files.photo.type;
  l.save((err,l)=>{
    if(err) return res.status(400).json({err});
    return res.json({msg:"Livre Ajouter avec success !!"});
  })
});

}
exports.getData=(req,res)=>{
   const offset=req.params.offset;
   Livre.find().populate([
    {
      path:"auteur",
      model:"Auteur",
      select :["-photo"]
    }
   ]).select("-photo").limit(5).skip(offset).exec((err,livres)=>{
    if(err)
    return res.status(400).json({err});
    return res.json({livres});
   })
}
exports.getPhoto=(req,res)=>{
  const _id=req.params._id;
  Livre.findOne({_id}).exec((err,l)=>{
    if(err)
     return res.status(400).json({err});
     const {data,contentType}=l.photo;
     res.set("contentType",contentType);
     return res.send(data);
  });
}
exports.deleteLivre=(req,res)=>{
  const _id=req.params._id;
  Livre.findOne({_id}).exec((err,l)=>{
    if(err)
    return res.status(400).json({err});
    l.remove((err,l)=>{
      if(err)
    return res.status(400).json({err});
    return res.json({msg:"Supprimer avec success !!"});
    })
  })
}
exports.updateLivre=(req,res)=>{
  const form=new formidable.IncomingForm();
  form.keepExtensions=true;
  form.parse(req,async (err,fields,files)=>{
    const {dateEdition,auteur,code,desi,prix,qte,theme}=fields;
    const _id=req.params._id;
    const schema=new joi.object({
        code:joi.string().required().messages({"string.empty":"SVP le code et obligatoire !!","any.required":"SVP le code et obligatoire !!"}),
        desi:joi.string().required().messages({"string.empty":"SVP la designation et obligatoire !!","any.required":"SVP la designation et obligatoire !!"}),
        qte:joi.string().required().pattern( /^\d+$/).messages({"string.empty":"SVP la qentite et obligatoire !!","any.required":"SVP la qentiter et obligatoire !!","string.pattern.base":"SVP la qentiter doit etr un chiffre !!"}),
        prix:joi.string().required().pattern( /^\d+$/).messages({"string.empty":"SVP le prix est obligatoire  !!","any.required":"SVP le prix et obligatoire !!","string.pattern.base":"svp le prix doit etre un entier !!"}),
        dateEdition:joi.string().required().messages({"string.empty":"SVP la date d'edition et obligatoire !!","any.required":"SVP la date d'edition et obligatoire !!"}),
        theme:joi.string().required().messages({"string.empty":"SVP le theme et obligatoire !!","any.required":"SVP le theme et obligatoire !!"}),
      auteur:joi.string().required().messages({"string.empty":"SVP l'auteur et obligatoire !!","any.required":"SVP l'auteur et obligatoire !!"}),
    });
    const {error}=schema.validate({dateEdition,auteur,code,desi,prix,qte,theme}); 
    if(error)
    return res.status(400).json({err:error.details[0].message});
    var c=await Livre.find().select("-photo").and([{_id:{$ne:_id}},{code}]); 
    if(c.length!=0)
    return res.status(400).json({err:"SVP le code exist deja !!"});
    c=await Livre.find().select("-photo").and([{_id:{$ne:_id}},{desi}]);
    if(c.length!=0)
    return res.status(400).json({err:"SVP cet designation deja !!"});
    Livre.findOne({_id}).exec((err,l)=>{
      if(err)
       return res.status(400).json({err});
       l.code=code;
       l.desi=desi;
       l.qte=qte;
       l.prix=prix; 
       l.dateEdition=dateEdition;
       l.theme=theme;
       l.auteur=auteur;
       if(files.photo){
         l.photo.data=fs.readFileSync(files.photo.path);
         l.photo.contentType=files.photo.type;
        }
      l.save((err,l)=>{
        if(err)
         return res.status(400).json({err});
         return res.json({msg:"Moddifier avec succes !!"});
      })     
    }); 
  });
}
exports.searchLivre= async (req,res)=>{
  const {code,desi,qte,prix,dateEdition,theme,cni,nom,prenom,datNaissance,sexe}=req.body;
  const searchQuery={};
  const livres=await Livre.aggregate([{
    $lookup:{
      from:"auteurs",
      localField:"auteur",
      foreignField:"_id",
      as:"auteur"
    }
  },{
    $project:{
      "_id":1,
      "code":1,
      "desi":1,
      "qte":1,
      "prix":1,
      "dateEdition":1,
      "theme":1,
      "auteur.nom":1,
      "autuer._id":1,
      "auteur.cni":1,
      "auteur.prenom":1,
      "auteur.datNaissance":1,
      "auteur.sexe":1
    }
  },{
    $match:{
      "code":{$regex:'.*'+code+'.*',$options:'i'},
      "desi":{$regex:'.*'+desi+'.*',$options:'i'},
      "qte":{$regex:'.*'+qte+'.*',$options:'i'},
      "prix":{$regex:'.*'+prix+'.*',$options:'i'},
      "dateEdition":{$regex:'.*'+dateEdition+'.*',$options:'i'},
      "theme":{$regex:'.*'+theme+'.*',$options:'i'},
      "auteur.nom":{$regex:'.*'+nom+'.*',$options:'i'},
      "auteur.cni":{$regex:'.*'+cni+'.*',$options:'i'},
      "auteur.prenom":{$regex:'.*'+prenom+'.*',$options:'i'},
      "auteur.datNaissance":{$regex:'.*'+datNaissance+'.*',$options:'i'},
      "auteur.sexe":{$regex:'.*'+sexe+'.*',$options:'i'},
    }
  }
])  ;
  return res.json({livres});
}
exports.getNbrLivreByAuteur=(req,res)=>{
  Livre.aggregate([{
    $group:{_id:{auteur:"$auteur"},count:{$sum:1}}
  },
  {
    $lookup:{
      from:"auteurs",
      localField:"_id.auteur",
      foreignField:"_id",
      as:"auteur"
    }
  }
]).exec((err,list)=>{
    if(err)
    return res.status(400).json({err});
    return res.json({list});
  })
}
exports.getNbrLivreParTheme=(req,res)=>{
  Livre.aggregate([{
    $group:{_id:{theme:"$theme"},count:{$sum:1}}
  }]).exec((err,list)=>{
    if(err)
     return res.status(400).json({err});
     return res.json({list});
  })
}
exports.getLatestAdded=(req,res)=>{
  Livre.find().select("-photo").limit(5).skip(0).sort([["createdAt","desc"]]).exec((err,list)=>{
     if(err) 
     return res.status(400).json({err});
     console.log(list);
     return res.json({list});
  });
}