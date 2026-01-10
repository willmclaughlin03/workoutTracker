import { jwtVerify, createRemoteJWKSet } from "jose";

const jwks = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Missing auth header" });
    }

    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, jwks);

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
