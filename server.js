if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

// Importing all Libraies that we installed using npm
const express = require("express")
const app = express()
const bcrypt = require("bcrypt") // Importing bcrypt package
const path = require ("path")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
//const methodOverride = require("method-override")

const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'127.0.0.1',
    user :"root",
    password: 'Muyiwa12$',
    database: 'userdb'
   


}).promise()

const publicDirectory = path.join(__dirname," ./public");
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize()) 
app.use(passport.session())
//app.use(methodOverride("_method"))




app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      let user = await User.findOne({ email });
  
      if (!user) return res.status(400).send("User not found");
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) return res.status(400).send("Please enter a valid password.");
  
      //at this point, login is successfull, return the user info without the password info
      user.password = undefined;
  
      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  });

// app.post("/login", async(req, res) =>{
//     try {
        
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const loginpost = ({
//         email:req.body.email,
//             password:req.body.password,
//         })
//        const em= loginpost.email;
//        const ps= loginpost.password;

//     const bla=  await pool.query ( 'SELECT * FROM newsignup WHERE email = "{em}"AND password = "{ps}"')
// console.log(bla)
//     //const strps = String(ps);
//        // console.log(ps)
//         const chk = await  pool.query('SELECT * FROM newsignup WHERE email = ?', em, async (err, results) => {
                
//        })
//        // console.log(chk);
//         //to check for the password of the email inputed
//         const idc = await  pool.query('SELECT password FROM newsignup WHERE email =  ?', em, async (err, results) => {
                
//         })
                
//         // })
//        //  console.log(idc)


//         // if(ps == idc) {
//         //     console.log("password  correct")
//         // }else{
//         //     console.log("incorrect password")
//         // }
                                                                            

//     //    if(!chk ){
//     //     console.log("email or password doesnt exist")
//     //    }else{
//     //     console.log("succesfully loged in")
//     //    }
//     //   const ck = await  pool.query('SELECT * FROM newsignup WHERE email = ?')
//     //         console.log(ck);
//             //  if (results =) {
//             //     alert("wrong username or password")
//             //  }
       
//      res.redirect("/")
        
// }catch (e) {
//         console.log(e);
//         res.redirect("/register")
// }
    

    //     async function checkemail(){
    //         const resultemail= await pool.query(` SELECT email FROM newsignup`);
    //         return resultemail
    //     }
    //     const finalemail =await checkemail()
    //   //  console.log(finalemail),
        
    //     initializePassport(
    // passport,
    // email => users.find(user => finalemail === loginpost.email),
    // id => users.find(user => user.id === id)
    // )
    // })






    











app.post("/register", async(req, res) =>{

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const post = ({
            name:req.body.name,
        email:req.body.email,
            password: hashedPassword,
        })
        async function createsignup(name,email,password) {
        const result =  await pool.query(`
        INSERT INTO newsignup (name,email,password)
        VALUES (?, ?, ?)
        `, [name,email,password])
        return result
    }
   //const result = await createsignup(post.name,post.email,post.password)
    //console.log(result)
        res.redirect("/login")
        
    } catch (e) {
        console.log(e);
        res.redirect("/register")
    }
    

    })
    


 
//routes
app.use('/',require('./routes/pages'))
app.use('/auth',require('./routes/auth'))


//end routes




app.listen("3000")