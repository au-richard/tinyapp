const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "a9ml61": "http://www.instagram.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

const emailCheck = (email) => {
  for (userID in users) {
    if (users[userID].email === email) {
      console.log("User ID:", users[userID].id);
      return users[userID].id;
    }
  }
};

const passCheck = (id, password) => {
  if (id) {
    console.log("Password Check", users[id].password === password);
    return users[id].password === password;
  }
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
  res.render("urls_new");
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
    user: users["userId"]
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
    user: users["userId"]
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
  const templateVars = { user: users["userId"] };
  res.render("register", templateVars);
});

//Create New User
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Bad Request');
  }
  const newId = generateRandomString();
  users[newId] = { email, password, newId };
  res.cookie("userId", users[newId].newId);
  res.redirect("/urls");

});

//render Login Page
app.get("/login", (req, res) => {
  const templateVars = { user: users["userId"] };
  res.render("login", templateVars);
});

//Login User
app.post("/login", (req, res) => {
  const userId = emailCheck(req.body.email);
  const passMatch = passCheck(userId, req.body.password);
  //If a user with that e-mail cannot be found, return a response with a 403 status code.
  if (!userId || !passMatch) {
    return res.status(403).send('Bad Request');
  }

  //If both checks pass, set the user_id cookie with the matching user's random ID, then redirect to /urls.
  console.log(req.body);
  res.cookie("userId", userId);
  console.log(users);
  res.redirect("/urls");
});

//Logout User
app.post("/logout", (req, res) => {
  console.log(req.body.username);
  res.clearCookie("userId", req.body.username);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});