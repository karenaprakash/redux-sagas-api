const User = require('../Models/user');
const Task = require('../Models/task');
const { validationResult } = require('express-validator');
var mongoose = require('mongoose');
const moment = require('moment');
//userAuth
exports.userAuth = (req, res) => {
    res.status(201).json({
        message: 'Authentication Successfully.',
        result: {
            isAuth: true,
            id: req.user._id,
            email: req.user.email,
        }
    })
}


//signupUser
exports.signupUser = (req, res) => {
    if(req.user.roll === 'user'){
        res.status(400)
        .json({
                message: 'Authentication Faild'
        })
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({
                message: 'Please enter valid details.'
            });
    }
    
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            let message;
            if (err.code === 11000) {
                message = 'Email Already Exist.'
            } else {
                message = 'Something Went Wrong!'
            }
            return res.status(400)
                .json({
                    message: message
                });
        }

        res.status(200).json({
            message: 'Registration successfully.',
            result: {
                email: user.email,
                id: user._id,
                roll: user.roll
            }
        });
    })
}

//loginuser
exports.loginUser = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors.array())
        return res.status(422)
            .json({
                message: 'Invalide Email or Password.'
            });
    }

    const email = req.body.email;
    const pass = req.body.password;
    // console.log(email + " " + pass)
    User.findOne({ 'email': email }, (err, user) => {

        if (err) return res.status(400)
            .json({
                message: 'Something Went Wrong!'
            });

        if (!user) return res.status(400).json({
            message: 'Authentication failed.'
        })

        user.comparePassword(pass, (err, isMatch) => {

            if (err) return res.status(400)
                .json({
                    message: 'Something Went Wrong!'
                });

            if (!isMatch) return res.status(400)
                .json({
                    message: 'Wrong Password'
                })

            user.generateToken((err, user) => {
                if (err) return res.status(400).json({
                    message: 'Something Went Wrong!'
                })

              //  console.log('user Token is ' + user.token);
                res.cookie('auth', user.token, { httpOnly: false });

                res.status(200)
                    .json({
                        message: 'Login Successfully.',
                        result: {
                            isAuth: true,
                            id: user._id,
                            email: user.email,
                            token: user.token,
                            roll : user.roll
                        }
                    })

            })
        })
    })
}

//userLogout
exports.userLogout = (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).json({
            message: 'Something Went Wrong!'
        });
        res.status(200).json({
            message: 'Logout successfully.',
            result: {
                isLogout: true
            }
        });
    })

}


//getTasks
exports.getTasks = (req, res, next) => {
    //const user_id = mongoose.Types.ObjectId(req.user._id)
    // http://localhost:3030/api/user/get-tasks?skip=3&limit=2&order=asc
 /*   const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const order = req.query.order; */
    //const startDate = moment(req.query.startDate).format('YYYY-MM-DD');
   //const endDate = moment(req.query.endDate).format('YYYY-MM-DD');

   const startDate = req.query.startDate
   const endDate = req.query.endDate;

   console.log(startDate)
   console.log(endDate)

    Task.find({ start : {
                $gte : startDate,
                $lte : endDate
            }
        })
        .then(result => {
            if (!result) {
                throw new Error('Task not found.')
            }
            let message;

            if (result.length < 1) {
               message = 'Task not found.'
            }else{
                message = 'Tasks Fetched successfully.'
            }
            console.log('result',result)
            res.status(200)
                .json({
                    message: message,
                    result: {
                        events : result,
                        user : req.user
                    }
                });
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                    message: err.message
                })
        })
}

//addTask  
exports.addTask = (req, res, next) => {

   if(req.user.roll === 'user'){
     res.status(400)
        .json({
                message: 'Authentication Faild'
        })
    }

    req.body.userId = req.user._id

    const log = {
        userId : req.user._id,
        changeLog : `[{'Task created' : ${JSON.stringify(req.body)}}]`,
        date : new Date()
    }

    req.body.logs = [log]

    const task  = new Task(req.body);

     task.save()
        .then(result => {
            if (!result) {
              throw new Error('Somthing went Wrong.')
            }

            res.status(201)
                .json({
                    message: 'Task Added successfully.',
                    result: result
            })
        })
        .catch(err => {
            res.status(400)
                .json({
                    message: err
                })
        })

}

const changedDateType = (date) => {
    return moment(date).format('YYYY-MM-DD');
}

const changedTimeType = (date) => {
    return moment(date).format('HH:mm');
}

//editTask
exports.editTask = (req, res, next) => {
    if(req.user.roll === 'user'){
        res.status(400)
        .json({
                message: 'Authentication Faild'
        })
    }
    
    Task.findById(req.body._id)
    .then(doc=>{
        if (!doc) {
            throw new Error('Task not found.')
        }
      

        const title = doc.title;
        const startDate = changedDateType(doc.start);
        const endDate = changedDateType(doc.end);
        const startTime = changedTimeType(doc.start);
        const endTime = changedTimeType(doc.end);

        const newTitle = req.body.title;
        const newStartDate = changedDateType(req.body.start);
        const newEndDate = changedDateType(req.body.end);
        const newStartTime = changedTimeType(req.body.start);
        const newEndTime = changedTimeType(req.body.end);

        let changeLog = [];

        if( title !== newTitle){
            doc.title = req.body.title;
            changeLog.push({'title changed' : `From ${title} To ${newTitle}`})
        }
        if( startDate !== newStartDate){
            doc.start = req.body.start;
            changeLog.push({  'start date changed' : `From ${startDate} To ${newStartDate}`})
        }
        if(startTime !== newStartTime){
            doc.start = req.body.start;
            changeLog.push({  'start time changed' : `From ${startTime} To ${newStartTime}`})
        }
        if( endDate !== newEndDate){
            doc.end = req.body.end;
            changeLog.push({  'end date changed' : `From ${endDate} To ${newEndDate}`})
        }
        if( endTime !== newEndTime){
            doc.end = req.body.end;
            changeLog.push({  'end time changed' : `From ${endTime} To ${newEndTime}`})
        }
        console.log('276 edit')

        const log = {
            userId : req.user._id,
            changeLog : JSON.stringify(changeLog),
            date : new Date()
        }

        doc.logs.push(log) 

        console.log('task',doc)
        const task = new Task(doc);
        return task.save();
    })
    .then((result)=>{
        if (!result) {
            throw new Error('Error while updating task.')
        }
        res.status(201).json({
            message: 'Task Edit Successfully',
            result: result
        })
    })
    .catch(err=>{
        res.status(400).json({
            message: err
        });
    })
}

//deleteTask
exports.deleteTask = (req, res, next) => {
    if(req.user.roll === 'user'){
        res.status(400)
        .json({
                message: 'Authentication Faild'
        })
    }
   
    const id = req.query.id;
    Task.findByIdAndRemove(id)
    .then(doc => {
        if (!doc) {
            throw new Error('Task Not Found.');
        }

        res.status(201).json({
            message: 'Task Deleted Successfully.',
            result: doc
        })

    })
    .catch(err=>{
        res.status(400).json({
            message: 'Something Went Wrong!'
        });
    })
}
