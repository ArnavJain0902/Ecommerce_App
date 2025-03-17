const { ConnectionPoolMonitoringEvent, ObjectId } = require("mongodb");
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const crypto = require("crypto")

const transporter = nodemailer.createTransport({
  host:"sandbox.smtp.mailtrap.io",
  port:2525,
  secure:false,
  auth:{
    user:"08a53ba263a9e8",
    pass:"1d9095cf9ccbe0"
  }
})

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
    await req.session.destroy((err) => {
      if (!err) {
        return res.redirect("/");
      }
    });
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

    if(password !== confirmedPassword){
      req.flash("error","Passwords do not match.")
      return res.redirect("/signup")
    }
    const user = await User.findOne({ email: email });
    if (user) {
      req.flash("error", "E-mail exists already.");
      return res.redirect("/signup")
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
        res.redirect("/login");
        const mailOptions = {
          from: "arnavjain0902@gmail.com",
          to: email,
          subject: "Sign-in confirmation",
          text: `Thank You for signing in.`,
        };
        
        return transporter.sendMail(mailOptions, (err, info) => {
          if (!err) {
            console.log("Sent Email to ", email);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getReset = (req, res, next) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    error:error
  });
};

exports.postReset = async (req, res, next)=>{
  crypto.randomBytes(32,async (err, buffer)=>{
    if(err){
      console.log(err);
      return res.redirect("/reset")
    }
    const token = buffer.toString("hex")
    const user = await User.findOne({email:req.body.email})
    if(!user){
      req.flash("error","No account with that email found.");
      return res.redirect("/reset")
    }
    user.resetToken = token
    user.resetTokenExpiration = Date.now()+3600000
    await User.updateOne({email:req.body.email},{
      resetToken: token,
      resetTokenExpiration: Date.now()+3600000
    })
    res.redirect("/")
    transporter.sendMail({
      to: req.body.email,
      from: "arnavjain0902@gmail.com",
      subject: "Password Reset",
      html: `<p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to reset </p>
      `,
    });
  })
}

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: new Date() },
    });

    let error = req.flash("error");
    if (error.length > 0) {
      error = error[0];
    } else {
      error = null;
    }
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "Reset Password",
      error: error,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword,12);
    const userId = new ObjectId(req.body.userId);
    await User.updateOne(
      { _id:userId },
      {
        password: hashedPassword,
        resetToken:undefined,
        resetTokenExpiration:undefined
      }
    );
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};