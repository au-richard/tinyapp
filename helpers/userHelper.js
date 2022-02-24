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

module.exports = { users, emailCheck, passCheck };