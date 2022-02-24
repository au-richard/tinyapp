const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { users, emailCheck, passCheck } = require("./helpers/userHelper");
const { urlDatabase } = require("./data/userData.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");


const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    email: users[req.cookies.email]
  };
  res.render("urls_new", templateVars);
});

//Creating New URL
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

//Deleting URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//Editing Long URL
app.post("/urls/:shortURL/edit", (req, res) => {
  console.log(req);  // Log the POST request body to the console
  const shortURL = req.params.shortURL;
  const newURL = req.body.longURL;
  urlDatabase[shortURL] = newURL;
  console.log(shortURL);
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

//Shortening URL
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    user: users[req.cookies.user_id],
    email: users[req.cookies.email]
  };
  res.render("urls_show", templateVars);
});

//Outputting Short URL With Long URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//Render New User Page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    email: users[req.cookies.email],
    password: users[req.cookies.password]
  };
  res.render("register", templateVars);
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
    users[id] = { id, email, password };
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

//render Login Page
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies.email] };
  res.render("login", templateVars);
});

//Login User
app.post("/login", (req, res) => {
  const userId = emailCheck(req.body.email);
  const passMatch = passCheck(userId, req.body.password);
  if (!userId || !passMatch) {
    return res.status(403).send('Bad Request');
  }
  console.log(req.body);
  res.cookie("user_id", userId);
  console.log(users);
  res.redirect("/urls");
});

//Logout User
app.post("/logout", (req, res) => {
  const userId = req.body.email;
  console.log(req.body);
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); 