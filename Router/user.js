 /**
 * 
 * User Router -------------------------------------------
 * 
 */

const express = require('express');
const router  = express.Router();
/*--------  Middleware --------------------------*/
const auth = require('../Middlewares/userAuth');
/*--------  Express Validator --------------------------*/
const { check , body } = require('express-validator');

const {
    userAuth,
    signupUser,
    loginUser,
    userLogout,        
    getTasks,
    addTask,
    editTask,
    deleteTask
} = require('../Controllers/user');

router.get("/auth",auth,userAuth)
router.post("/signup",auth,[
    // username must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 }),
    check('mobile').isLength({ min: 10 }),
    body('first_name')
    .not().isEmpty()
    .trim()
    .escape(),
    body('last_name')
    .not().isEmpty()
    .trim()
    .escape(),
  ],signupUser);

router.post("/login",[
    // username must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ],loginUser);
router.get("/logout",auth,userLogout)
router.get('/get-tasks',auth,getTasks);
router.post('/add-task',auth,addTask);
router.post('/edit-task',auth,editTask);
router.delete('/delete-task',auth,deleteTask);

module.exports = router;