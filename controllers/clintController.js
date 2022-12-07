const formidable=require('formidable');
const Joi = require('joi');
const fs=require('fs');
const Client =require('../models/Client');
exports.hellow=(req,res)=>{
    return res.json({msg:"Hellow"});
}
exports.addClient=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req, async (err,fields,files)=>{
       const {nom,prenom,cni,email,tel,sexe,adresse,priorite}=fields;
       if(!files.photo)
       return res.status(400).json({err:"SVP la photo est obligatoire !!"});
       const schema=new Joi.object({
        cni:Joi.string().required().messages({"any.required":"SVP le cni est obligatoire !!","string.empty":"SVP le cni est obligatoire !!"}),
        nom:Joi.string().required().messages({"any.required":"SVP le nom est obligatoire !!","string.empty":"SVP le nom est obligatoire !!"}),
        prenom:Joi.string().required().messages({"any.required":"SVP le prenom est obligatoire !!","string.empty":"SVP le prenom est obligatoire !!"}),
        email:Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required().messages({"any.required":"SVP le gmail est obligatoire !!","string.empty":"SVP le gmail doit pas etre vide !!","string.pattern.base":"SVP le format de gmail est invalide !!"}),
        tel:Joi.string().pattern(/0[0-9]{9}/).required().messages({"any.required":"SVP le telephone est obligatoire !!","string.empty":"SVP le telephone doit pas etre vide !!","string.pattern.base":"SVP le format de telephone est invalide !!"}),
         adresse:Joi.string().required().messages({"any.required":"SVP le adresse est obligatoire !!","string.empty":"SVP le adresse est obligatoire !!"}),
        sexe:Joi.string().required().messages({"any.required":"SVP le sexe est obligatoire !!","string.empty":"SVP le sexe est obligatoire !!"}),
        priorite:Joi.string().required().messages({"any.required":"SVP le priorite est obligatoire !!","string.empty":"SVP le priorite est obligatoire !!"}),
       });
       const {error}=schema.validate({nom,prenom,cni,email,tel,sexe,adresse,priorite});
       if(error)
       return res.status(400).json({err:error.details[0].message});
       var c=await Client.find({cni}).select("-photo");
       if(c.length!=0)
       return res.status(400).json({err:"SVP cet cni exist  deja !!"});
       

       c=await Client.find().select("-photo").and([{nom},{prenom}]);
       if(c.length!=0)
       return res.status(400).json({err:"SVP le nom et le prenom exist deja !!"});
       
       c=await Client.find({email}).select("-photo");
       if(c.length!=0)
       return res.status(400).json({err:"SVP l'email exist deja !!"});

       c=await Client.find({tel}).select("-photo");
       if(c.length!=0)
       return res.status(400).json({err:"SVP l'telephone exist deja !!"});
       
       const client=new Client();
       client.nom=nom;
       client.prenom=prenom;
       client.cni=cni;
       client.email=email;
       client.tel=tel;
       client.sexe=sexe;
       client.adresse=adresse;
       client.priorite=priorite;
       client.photo.data=fs.readFileSync(files.photo.path);
       client.photo.contentType=files.photo.type;
       client.save((err,c)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({msg:"Ajouter vaec succcess !!"});
       })

    });
}
exports.getData= async (req,res)=>{
    const offset=req.params.offset;
    Client.find().select("-photo").limit(5).skip(offset).exec((err,clients)=>{
        if(err)
         return res.status(400).json({err});
         return res.json({clients})
    })    
}
exports.getPhoto=(req,res)=>{
    const _id=req.params._id;
    Client.findOne({_id}).exec((err,c)=>{
        if(err)
        return res.status(400).json({err});
        const {contentType,data}=c.photo;
        res.set("contentType",contentType);
        return res.send(data);
    })
}
exports.deleClient=(req,res)=>{
    const _id=req.params._id;
    Client.findOne({_id}).exec((err,c)=>{
        if(err)
        return res.status(400).json({err});
        c.remove((err,c)=>{
            if(err)
            return res.status(400).json({err});
          return res.json({msg:"Supprimer avec succes"});
        })
    })
}
exports.updateClient=(req,res)=>{
    const form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,async (err,fields,files)=>{
        const {nom,prenom,cni,email,tel,sexe,adresse,priorite}=fields;
        const _id=req.params._id;
        const schema=new Joi.object({
            cni:Joi.string().required().messages({"any.required":"SVP le cni est obligatoire !!","string.empty":"SVP le cni est obligatoire !!"}),
            nom:Joi.string().required().messages({"any.required":"SVP le nom est obligatoire !!","string.empty":"SVP le nom est obligatoire !!"}),
            prenom:Joi.string().required().messages({"any.required":"SVP le prenom est obligatoire !!","string.empty":"SVP le prenom est obligatoire !!"}),
            email:Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required().messages({"any.required":"SVP le gmail est obligatoire !!","string.empty":"SVP le gmail doit pas etre vide !!","string.pattern.base":"SVP le format de gmail est invalide !!"}),
            tel:Joi.string().pattern(/0[0-9]{9}/).required().messages({"any.required":"SVP le telephone est obligatoire !!","string.empty":"SVP le telephone doit pas etre vide !!","string.pattern.base":"SVP le format de telephone est invalide !!"}),
             adresse:Joi.string().required().messages({"any.required":"SVP le adresse est obligatoire !!","string.empty":"SVP le adresse est obligatoire !!"}),
            sexe:Joi.string().required().messages({"any.required":"SVP le sexe est obligatoire !!","string.empty":"SVP le sexe est obligatoire !!"}),
            priorite:Joi.string().required().messages({"any.required":"SVP le priorite est obligatoire !!","string.empty":"SVP le priorite est obligatoire !!"}),
           });
           const {error}=schema.validate({nom,prenom,cni,email,tel,sexe,adresse,priorite});
           if(error)
           return res.status(400).json({err:error.details[0].message});
           
            var c=await Client.find().select("-photo").and([{cni},{_id:{$ne:_id}}]);
            if(c.length!=0)
            return res.status(400).json({err:"Le cne exist deja !!"});
            
            c=await Client.find().select("-photo").and([{nom},{prenom},{_id:{$ne:_id}}]);
            if(c.length!=0)
            return res.status(400).json({err:"Le nom et le prenom exist deja !!"});
            
            c=await Client.find().select("-photo").and([{email},{_id:{$ne:_id}}]);
            if(c.length!=0)
            return res.status(400).json({err:"Le email exist deja !!"});
            
            c=await Client.find().select("-photo").and([{tel},{_id:{$ne:_id}}]);
            if(c.length!=0)
            return res.status(400).json({err:"Le telephone exist deja !!"});

            Client.findOne({_id},(err,c)=>{
              if(err)
              return res.status(400).json({err});
              c.nom=nom;
              c.prenom=prenom;
              c.cni=cni;
              c.email=email;
              c.tel=tel;
              c.sexe=sexe;
              c.adresse=adresse;
              c.priorite=priorite;
              if(files.photo){
                  c.photo.data=fs.readFileSync(files.photo.path);
                  c.photo.contentType=files.photo.type;
                }
              c.save((err,c)=>{
                if(err)
                return res.status(400).json({err});
                return res.json({msg:"Moddifier avec success !!"});
              });       
            });
            
            
    });
}
exports.searchClient=(req,res)=>{
    const {nom,prenom,cni,email,tel,sexe,adresse,priorite}=req.body;
    const searchQuery={};
    searchQuery.prenom={$regex:'.*'+prenom+'.*',$options:'i'};
    searchQuery.cni={$regex:'.*'+cni+'.*',$options:'i'};
    searchQuery.email={$regex:'.*'+email+'.*',$options:'i'};
    searchQuery.tel={$regex:'.*'+tel+'.*',$options:'i'};
    searchQuery.sexe={$regex:'.*'+sexe+'.*',$options:'i'};
    searchQuery.adresse={$regex:'.*'+adresse+'.*',$options:'i'};
    searchQuery.priorite={$regex:'.*'+priorite+'.*',$options:'i'};
    searchQuery.nom={$regex:'.*'+nom+'.*',$options:'i'};
    Client.find(searchQuery).select("-photo").exec((err,clients)=>{
     if(err)
     return res.status(400).json({err});
     return res.json({clients});
    });
}
exports.getNbrClientByPriority=(req,res)=>{
  Client.aggregate([{
    $group:{_id:{priorite:"$priorite"},count:{$sum:1}}
  }]).exec((err,l)=>{
    if(err)
    return res.status(400).json({err});
    return res.json({l});
  });
}
exports.getLatest=(req,res)=>{
    Client.find().select("-photo").limit(4).skip(0).sort([["createdAt","desc"]]).exec((err,c)=>{
        if(err)
        return res.status(400).json({err});
        return res.json({c})
    })
}