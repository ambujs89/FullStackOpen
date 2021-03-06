// import config, express, and CORS
const config = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
// import express async await error handler 
require('express-async-errors')

// import routers
const blogsRouter = require("./controllers/blogs")
const loginRouter = require("./controllers/login")
const usersRouter = require("./controllers/users")
const testingRouter = require("./controllers/testing")
// import middleware for logging, error handling and database
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")

logger.info("connecting to mongodb")

mongoose
   .connect(config.MONGODB_URI)
   .then(() => {
      console.log("connected to mongodb")
   })
   .catch((error) => {
      console.log("error connecting to mongodb :", error.message)
   })

// use cross origin resource sharing
app.use(cors())
// use express json parser
app.use(express.json())
// use request logging middleware
app.use(middleware.requestLogger)
// setup routers
app.use("/api/blogs", blogsRouter)
app.use("/api/login", loginRouter)
app.use("/api/users", usersRouter)
// use custom error handling middleware
if (process.env.NODE_ENV === 'test') {  
   const testingRouter = require('./controllers/testing')  
   app.use('/api/testing', testingRouter)
}
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app