const Emprunt=require('../models/Emprunt');
const Client=require("../models/Client");
const Livre=require("../models/Livre");
const joi=require("joi");
exports.hellow=(req,res)=>{
    return res.json({msg:"Hellow"});
}
exports.getClient=(req,res)=>{
    Client.find().select("-photo").exec((err,l)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({l});
    })
}
exports.getLivre=(req,res)=>{
   Livre.find().select("-photo").exec((err,l)=>{
    if(err)
     return res.status(400).json({err});
     return res.json({l});
   })
}
exports.addEmprunt= async (req,res)=>{
    var {client,livre,dateEmprunt,dateReteur,qte,prix}=req.body;
     qte=String(qte);
     prix=String(prix);
    const schema=joi.object({
     client:joi.string().required().messages({"any.required":"SVP le client est obligatoire !!","string.empty":"SVP le client est obligatoire !!"}),
     livre:joi.string().required().messages({"any.required":"SVP le livre est obligatoire !!","string.empty":"SVP le livre est obligatoire !!"}),
     dateEmprunt:joi.string().required().messages({"any.required":"SVP la date d'emprunt est obligatoire !!","string.empty":"SVP la date d'emprunt est obligatoire !!"}),
     dateReteur:joi.string().required().messages({"any.required":"SVP la date de reteur est obligatoire !!","string.empty":"SVP la date de reteur est obligatoire !!"}),
     qte:joi.string().required().pattern( /^\d+$/).messages({"any.required":"SVP la qentite est obligatoire !!","string.empty":"SVP la qentite est obligatoire !!","string.pattern.base":"SVP la qentite doit etre un chiffre"}),
     prix:joi.string().required().pattern( /^\d+$/).messages({"any.required":"SVP le prix est obligatoire !!","string.empty":"SVP le prix est obligatoire !!","string.pattern.base":"svp le prix doit etre un chiffre"})    
    });
    const {error}=schema.validate({client,livre,dateEmprunt,dateReteur,qte,prix});
    if(error)
    return res.status(400).json({err:error.details[0].message});
    const l=await Livre.find({_id:livre}).select("-photo");
    if(parseInt(l[0].qte)<parseInt(qte))
    return res.status(400).json({err:"SVP la qentiter est depacer la qentiter exist !!"});
    l[0].qte=l[0].qte-qte;
    l[0].save((err,l)=>{
        if(err)
        return res.status(400).json({err});
    })
    const e=new Emprunt();
    e.livre=livre;
    e.client=client;
    e.dateEmprunt=dateEmprunt;
    e.dateReteur=dateReteur;
    e.qte=qte;
    e.prix=prix;
    e.save((err,e)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({msg:"Ajouter avec success"});
    });
}
exports.getData= async (req,res)=>{
    const skip=req.params.offset;
    const emprunts=await Emprunt.aggregate([
        {
        $lookup:{
            from:"clients",
            localField:"client",
            foreignField:"_id",
            as:"client"
        }
      },
      {
        $lookup:{
            from:"livres",
            localField:"livre",
            foreignField:"_id",
            as:"livre"
        }
      },{
        $project:{
            "qte":1,
            "prix":1,
            "dateEmprunt":1,
            "dateReteur":1,
            "client.cni":1,
            "client._id":1,
            "client.nom":1,
            "client.prenom":1,
            "client.email":1,
            "client.tel":1,
            "client.adresse":1,
            "client.sexe":1,
            "client.priorite":1,
            "livre.code":1,
            "livre._id":1,
            "livre.desi":1,
            "livre.qte":1,
            "livre.prix":1,
            "livre.theme":1,
            "livre.dateEdition":1,
        }
      },    {
        $skip:parseInt(skip)
    },
    {
        $limit:5
    }


]);
return res.json({emprunts});
}
exports.deleteEmprunt=async (req,res)=>{
    const _id=req.params.id;
    Emprunt.findOne({_id}).exec((err,e)=>{
        if(err)
        return res.status(400).json({err});
    Livre.findOne({_id:e.livre}).exec((err,l)=>{
      if(err)
      return res.status(400).json({err});
      l.qte=l.qte+e.qte;
      l.save((err,l)=>{
       if(err)
       return res.status(400).json({err});
      });
    });
    e.remove((err,e)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({msg:"Supprimer avec success !!"});
    });
    });
}
exports.updateEmprunt= async (req,res)=>{
  const _id=req.params._id;
  Emprunt.findOne({_id}).exec( async (err,e)=>{
   if(err)
    return res.status(400).json({err});
    var {client,livre,dateEmprunt,dateReteur,qte,prix}=req.body;
    qte=String(qte);
    prix=String(prix);
   const schema=joi.object({
    client:joi.string().required().messages({"any.required":"SVP le client est obligatoire !!","string.empty":"SVP le client est obligatoire !!"}),
    livre:joi.string().required().messages({"any.required":"SVP le livre est obligatoire !!","string.empty":"SVP le livre est obligatoire !!"}),
    dateEmprunt:joi.string().required().messages({"any.required":"SVP la date d'emprunt est obligatoire !!","string.empty":"SVP la date d'emprunt est obligatoire !!"}),
    dateReteur:joi.string().required().messages({"any.required":"SVP la date de reteur est obligatoire !!","string.empty":"SVP la date de reteur est obligatoire !!"}),
    qte:joi.string().required().pattern( /^\d+$/).messages({"any.required":"SVP la qentite est obligatoire !!","string.empty":"SVP la qentite est obligatoire !!","string.pattern.base":"SVP la qentite doit etre un chiffre"}),
    prix:joi.string().required().pattern( /^\d+$/).messages({"any.required":"SVP le prix est obligatoire !!","string.empty":"SVP le prix est obligatoire !!","string.pattern.base":"svp le prix doit etre un chiffre"})    
   });
   const {error}=schema.validate({client,livre,dateEmprunt,dateReteur,qte,prix});
   if(error)
   return res.status(400).json({err:error.details[0].message});
   const l=await Livre.find({_id:livre}).select("-photo");
   if(parseInt(l[0].qte)+parseInt(e.qte)<parseInt(qte))
   return res.status(400).json({err:"SVP la qentiter est depacer la qentiter exist !!"});
   l[0].qte=l[0].qte+parseInt(e.qte)-qte;
   l[0].save((err,l)=>{
       if(err)
       return res.status(400).json({err});
   });
   e.livre=livre;
   e.client=client;
   e.dateEmprunt=dateEmprunt;
   e.dateReteur=dateReteur;
   e.qte=qte;
   e.prix=prix;
   e.save((err,e)=>{
       if(err)
       return res.status(400).json({err});
       return res.json({msg:"Moddifer avec success"});
   });


  });
}
exports.search= async (req,res)=>{
    const {livre,client,dateEmprunt,dateReteur,qte,prix}=req.body;
    const searchQuery={};
    const emprunts=await Emprunt.aggregate([
        {
        $lookup:{
            from:"clients",
            localField:"client",
            foreignField:"_id",
            as:"client"
        }
      },
      {
        $lookup:{
            from:"livres",
            localField:"livre",
            foreignField:"_id",
            as:"livre"
        }
      },{
        $project:{
            "_id":1,
            "qte":1,
            "prix":1,
            "dateEmprunt":1,
            "dateReteur":1,
            "client.cni":1,
            "client._id":1,
            "client.nom":1,
            "client.prenom":1,
            "client.email":1,
            "client.tel":1,
            "client.adresse":1,
            "client.sexe":1,
            "client.priorite":1,
            "livre.code":1,
            "livre._id":1,
            "livre.desi":1,
            "livre.qte":1,
            "livre.prix":1,
            "livre.theme":1,
            "livre.dateEdition":1,
        }
      },{
        $match:{
            "qte":{$regex:'.*'+qte+'.*',$options:'i'},
            "prix":{$regex:'.*'+prix+'.*',$options:'i'},
            "dateEmprunt":{$regex:'.*'+dateEmprunt+'.*',$options:'i'},
            "dateReteur":{$regex:'.*'+dateReteur+'.*',$options:'i'},
            "client.cni":{$regex:'.*'+client.cni+'.*',$options:'i'},
            "client.nom":{$regex:'.*'+client.nom+'.*',$options:'i'},
            "client.prenom":{$regex:'.*'+client.prenom+'.*',$options:'i'},
            "client.email":{$regex:'.*'+client.email+'.*',$options:'i'},
            "client.tel":{$regex:'.*'+client.tel+'.*',$options:'i'},
            "client.adresse":{$regex:'.*'+client.tel+'.*',$options:'i'},
            "client.sexe":{$regex:'.*'+client.sexe+'.*',$options:'i'},
            "client.priorite":{$regex:'.*'+client.priorite+'.*',$options:'i'},
            "livre.code":{$regex:'.*'+livre.code+'.*',$options:'i'},
            "livre.desi":{$regex:'.*'+livre.desi+'.*',$options:'i'},
            "livre.qte":{$regex:'.*'+livre.qte+'.*',$options:'i'},
            "livre.prix":{$regex:'.*'+livre.prix+'.*',$options:'i'},
            "livre.theme":{$regex:'.*'+livre.theme+'.*',$options:'i'},
            "livre.dateEdition":{$regex:'.*'+livre.dateEdition+'.*',$options:'i'},
        }
      }
]);
return res.json({emprunts});
}
exports.getNbreEmpruntClient=(req,res)=>{
  Emprunt.aggregate([{
    $group:{_id:"$client",count:{$sum:1}
    }
  },
  {
    $lookup:{
        from:"clients",
        localField:"_id",
        foreignField:"_id",
        as:"client"
    }
  }
]).exec((err,c)=>{
    if(err)
    return res.status(400).json({err});
    return res.json({c});
  });
}
exports.getNbrEmpruntLivre=(req,res)=>{
    Emprunt.aggregate([{
        $group:{_id:"$livre",count:{$sum:1}}
    },
    {
        $lookup:{
            from:"livres",
            localField:"_id",
            foreignField:"_id",
            as:"livre"
        }
    }
]).exec((err,l)=>{
    if(err)
     return res.status(400).json({err});
     return res.json({l});
});
}
exports.getLatestAdded=(req,res)=>{
    Emprunt.find().populate([{        
        path:"client",
        model:"Client",
        select :["_id","nom","prenom"]
    }]).sort([["createdAt","desc"]]).limit(4).skip(0).exec((err,l)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({l});
    })
}