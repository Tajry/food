const mysql = require('mysql');




const con  = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"food"
})

con.connect((err)=>{
    if (err) throw err
    console.log('connected');
})

module.exports = con ;