var express = require('express');
var router = express.Router();
const path = require('path');
var loginuser = require('../src/controllers/loginController');
var registeruser = require('../src/controllers/registerController');
const multer = require('multer');



// set storage engine

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

var upload = multer({ storage: storage })



// Login user
router.post('/login', loginuser.loginUser)

// get register page
router.get('/register', registeruser.getRegister)

// register user
router.post('/register', upload.single('userPhoto'), registeruser.registerUser)

// Reset password
router.get('/forgetpassword', (req, res) => {
    res.render('forgetpassword')
})
router.post('/forgetpassword', loginuser.forgetPass)
router.get('/resetpw/:id', loginuser.getResetPass)
router.post('/resetpw/:id', loginuser.resetPass)

// user logout
router.get('/logout', (req, res) => {
    res.redirect('/')
})

module.exports = router;