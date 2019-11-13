 /**
 * 
 * Admin Router -------------------------------------------
 * 
 */

const express = require('express');
const router  = express.Router();
/*--------  Middleware --------------------------*/
const auth = require('../Middlewares/auth');
/*--------  Express Validator --------------------------*/
const { check , body } = require('express-validator');

const {
    adminAuth,
    signupAdmin,
    loginAdmin,
    adminLogout,        
    getTasks,
    addTask,
    editTask,
    deleteTask
} = require('../Controllers/admin');

router.get("/auth",auth,adminAuth)
router.post("/signup",[
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
  ],signupAdmin);

router.post("/login",[
    // username must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ],loginAdmin);
router.get("/logout",auth,adminLogout)
router.get('/get-tasks',auth,getTasks);
router.post('/add-task',auth,addTask);
router.post('/edit-task',auth,editTask);
router.delete('/delete-task',auth,deleteTask);

module.exports = router;