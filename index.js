const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride= require("method-override");
const { v4: uuidv4 } = require('uuid');


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views" , path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'Ashu7452@'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
}


const port=3000;

//Home Page
app.get("/" , (req, res) => {
  let q =`SELECT count(*) FROM user`;
  try{
    connection.query(q, (err ,result) => {
      if(err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", {count});
    });
  }
  catch(err){
    res.send("Some error occured");
  }

});


//All users
app.get("/user" , (req, res) => {
  let q =`SELECT * FROM user`;
  try{
    connection.query(q, (err ,users) => {
      if(err) throw err;
      res.render("showusers.ejs",{ users });
    });
  }
  catch(err){
    res.send("Some error occured");
  }
})

//Edit Route
app.get("/user/:id/edit" , (req, res) => {
  let { id } = req.params;
  let q =`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err ,result) => {
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user })
    });
  }
  catch(err){
    res.send("Some error occured");
  }
  
})


//update Route
app.patch("/user/:id", (req, res) =>{
  let {password: formpassword ,Username: formuser }= req.body;
  let { id } = req.params;
  let q =`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err ,result) => {
      if(err) throw err;
      let user = result[0];
      if(formpassword != user.password){
        res.send("Wrong passWord")
      }
      else{
        let q2=`UPDATE user SET username='${formuser}' where id='${id}'`;
        connection.query(q2, (err,result) => {
          if(err) throw err;
          // user.username = formuser;
          res.redirect("/user");
        })
      }
    });
  }
  catch(err){
    res.send("Some error occured");
  }
});


app.get("/user/add" , (req, res) => {
  res.render("adduser.ejs");
});

app.post("/user" , (req, res) => {
  let {username: newUsername , password: Password, email: Email } = req.body;
  let id = uuidv4();
  let q= `INSERT INTO user ( id , username , email, password) VALUES ('${id}','${newUsername}','${Password}','${Email}')`;
  let userinfo = [ id , newUsername , Email , Password ];
  try{
    connection.query(q, (err ,result) => {
      if(err) throw (err);
      res.redirect("/user");
      
    });
  }
  catch(err){
    res.send("Error occured");
  }
  
});


app.get("/user/:id/delete", (req, res) => {
  let { id }= req.params;
  let q = `DELETE FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err ,result) => {
      if(err) throw (err);
      res.redirect("/user");
    });
  }
  catch(err){
    res.send("Error occured");
  }

})

app.listen(port, () => {
  console.log("Listening on port",port);
});


// let q = "INSERT INTO USER(id,username,email,password) VALUES ?";
// let data = [];
// for(let i=0;i<100;i++){
//   data.push(getRandomUser());
// }

// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw (err);
//     console.log(result);
//   })
// } catch (err) {
//   console.log(err);
// }

// connection.end();

