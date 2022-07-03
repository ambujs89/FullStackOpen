const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (request, response) => {
   const { username, password } = request.body

   if(password == null || username == null) {
      return response.status(401).json({
         error : "please enter a username or password"
      })
   }
   
   const user = await User.findOne({ username })
   const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash)

   if (!(user && passwordCorrect)) {
      return response.status(401).json({
         error: "invalid username or password",
      })
   }

   const userForToken = {
      username: user.username,
      id: user._id,
   }

   const token = jwt.sign(userForToken, process.env.SECRET,{expiresIn : "24 hours"} )

   response
      .status(200)
      .send({ token, username: user.username, name: user.name })
})



module.exports = loginRouter

