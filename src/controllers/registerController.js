var db = require('../../config/db');
var bcrypt = require('bcrypt');
var uuid = require('uuid');
var tinify = require("tinify");

// init tynify
tinify.key = "2vyPHZXy3qbzQJVTFcvG05t6hSYxKpCd";

// get register page
let getRegister = (req, res) => {
    return res.render('register', { title: 'Register' })
}

// user register
let registerUser = (req, res) => {
    var full_name = req.body.name;
    var email = req.body.email;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var agreebox = req.body.agreebox;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    var registerdate = year + '-' + month + '-' + date;
    var id = uuid.v4();
    const userPhoto = req.file.filename + '_optimized.png';


    if (full_name && email && password1 && password2 && agreebox && userPhoto) {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, rowres) => {
            if (rowres.length > 0) {
                req.flash('error', 'Email already used!')
                res.render('register', { title: 'Email already in' })
            } else {
                if (password1 === password2) {
                    passwordE = bcrypt.hashSync(password1, 10);
                    db.query(`INSERT INTO users SET ID = ?, full_name = ? , email = ?, password = ? , registerdate = ?, user_photo = ?`, [id, full_name, email, passwordE, registerdate, userPhoto], (error, result) => {
                        if (error) throw error;
                        if (!result) {
                            req.flash('error', 'Oops!.error while user insert.Please try again later!');
                            res.render('register', { title: 'error' })
                        } else {
                            // tynify 
                            var source = tinify.fromFile(req.file.path);
                            source.toFile(req.file.path + "_optimized.png");
                            req.flash('success', 'Successfully registered. Please login');
                            res.redirect('/')
                        }
                    });
                } else {
                    req.flash('error', 'Password does not matched!');
                    res.render('register', { title: 'error' })
                }
            }
        })


    } else {
        req.flash('error', 'Please fill out all the details!')
        res.render('register', { title: 'error' })
    }


}


module.exports = {
    getRegister: getRegister,
    registerUser: registerUser,
}