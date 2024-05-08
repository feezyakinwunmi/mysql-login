const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const dotenv = require("dotenv").config();
const cookieParser = require("cookieparser");

const pool = mysql.createConnection({
    host:'127.0.0.1',
    user :"root",
    password: 'Muyiwa12$',
    database: 'userdb'
});

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; 

        if (!email || !password) {
            return res.render("login", {
                message: "Please Provide an email and password"
            })
        }
        pool.query('SELECT * FROM  newsignup WHERE email = ?', [email], async (err, results) => {

            console.log(results[0].password);
            if (!results || !await bcrypt.compare(password, results[0].password)) {
                return res.render("login", {
                    message: "wrong email or password"
                })
            } else {
                // const id = results[0].id;

                // const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                //     expiresIn: process.env.JWT_EXPIRES_IN
                // });

                // console.log("the token is " + token);

                // const cookieOptions = {
                //     expires: new Date(
                //         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                //     ),
                //     httpOnly: true
                // }
                // res.cookie('userSave', token, cookieOptions);
                res.status(200).redirect("/");
            }
        })
    } catch (err) {
        console.log(err);
    }
}
exports.register = (req, res) => {
    console.log(req.body);
    const { name, email, password, comfirmpassword } = req.body;
    pool.query('SELECT email from newsignup WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                return res.render('register', {
                    message: 'The email is already in use'
                })
            } else if (password != comfirmpassword) {
                return res.render('register', {
                    message: 'Password dont match'
                });
            }
        }

        let hashedPassword = await bcrypt.hash(password, 0);
        console.log(hashedPassword);

        pool.query('INSERT INTO newsignup SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results)
                return
                    res.redirect("/login")
                ;
            }
        })
     })
    // res.send("Form submitted");
}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.userSave) {
        try {
            // 1. Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                process.env.JWT_SECRET
            );
            console.log(decoded);

            // 2. Check if the user still exist
            db.query('SELECT * FROM newsignup WHERE id = ?', [decoded.id], (err, results) => {
                console.log(results);
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.log(err)
            return next();
        }
    } else {
        next();
    }
}
exports.logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).redirect("/");
}