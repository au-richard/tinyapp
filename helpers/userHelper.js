const bcrypt = require("bcryptjs");
const { urlDatabase } = require("../data/userData");

//Creating short URL link
const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

//List of all users and account info
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

//Checking input email matches one in database
const emailCheck = (email) => {
  for (userID in users) {
    if (users[userID].email === email) {
      return users[userID].id;
    }
  }
};

//Checking input password matches one in database(based on emailCheck passing)
const passCheck = (id, password) => {
  if (id) {
    return bcrypt.compareSync(password, users[id].password);
  }
};

//Display only those URLs connected to that user
const urlsForUser = (id, urlDatabase) => {
  let newProfile = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL]["userID"] === id) {
      newProfile[shortURL] = urlDatabase[shortURL];
    }
  }
  return newProfile;
};

//Checks if Account is in database based on email
const getUserByEmail = function (email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return null;
};

//User Validation for Permissions
const checkUserPermission = function (userId, shortURL) {
  if (urlCheck(shortURL) && urlDatabase[shortURL].userID === users[userId].id) {
    return true;
  }
  return false;
};

//Checking if URLS Exist
const urlCheck = function (shortURL) {
  return urlDatabase[shortURL] !== undefined;
};

module.exports = {
  users,
  emailCheck,
  passCheck,
  urlsForUser,
  getUserByEmail,
  generateRandomString,
  checkUserPermission,
  urlCheck
};