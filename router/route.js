const { compareSync } = require('bcrypt');
const express = require('express');
const { append, render, redirect } = require('express/lib/response');
const route = express.Router();
const dbcon = require('../db/connect');
const multer = require('multer');
const { diskStorage } = require('multer');

route.get('/login' , (req,res) =>{
    res.render('login');
})
route.get('/register' , (req,res) =>{
    res.render('register');
})
route.get('/logout' , (req ,res ,next)=>{
    req.session.destroy((err)=>{
        if (err) throw err;
        res.redirect('/');
    })
})
route.get('/search',(req,res,next)=>{
    // let id = req.params.id; 
    let name = req.query.search
    // console.log(id)
    dbcon.query("SELECT * FROM fooder WHERE name LIKE  ?" ,'%' + [name] + '%' ,(err,result)=>{
        if (err) throw err ;
        res.render('index', {data:result})

    })
})
route.get('/product/:id',(req,res,next)=>{
    let id = req.params.id; 
    // console.log(id)
    dbcon.query("SELECT * FROM fooder WHERE id = ?" , [id] ,(err,result)=>{
        if (err) throw err ;
        res.render('product', {data:result})

    })
})

route.get('/', (req, res ,next)=>{


    dbcon.query("SELECT * FROM fooder" , (err,result)=>{
        res.render('index' , {data:result});
        // console.log(result);
    })
    
})

route.get('/user' ,(req, res ,next)=>{

    if (req.session.login || req.session.register) {
        res.render('user');
    }else{
        res.redirect('/login')
    }
    
})

route.post('/registerdb' , (req,res ,next)=>{
    
   
    let username =  req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    

    dbcon.query('SELECT username,email FROM user WHERE username = ?  OR email = ? ', [username, email] ,(err, result , fields)=>{
        if (err) throw err ; 
        if (result.length > 0) {
            req.flash('error' , 'username or emali already use');
            res.redirect('/register');
        }else {
            dbcon.query("INSERT INTO user(username,email,password) VALUES( ? , ? , ? )" , [username ,email,password] , (err, result ,fields)=>{
                if (err) throw err;
                req.session.username = username ;
                req.session.email = email;
                req.session.password  = password;
                req.session.register = true;
                dbcon.query("SELECT username FROM user WHERE email = ? " , [email] ,(err, doc)=>{
                    let data = doc;
                    res.render('user');
                    

                })
                
            })
        }
        
    })
    
})
    

route.post('/logindb' , (req,res ,next) =>{
    var email = req.body.email;
    let password = req.body.password;
    // let password1  = password.toString();
    dbcon.query("SELECT email,password FROM user WHERE email = ? AND password = ? " , [email,password] ,(err ,result ,fields)=>{
        if (err) throw err; 
        if (result.length > 0) {
            req.session.email = email;
            req.session.password = password;
            req.session.login = true;
            dbcon.query("SELECT username FROM user WHERE email = ? " , [email] ,(err, doc)=>{
                let data = doc;
                res.render('user',{data:data});
                
            })

            
            
        }else{
            
            req.flash('user' , 'Email or Password is wrong');
            res.redirect('/login')
        }
    })
})
const storge  = multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,'./public/images');
    },
    filename:(req,file,cd)=>{
        cd(null,Date.now()+".jpg");
    }
    
})


let upload = multer({
    storage:storge
})

route.post('/insert' ,upload.single("image"), (req,res,next)=>{
    let image = req.file.filename// set uploade
    let name = req.body.name
    let ht = req.body.ht
    let decription = req.body.decription
    dbcon.query("INSERT INTO fooder(img,name,ht,decription) VALUES(? ,? , ?  , ?) " , [image,name,ht,decription] ,(err,result)=>{
        if (err) throw err;
        dbcon.query("SELECT username FROM user WHERE email = ? " , [req.session.email] ,(err, doc)=>{
            let data = doc;
            res.render('user',{data:data});
            
        })

    })
    


})

module.exports = route;