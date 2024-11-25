const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const path=require("path");
const methodOverride=require("method-override");
const app=express();

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


// Database connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'college'
});

// Function to generate fake user data
const getUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};




app.listen("3000",()=>{
    console.log("Listening to port 3000");
});

app.get("/",(req,res)=>{
    let q="SELECT count(*) FROM user";
    
try {
    // Execute the query with data array
    connection.query(q, (err, result) => {
      if (err) throw err;
      //console.log('Inserted Rows:', results.affectedRows);
      
      let count=result[0]["count(*)"];
      //res.send(results);
      res.render("home.ejs",{count});
    });
  } catch (err) {
    console.error('Error:', err);
  } 
});

app.get("/user",(req,res)=>{
    let q="SELECT * FROM user";
    try {
        // Execute the query with data array
        connection.query(q, (err, result) => {
          if (err) throw err;
          res.render("showuser.ejs",{result});
        });
      } catch (err) {
        console.error('Error:', err);
      } 
    
});

app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try {
    // Execute the query with data array
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  } catch (err) {
    console.error('Error:', err);
  } 
});

app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formpass,name:newUsername}=req.body;
     
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try {
    // Execute the query with data array
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user=result[0];
      
      if(formpass!=user.password){
        res.send("wrong password");
      }
      else{
      let q2=`UPDATE user SET name='${newUsername}' WHERE id='${id}'`;
      connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
           
        });
      }
      
      
    });
  } catch (err) {
    console.error('Error:', err);
  } 
});

app.delete("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`DELETE FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      res.redirect("/user");
    });
  }
  catch(err){
    res.send("some error in DB");
  }
});

app.get("/user/add",(req,res)=>{
    res.render("add.ejs");
});

app.post("/user/add",(req,res)=>{
  let{id:newid,name:newname,email:newemail,password:newpassword}=req.body;
  let q=`INSERT INTO user VALUES('${newid}','${newname}','${newemail}','${newpassword}')`;
  try {
    // Execute the query with data array
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");

    });
  } catch (err) {
    console.error('Error:', err);
  } 
});

