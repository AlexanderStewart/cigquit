const dbConfig = require("./config");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "client/build")));

require("dotenv").config();
const PORT = 3001;

// connecting to mongodb
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB database!");
    app.listen(PORT, (err) => {
      if (err) console.log(err);
      console.log("listening on port " + PORT + "!");
    });
  })
  .catch((err) => console.log(err));

const User = require("./models/user");

// Protect post request / Updated for MongoDB
app.post("/api/protected", async function (req, res) {
  let validated = false;
  const token = req.body.token;

  if (!token) return res.json("No Token");

  try {
    // Verify token
    validated = jwt.verify(token, process.env.JWTSECRET);
    // Add user from payload
    req.user = validated;
  } catch (err) {
    return res.json({ message: "Token is not valid" });
  }

  const id = req.user.id;

  User.findOne({ _id: id }, function (err, user) {
    if (err) {
      console.log(err);
      return res.json({ message: err });
    }

    if (!user) {
      return res.json({ message: "N0_USER" });
    }

    // Happy path
    res.json({ validated, user });
  });
});

// Signup post request. Links with client file signup.js / Updated for MongoDB
app.post("/api/signup", async function (req, res) {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const plaintextPassword = req.body.password;

  function emailValid(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  if (email.length === 0) return res.json({ message: "EMAIL_EMPTY" });
  if (!emailValid(email)) return res.json({ message: "EMAIL_NOT_VALID" });
  if (firstName.length === 0) return res.json({ message: "FIRST_NAME_EMPTY" });
  if (lastName.length === 0) return res.json({ message: "LAST_NAME_EMPTY" });
  if (plaintextPassword.length === 0)
    return res.json({ message: "PASSWORD_EMPTY" });
  if (plaintextPassword.length < 6)
    return res.json({ message: "PASSWORD_SHORT" });

  User.find({ email: email }, function (err, docs) {
    if (docs.length) {
      return res.json({ message: "ER_DUP_ENTRY" });
    }
  });

  const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  user.save().then((result, err) => {
    if (err) {
      console.log(err);
      return res.json({ message: err });
    }

    const id = result._id;

    jwt.sign(
      { id: id },
      process.env.JWTSECRET,
      { expiresIn: 86400 },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: "SUCCESS",
          token,
          user: {
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
          },
        });
      }
    );
  });
});

// Login post request. Links with client file login.js / Updated for MongoDB
app.post("/api/login", async function (req, res) {
  const email = req.body.email;
  const plaintextPassword = req.body.password;

  function emailValid(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  if (email.length === 0) return res.json({ message: "EMAIL_EMPTY" });
  if (!emailValid(email)) return res.json({ message: "EMAIL_NOT_VALID" });
  if (plaintextPassword.length === 0)
    return res.json({ message: "PASSWORD_EMPTY" });

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log(err);
      return res.json({ message: err });
    }

    if (!user) {
      return res.json({ message: "EMAIL_NOT_ON_FILE" });
    }

    const id = user._id;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
    const hashPassword = user.password;

    bcrypt.compare(plaintextPassword, hashPassword, function (err, worked) {
      if (err) throw err;
      if (worked) {
        // Happy path.

        jwt.sign(
          { id: id },
          process.env.JWTSECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) throw err;
            res.json({
              message: "SUCCESS",
              token,
              user: {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
              },
            });
          }
        );
      } else {
        return res.json({ message: "WRONG_PASSWORD" });
      }
    });
  });
});

// Setting stats post request. Linked with client file setQuitStats.js / Updated for MongoDB
app.post("/api/stats", (req, res) => {
  const quitDate = req.body.quitDate;
  const cigCount = req.body.cigCount;
  const cigPerPack = req.body.cigPerPack;
  const moneyPerPack = req.body.moneyPerPack;
  const userId = req.body.userId;

  if (!quitDate) {
    return res.json({ message: "QUIT_DATE_EMPTY" });
  } else if (!cigCount) {
    return res.json({ message: "CIG_COUNT_EMPTY" });
  } else if (!Number.isInteger(parseFloat(cigCount))) {
    return res.json({ message: "CIG_COUNT_NOT_INT" });
  } else if (!cigPerPack) {
    return res.json({ message: "CIG_PER_PACK_EMPTY" });
  } else if (!moneyPerPack) {
    return res.json({ message: "MONEY_PER_PACK_EMPTY" });
  }

  User.updateOne(
    { _id: userId },
    {
      quitDate: quitDate,
      cigCount: cigCount,
      cigPerPack: cigPerPack,
      moneyPerPack: moneyPerPack,
    }
  ).then((result, err) => {
    if (err) {
      console.log(err);
      return res.json({ message: "ERROR" });
    } else {
      return res.json({ message: "SUCCESS" });
    }
  });
});

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
