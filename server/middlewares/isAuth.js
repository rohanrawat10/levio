import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token not found!" });
    }
    let decodeToken;

    try {
      decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.status(401).json({ message: "Invalid token or token expired!" });
    }
    req.userId = decodeToken._id || decodeToken.id || decodeToken.userId;
    next();
  } catch (err) {
    res.status(500).json({ message: "isAuth Error:", error: err.message });
  }
};

export default isAuth;