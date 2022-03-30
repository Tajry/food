const express = require('express');
const path = require('path');
const app = express();
const route = require('./router/route');
const flash =require('express-flash');
const session = require('express-session');
const mysql = require('mysql');
const dbcon = require('./db/connect');
var bodyParser = require('body-parser');
const multer = require('multer');

//set port
var port=process.env.PORT || 3000;




//set body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.urlencoded({extended: false}));
//set template engine
app.set('views' , path.join(__dirname, 'views'));
app.set('view engine' ,'ejs');

app.use('/public/', express.static('./public'));//use file public for use evrything in file public
//set session 
app.use(session({
    cookie:{ maxAge:24 * 60 * 60 * 1000 },
    store: new session.MemoryStore,
    saveUninitialized:true ,
    resave: ' true',
    secret: 'secret'
}))


//set use flash
app.use(flash());

app.use(route);//use route 


app.listen(port, ()=>{
    console.log('server is runing');
});


