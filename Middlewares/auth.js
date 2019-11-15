 /**
 * auth : it authenticate admin
 */
    const  Admin = require('../Models/admin');
   
    let auth = (req,res,next) =>{
        console.log(req.cookies)
        if (req.cookies.auth === undefined) {
            res.clearCookie("auth");
            return res.status(400)
            .json({
              message : 'Authentication Failed'
            });
        }
            
        let token = req.cookies.auth;
        console.log(`token is ${token}`)
        Admin.findByToken(token,(err,admin)=>{
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

            if (!admin){
                res.clearCookie("auth");
                return res.status(400).json({
                    message : 'Authentication Failed'
                })
            }
            
            req.token = token;
            req.admin = admin;
            
            next();
        })
        
    }

    module.exports = auth