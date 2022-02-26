const express = require("express");
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const { users, emailCheck, passCheck, urlsForUser, generateRandomString } = require("./helpers/userHelper");
const { urlDatabase } = require("./data/userData.js");

app.set("view engine", "ejs");

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["user_id", "email", "password"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.listen(PORT, () => {
  console.log(`Tiny App listening on port ${PORT}!`);
});

//App GET
//Homepage
app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

//Render Login Page
app.get("/login", (req, res) => {
  const userID = req.session["user_id"];
  const email = req.session["email"];;
  const templateVars = {
    user: users[userID],
    email
  };
  res.render("login", templateVars);
});

//Checking login
app.get("/urls", (req, res) => {
  const userID = req.session["user_id"];
  const urlsToDisplay = urlsForUser(userID, urlDatabase);
  if (users[userID]) {
    const templateVars = {
      urls: urlsToDisplay,
      user: users[userID]
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

//Rendering Create New URL Page
app.get("/urls/new", (req, res) => {
  const userID = req.session["user_id"];
  const email = req.session["email"];
  if (!userID) {
    res.redirect("/login");
  } else {
    const templateVars = {
      user: users[userID],
      email
    };
    res.render("urls_new", templateVars);
  }
});

//Shortening URL, URL ID Page
app.get("/urls/:id", (req, res) => {
  const userID = req.session["user_id"];
  const email = req.session["email"];
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    shortURL,
    longURL,
    user: users[userID],
    email
  };
  res.render("urls_show", templateVars);
});

//Outputting Short URL With Long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//Render New User Page
app.get("/register", (req, res) => {
  const userID = req.session["user_id"];
  const email = req.session["email"];
  const password = req.session["password"];
  const templateVars = {
    user: users[userID],
    email,
    password
  };
  res.render("register", templateVars);
});


//App POSTS
//Creating New URL
app.post("/urls", (req, res) => {
  const userID = req.session["user_id"];
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    user: userID
  };
  res.redirect(`/urls/${shortURL}`);
});

//Deleting URL
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//Editing Long URL
app.post("/urls/:id", (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.id;
  const newURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: newURL,
    user: userID
  };
  res.redirect("/urls");
});

//Create New User
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).send('Bad Request');
  } else if (emailCheck(email)) {
    res.status(404).send('User already exists');
  } else {
    const id = generateRandomString();
    users[id] = {
      id,
      email,
      password: bcrypt.hashSync(password, 10)
    };
    req.session["user_id"] = id;
    res.redirect("/urls");
  }
});

//Login User
app.post("/login", (req, res) => {
  const userId = emailCheck(req.body.email);
  const passMatch = passCheck(userId, req.body.password);
  if (!userId || !passMatch) {
    return res.status(403).send('Bad Request');
  } else {
    req.session["user_id"] = userId;
    res.redirect("/urls");
  }
});

//Logout User
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});