 /**
 * auth : it authenticate admin
 */
    const  Admin = require('../Models/admin');
   
    let auth = (req,res,next) =>{
        console.log(req.cookies)
        if (req.cookies.auth === undefined) return res.status(500)
            .json({
              message : 'Authentication Failed'
            });
            
        let token = req.cookies.auth;
        console.log(`token is ${token}`)
        Admin.findByToken(token,(err,admin)=>{
            if (err) {
                let message;
                if(err.message === 'jwt expired'){
                    message = 'Token is Expire';
                }else{
                    message = 'Somthing went wrong';
                }
                return res.status(400)
                .json({
                    message : message
                });
            }

            if (!admin) return res.status(400).json({
                message : 'Authentication Failed'
            })
            
            req.token = token;
            req.admin = admin;
            
            next();
        })
        
    }

    module.exports = auth