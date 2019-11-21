/**
 * auth : it authenticate user
 */

const  User = require('../Models/user');
   
let auth = (req,res,next) =>{
    //console.log(req.cookies)
    if (req.cookies.auth === undefined) {
        res.clearCookie("auth");
        return res.status(400)
        .json({
          message : 'Authentication Failed'
        });
    }
        
    let token = req.cookies.auth;
   // console.log(`token is ${token}`)
    User.findByToken(token,(err,user)=>{
        if (err) {
            let message;
            if(err.message === 'jwt expired'){
                message = 'Authentication Failed';
            }else{
                message = 'Somthing went wrong';
            }
            res.clearCookie("auth");
            return res.status(400)
            .json({
                message : message
            });
        }

        if (!user){
            res.clearCookie("auth");
            return res.status(400).json({
                message : 'Authentication Failed'
            })
        }
        
        req.token = token;
        req.user = user;
        
        next();
    })
    
}

module.exports = auth