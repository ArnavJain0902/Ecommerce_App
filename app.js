const path = require("path");
const mongoose = require("mongoose")
const express = require("express");
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI = "mongodb+srv://Arnav:superarnav@cluster0.s2mlu.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";
const csrf = require("csurf");
const flash = require("connect-flash")

const User = require("./models/user");
const app = express();
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const csrfProtection = csrf();

const store = new MongoDBStore({
  uri:MONGODB_URI,
  collection:'session'
});



app.set("view engine", "ejs");
app.set("views", "views");


app.use(express.urlencoded({ extended: false }));

/* eslint-disable-next-line no-undef */
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    req.session.user = new User().init(req.session.user);
  }
  next();
});
app.use(csrfProtection);
app.use((req,res,next)=>{
  res.locals.csrfToken = req.csrfToken()
  res.locals.isAuthenticated = req.session.isLoggedIn
  next()
})
app.use(flash())
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);


mongoose
  .connect(
    MONGODB_URI
  )
  .then(async () => {
    app.listen(3000);
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(err);
  });

// mongoConnect(()=>{   For mongoDB driver
//   app.listen(3000)
// });
