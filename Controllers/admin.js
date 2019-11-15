const Admin = require('../Models/admin');
const Task = require('../Models/task');
const { validationResult } = require('express-validator');

//adminAuth
exports.adminAuth = (req, res) => {
    res.status(201).json({
        message: 'Authentication Successfully.',
        result: {
            isAuth: true,
            id: req.admin._id,
            email: req.admin.email,
        }
    })
}


//signupAdmin
exports.signupAdmin = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({
                message: 'Please enter valid details.'
            });
    }

    const admin = new Admin(req.body);
    admin.save((err, admin) => {
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
                })
                ;
        }

        res.status(200).json({
            message: 'Registration successfully.',
            result: {
                email: admin.email,
                id: admin._id
            }
        });
    })
}

//loginAdmin
exports.loginAdmin = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422)
            .json({
                message: 'Invalide Email or Password.'
            });
    }

    const email = req.body.email;
    const pass = req.body.password;
    // console.log(email + " " + pass)
    Admin.findOne({ 'email': email }, (err, admin) => {

        if (err) return res.status(400)
            .json({
                message: 'Something Went Wrong!'
            });

        if (!admin) return res.status(400).json({
            message: 'Authentication failed.'
        })

        admin.comparePassword(pass, (err, isMatch) => {

            if (err) return res.status(400)
                .json({
                    message: 'Something Went Wrong!'
                });

            if (!isMatch) return res.status(400)
                .json({
                    message: 'Wrong Password'
                })

            admin.generateToken((err, admin) => {
                if (err) return res.status(400).json({
                    message: 'Something Went Wrong!'
                })

                console.log('Admin Token is ' + admin.token);
                res.cookie('auth', admin.token, { httpOnly: false });

                res.status(200)
                    .json({
                        message: 'Login Successfully.',
                        result: {
                            isAuth: true,
                            id: admin._id,
                            email: admin.email,
                            token: admin.token
                        }
                    })

            })
        })
    })
}

//adminLogout
exports.adminLogout = (req, res) => {
    req.admin.deleteToken(req.token, (err, admin) => {
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
    // http://localhost:3030/api/admin/get-tasks?skip=3&limit=2&order=asc
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const order = req.query.order;
    console.log(req.admin)
    Task.find()
        .skip(skip)
        .sort(order)
        .limit(limit)
        .then(result => {
            res.status(200)
                .json({
                    message: 'Tasks Fetched successfully.',
                    result: result
                });
        })
        .catch(err => {
            console.log(err.response.data)
            res.status(400)
                .json({
                    message: 'Something Went Wrong!'
                })
        })
}

//addTask  
exports.addTask = (req, res, next) => {
    console.log(req.admin)
    req.body.adminId = req.admin._id;
    const task = new Task(req.body);
    console.log('task',task)
    console.log('id', req.body.adminId)
    task.save()
        .then(result => {
            console.log(result)
            res.status(201)
                .json({
                    message: 'Task Added successfully.',
                    result: result
                })
        })
        .catch(err => {
            res.status(400)
                .json({
                    message: 'Something Went Wrong'
                })
        })

}

//editTask
exports.editTask = (req, res, next) => {

    const task = new Task(req.body);
    console.log(task._id);
    Task.findByIdAndUpdate(task._id, { $set: task }, { new: true }, (err, doc) => {
        if (err) return res.status(400).json({
            message: 'Something Went Wrong!'
        });
        if (!doc) return res.status(400).json({
            message: 'Task Not Found.'
        });
        res.status(201).json({
            message: 'Task Edit Successfully',
            result: doc
        })
    })


}

//deleteTask
exports.deleteTask = (req, res, next) => {
    const id = req.query.id;
    Task.findByIdAndRemove(id, (err, doc) => {
        if (err) return res.status(400).json({
            message: 'Something Went Wrong!'
        });
        if (!doc) return res.status(400).json({
            message: 'Task Not Found.'
        });
        res.status(201).json({
            message: 'Task Deleted Successfully.',
            result: doc
        })
    })
}



