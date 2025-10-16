// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// const SECRET = process.env.JWT_SECRET;

// export function authRequired(req, res, next) {
//   // read token from HttpOnly cookie or Authorization header
//   const token = req.cookies?.token || (req.headers.authorization || "").split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   jwt.verify(token, SECRET, (err, payload) => {
//     if (err) return res.status(403).json({ message: "Forbidden" });
//     req.user = payload; // { username, role, iat, exp }
//     next();
//   });
// }

import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's data (from the token payload) to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Not authorized, token failed verification" });
  }
};

export { protect };
