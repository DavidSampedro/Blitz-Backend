/*const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
 try{
  const token = req.headers.authorization?.split(" ")[1];

  if(!token)
   return res.status(401).json("No autorizado");

  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  req.user = decoded;

  next();

 }catch{
  res.status(401).json("Token inválido");
 }
};*/


/*
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Leer el token del header
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    return res.status(401).json("Acceso denegado. Se requiere un token.");
  }

  try {
    // El token suele venir como "Bearer TOKEN", así que quitamos la palabra "Bearer "
    const token = authHeader.split(" ")[1]; 
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Si todo está bien, pasa a la siguiente función
  } catch (err) {
    res.status(400).json("Token no válido");
  }
};
*/




module.exports = (req, res, next) => {
  // ⚠️ MODO DESARROLLO: Seguridad desactivada temporalmente.
  // Ignoramos si trae token o no, y simplemente dejamos pasar la petición.
  
  // Si en el futuro necesitas simular un usuario logueado para probar algo, 
  // puedes forzarlo así: req.user = { id: "un-id-falso", rol: "admin" };

  next(); // "Pase usted, no le voy a pedir token hoy"
};