import TokenGenerator from "../../presentation/security/token_generator.js";

const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET, "4m");

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if(!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const result = tokenGenerator.verify(token);

  if(!result.valid) {
    if(result.expired) {
      return res.status(403).json({ error: "Token expirado" });
    }
    return res.status(403).json({ error: "Token inválido" });
  }
  
  req.user = result.payload;
  next();
}