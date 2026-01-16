import { jwtVerify, createRemoteJWKSet } from "jose";

const jwks = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Missing or invalid auth header" });
    }

    const token = authHeader.split(" ")[1];

    if(!token) {
      return res.status(401).json({message : "Missing token"})
    }

    const { payload } = await jwtVerify(token, jwks, {
      issuer : `${proccess.env.SUPABASE_URL}/auth/v1`,
      audience : "authenticated"
    });

    if (!payload.sub) {
      console.error("JWT missing sub claim")
      return res.status(401).json({message : "Invalid token"})
    }

    if (payload.exp && payload.exp < Date.now() / 1000){
      return res.status(401).json({message : "Token expired"})
    }


    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      aud : payload.aud
    }
    next();

  } catch (err) {
    console.error("Auth error", err.code || err.message)

    res.status(401).json({message : "Invalid token"})
  }
};
