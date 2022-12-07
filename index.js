const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();
const app=express();
const PORT=process.env.PORT || 8080;
const cookieParser=require('cookie-parser');
//routes
//end routes

app.use(express.json());
app.use(cors());
app.use(cookieParser());
const adminRouter=require('./routes/adminRouter');
const clientRouter=require('./routes/clientRouter');
const auteurRouter=require('./routes/auteurRouter');
const livreRouter=require('./routes/livreRouter');
const empruntRouter=require("./routes/empruntRouter");
app.use("/API/admin",adminRouter);
app.use("/API/client",clientRouter);
app.use("/API/auteur",auteurRouter);
app.use("/API/livre",livreRouter);
app.use("/API/emprunt",empruntRouter);
const DATABASE = process.env.DATABASE;
mongoose.connect(DATABASE).then(()=>{
    console.log('connected');
}).catch(err=>console.log(err));

app.listen(PORT,()=>{
    console.log(`app listen on port ${PORT}`)
});
