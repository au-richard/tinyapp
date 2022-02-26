const bcrypt = require('bcryptjs');

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
      console.log("User ID:", users[userID].id);
      return users[userID].id;
    }
  }
};

const passCheck = (id, password) => {
  if (id) {
    console.log("Password Check", users[id].password === password);
    console.log("Passwords Output", password, users[id].password);
    return bcrypt.compareSync(password, users[id].password);
  }
};

const urlsForUser = (id, urlDatabase) => {
  console.log("This is id, database", id, urlDatabase);
  let newProfile = {};
  for (const shortURL in urlDatabase) {
    console.log(shortURL);
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


module.exports = { users, emailCheck, passCheck, urlsForUser, getUserByEmail };