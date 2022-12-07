const expressJWT=require('express-jwt');
require('dotenv').config();
exports.requireSignIn=expressJWT({
    secret:process.env.JWT_SECRETE,
    algorithms:["HS256"],
    userProperty:'auth'
});
