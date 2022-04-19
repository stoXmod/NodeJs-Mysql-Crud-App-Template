var db = require('../../config/db')
var bcrypt = require('bcrypt');

// login user
let loginUser = (req, res) => {
    var email = req.body.email;
    var password = req.body.password

    if (email && password) {
        db.query('SELECT * from users WHERE email =?', [email], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (error, response) => {
                    if (error) throw error;
                    if (response) {
                        return res.render("home", { name: results[0].full_name, userPhoto: results[0].user_photo })
                    } else {
                        req.flash('error', 'Wrong password!')
                        return res.redirect('/')
                    }
                })
            } else {
                req.flash('error', `User doesn't exits with this email!`)
                return res.redirect('/')
            }
        })
    } else {
        req.flash('error', 'All fields are required!')
        return res.redirect('/')
    }

}


// reset password
let forgetPass = (req, res) => {
    var email = req.body.email;

    if (email) {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
            if (err) throw err;
            // if email have
            if (result.length > 0) {
                return res.redirect('resetpw/' + result[0].ID);
                // if email haven't
            } else {
                req.flash('error', 'Email not exits!')
                return res.render('forgetpassword')
            }
        })

    } else {
        req.flash('error', 'Please enter Email!')
        return res.render('forgetpassword')
    }
}


// get reset page
let getResetPass = (req, res) => {
    return res.render('resetpw', { id: req.params.id });
}


// init reset password
let resetPass = (req, res) => {
    var pass1 = req.body.password1;
    var pass2 = req.body.password2;
    var id = req.params.id;
    var syncRounds = 10;

    if (pass1 && pass2) {
        if (pass1 === pass2) {
            const passCheck = bcrypt.hashSync(pass1, syncRounds);
            db.query(`UPDATE users SET password = ? WHERE ID = ?`, [passCheck, id], (err, result) => {
                if (err) throw err;
                if (result) {
                    req.flash('success', 'Password reset successfull. Please login!')
                    res.redirect('/')
                    console.log(result)
                }
            })
        } else {
            req.flash('error', 'Password does not match')
            return res.redirect('./' + req.params.id);
        }

    } else {
        req.flash('error', 'Please enter all the fields!')
        return res.redirect('./' + req.params.id);
    }
}


module.exports = {
    loginUser: loginUser,
    forgetPass: forgetPass,
    getResetPass: getResetPass,
    resetPass: resetPass
}