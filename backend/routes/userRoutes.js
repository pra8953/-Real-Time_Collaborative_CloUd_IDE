const router = require('express').Router();
const {login , signup} = require('./../controllers/auth/authController');
const {loginValidation,signupValidation} = require('./../validators/authValidator');
router.use('/login',loginValidation,login);
router.use('/signup',signupValidation,signup);


module.exports = router;