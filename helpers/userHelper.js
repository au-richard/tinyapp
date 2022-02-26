const bcrypt = require('bcryptjs');

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const emailCheck = (email) => {
  for (userID in users) {
    if (users[userID].email === email) {
      return users[userID].id;
    }
  }
};

const passCheck = (id, password) => {
  if (id) {
    return bcrypt.compareSync(password, users[id].password);
  }
};

const urlsForUser = (id, urlDatabase) => {
  let newProfile = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL]["userID"] === id) {
      newProfile[shortURL] = urlDatabase[shortURL];
    }
  }
  return newProfile;
};

const getUserByEmail = function (email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return null;
};


module.exports = { users, emailCheck, passCheck, urlsForUser, getUserByEmail, generateRandomString };