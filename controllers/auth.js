const { ConnectionPoolMonitoringEvent } = require("mongodb");
const User = require("../models/user")
const bcrypt = require("bcryptjs")


exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
    error: message,
  });
};

exports.postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (user) {
      const passCheck = await bcrypt.compare(password, user.password);
      if (passCheck) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          if (!err) {
            return res.redirect("/");
          }
        });
      } else {
        req.flash("error", "Invalid email or Password.");
        await req.session.save((err) => {
          if (!err) {
            return res.redirect("/login");
          }
        });
      }
    } else {
      req.flash("error", "Invalid email or Password.");
      await req.session.save((err) => {
        if (!err) {
          return res.redirect("/login");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res) => {
  try {
    await req.session.destroy()
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: req.session.isLoggedIn,
    error: errorMessage,
  });
};

exports.postSignup = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmpassword;

    const user = await User.findOne({ email: email });
    if (user) {
      req.flash("error", "E-mail exists already.");
      await req.session.save((err) => {
        if (!err) {
          return res.redirect("/signup");
        }
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await newUser.save();
    await req.session.save((err) => {
      if (!err) {
        return res.redirect("/login");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

