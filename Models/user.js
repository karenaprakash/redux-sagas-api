/**
 * user model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');
const config = require('../Config/config').get(process.env.NODE_ENV);
const SALT_I = 10; 

const userSchema = mongoose.Schema({
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
    roll : {
        type : String,
        required : true,
    },
    token : {   
        type : String
    }
})


/*================= make encrypted password - using bcrypt
==============================================================*/
//encrypt password before save
userSchema.pre('save',function(next){
    var user = this;

    /* --------------- handle password encryption -------------- */
    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,function(err,salt){
            if(err) return next(err);

            bcrypt.hash(user.password,salt,function(err,hash){
             if(err) return next(err);
             user.password = hash;
                next();
            })

        })
    }else{
        next()
    }
})


// comparePassword
userSchema.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword ,  this.password, function(err,isMatch){
        if( err ) return cb(err);
        cb(null,isMatch);
    })
}
// generate token with expire time = 10 min and save in perticuler user when user makes login 
userSchema.methods.generateToken = function (cb){
    var user = this;
    var token = jwt.sign( { data : user._id.toHexString() } , config.SECRET , {expiresIn : "1h" } )
   // console.log(token)
    user.token =  token;
    user.save(function(err,user){
        if( err ) return cb(err);
        cb(null,user)
    })
}
//verify token is valid or not for perticuler user
userSchema.statics.findByToken = function(token,cb){
//console.log(token)

    var user = this;

     jwt.verify(token,config.SECRET,function(err,decode){
        if( err ) return cb(err);

        if(decode){
            user.findOne({"_id" : decode.data, "token" : token},function(err,user){
                if( err ) return cb(err);
                cb(null,user)
             })
        }else{
            return cb(err)
        }
     })

}

//delete token for logout
userSchema.methods.deleteToken = function(token,cb){
    var user = this;

    user.update({$unset:{token:1}},(err,user)=>{
        if( err ) return cb(err);
        cb(null,user)
    })  
}

const User = mongoose.model('User',userSchema)

module.exports = User
