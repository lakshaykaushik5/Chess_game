import jwt from "jsonwebtokn";


const verifyToken = (req,res,next) => {
  const = req.cookies.token;

  if(!token){
    return res.status(403).json({msg:"No token provided"});
  }
  
  try{
    const decoded = jwt.verify(token,SECRET_KEY);
    req.user = decoded;
    next();
  }catch(err){
    console.log(err);
  }
}
