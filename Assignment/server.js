const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname,'sample.db') 

let db = null 
 
const initializeDBAndServer=async()=>{
    try{
        db = await open({
            filename:dbPath, 
            driver:sqlite3.Database
        })
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id AUTO INTEGER PRIMARY KEY,
                username TEXT,
                password TEXT,
                email TEXT UNIQUE,
                phone TEXT
            )
        `);
        app.listen(3006,()=>console.log("App listen at port 3000"))
    }
    catch(error){
        console.log(error.message)
        process.exit(1)
    }
}
initializeDBAndServer()

// app.post('/user/', async (req,res)=>{
//     const {username,password,email,phone} = req.body
//     console.log(req.body)

//     const checkUser = `select * from users where email=${email}`
//     const isEmail = await db.get(checkUser.email)

//     const hashedPassword = await bcrypt.hash(password,10)

//     if(isEmail===undefined){
//         const AddUser = `insert into users (username,password,email,phone) 
//         values (
//             '${username}',
//             '${hashedPassword}',
//             '${email}',
//             '${phone}'
//             );`;
//         await db.run(AddUser)
//         res.send("User Added Succefully")
//     }
//     else{
//         res.send("User Exist Already with same email")
//     }

// })

app.get("/",(req,res)=>{
  console.log("vascas")
    res.send({
      message: "hello"
    })
  

})

app.post("/user", async (req, res) => {
  const { username, password, email, phone } = req.body;
  console.log(req.body)

  try {
    // Check if the user already exists
    const checkUser = await db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (checkUser) {
      return res.status(400).send("User already exists with the same email");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await db.run(
      "INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, phone]
    );

    res.send("User Added Successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal Server Error");
  }
});
