/**
 * admin model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');
const config = require('../Config/config').get(process.env.NODE_ENV);
const SALT_I = 10; 

const adminSchema = mongoose.Schema({
    first_name : {
        type: String,
        required : true
    },
    last_name : {
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : 1
    },
    mobile : {
        type: Number,
        required : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    token : {   
        type : String
    }
})


/*================= make encrypted password - using bcrypt
==============================================================*/
//encrypt password before save
adminSchema.pre('save',function(next){
    var admin = this;

    if(admin.isModified('password')){
        bcrypt.genSalt(SALT_I,function(err,salt){
            if(err) return next(err);

            bcrypt.hash(admin.password,salt,function(err,hash){
             if(err) return next(err);
             admin.password = hash;
                next();
            })

        })
    }else{
        next()
    }
})
// comparePassword
adminSchema.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword ,  this.password, function(err,isMatch){
        if( err ) return cb(err);
        cb(null,isMatch);
    })
}
// generate token with expire time = 10 min and save in perticuler admin when admin makes login 
adminSchema.methods.generateToken = function (cb){
    var admin = this;
    var token = jwt.sign( { data : admin._id.toHexString() } , config.SECRET , {expiresIn : "10min" } )
   // console.log(token)
    admin.token =  token;
    admin.save(function(err,admin){
        if( err ) return cb(err);
        cb(null,admin)
    })
}
//verify token is valid or not for perticuler admin
adminSchema.statics.findByToken = function(token,cb){
//console.log(token)

    var admin = this;

     jwt.verify(token,config.SECRET,function(err,decode){
        if( err ) return cb(err);

        if(decode){
            admin.findOne({"_id" : decode.data, "token" : token},function(err,admin){
                if( err ) return cb(err);
                cb(null,admin)
             })
        }else{
            return cb(err)
        }
     })

}

//delete token for logout
adminSchema.methods.deleteToken = function(token,cb){
    var admin = this;

    admin.update({$unset:{token:1}},(err,admin)=>{
        if( err ) return cb(err);
        cb(null,admin)
    })  
}

const Admin = mongoose.model('Admin',adminSchema)


module.exports = Admin 
