const express = require("express");
const app = express();
const bodyParser = require("body-parser");


let users = [
  { id: 1, name: "hello", email: "hello@example.com" },
  { id: 2, name: "kapil", email: "kapi@example.com" },
];


app.use(bodyParser.json());

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const newUser = req.body;
 const emailCheck = users.every((user) => user.email !== newUser.email);
 if (!emailCheck) {
   return res.status(400).json({ message: "Email already exists" });
 }
 newUser.id = users.length + 1; 
 users.push(newUser);
 res.status(201).json(newUser);
});

app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter((user) => user.id !== userId);
  res.status(200).json({ message: "User deleted successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
