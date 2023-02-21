// importing framework
const express = require('express');
const app = express()
const cors = require("cors");
require("dotenv").config()

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
app.set('trust proxy', 1)
app.use(express.json());
const whitelist = ['https://theshopaholicstore.com', 'https://theshopaholicstore.com/login']
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

//Used for creating sessions and cookies
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    name: "userId",
    secret:"superSecretPasscode",
    resave: false,
    saveUninitialized: false,
    proxy : true,
    cookie: {
        expires: 1000 * 60 * 60 * 24,
        sameSite: 'none',
        httpOnly: false,
        secure: true,
    }
    
}))
app.use((req, res, next)=>{
    req["session"].secure = true;
    next();
});

//connecting database
const db =require('./models');

//Routers
const productRouter = require('./routes/Products');
app.use("/api/products", productRouter);
//using /auth routes to ./routes/Users
const userRouter = require('./routes/Users');
app.use("/api/auth", userRouter);

//server is listening for database requests on this port
db.sequelize.sync().then(() => {
        app.listen(process.env.PORT || 3001, () => {
            console.log("Server running on port 3001");
        })
    })
    .catch((err) => {
        console.log(err);
    })



