const jwt = require("jsonwebtoken");
const jwtconfig = require("../config/jwtconfig");
const moduleTable = "users";
const AuthService = {
  createToken: (userId, userRole) => {
    const payload = {
      // add additional payload when needed using db query
      userId
    };
    return jwt.sign(payload, jwtconfig.JWT_SECRET, {
      algorithm: jwtconfig.JWT_ALGO,
      audience: jwtconfig.JWT_AUDIENCE,
      issuer: jwtconfig.JWT_ISSUER,
    });
  },
  verifyToken: async (token) => {
    if (!token) {
      return null;
    }
    try {
      let authToken = jwt.verify(token, jwtconfig.JWT_SECRET, {
        algorithm: jwtconfig.JWT_ALGO,
        audience: jwtconfig.JWT_AUDIENCE,
        issuer: jwtconfig.JWT_ISSUER,
      });
      let userId = authToken.userId;
      // await authToken.then(user=>{
      //        userId = user.userId
      //    })
      return authToken;
    } catch (e) {
      return null;
    }
  }
  
};

module.exports = AuthService;
