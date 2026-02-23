const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");


// REGISTRO
exports.register = async (req,res)=>{
 try{
  const { nombre,email,password } = req.body;

  const hash = await bcrypt.hash(password,10);

  const result = await db.query(
   "INSERT INTO users(id,nombre,email,password_hash) VALUES($1,$2,$3,$4) RETURNING id,nombre,email",
   [uuidv4(),nombre,email,hash]
  );

  res.json(result.rows[0]);

 }catch(err){
  res.status(500).json(err.message);
 }
};


// LOGIN
exports.login = async (req,res)=>{
 try{
  const { email,password } = req.body;

  const user = await db.query(
   "SELECT * FROM users WHERE email=$1",
   [email]
  );

  if(user.rows.length === 0)
   return res.status(401).json("Usuario no encontrado");

  const valid = await bcrypt.compare(password,user.rows[0].password_hash);

  if(!valid)
   return res.status(401).json("Contraseña incorrecta");

  const token = jwt.sign(
   { id:user.rows[0].id },
   process.env.JWT_SECRET,
   { expiresIn:"8h" }
  );

  res.json({
   token,
   user:{
    id:user.rows[0].id,
    nombre:user.rows[0].nombre,
    email:user.rows[0].email
   }
  });

 }catch(err){
  res.status(500).json(err.message);
 }
};