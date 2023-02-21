const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  console.log(accessToken)
  if (!accessToken) return res.send({loggedIn: false })
  
  try {
    const validToken = verify(accessToken, "secret");
    console.log("test2")
    req.user = validToken;
    if(validToken){
      return next();
    }
  } catch (err) {
    return res.json({ error: err })
  }
};

module.exports = { validateToken }