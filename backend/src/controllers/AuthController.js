const jwt = require("jsonwebtoken");
const { secretKey, expiresIn } = require("../config/jwt");

const options = {
  algorithm: "HS256",
  expiresIn,
  issuer: "Dex.Exchange.com",
};

exports.generateTokenJWT = (req, res) => {
  const user = req.body;
  if (!user.wallet) {
    return res
      .status(400)
      .json({ message: "Thông tin người dùng không hợp lệ" });
  }
  try {
    const payload = {
      wallet: user.wallet,
      role: "user",
      walletAccess: user.walletAccess,
    };
    const token = jwt.sign(payload, secretKey, options);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi tạo token", error });
  }
};

exports.authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Token không có hoặc không hợp lệ" });
  }

  const actualToken = token.split(" ")[1];

  try {
    const decoded = jwt.verify(actualToken, secretKey);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" }); // Token hết hạn
    } else {
      return res.status(403).json({ message: "Invalid token" }); // Token không hợp lệ
    }
  }
};
