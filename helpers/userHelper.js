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



module.exports = { users, emailCheck, passCheck, urlsForUser };
//
//loop through short URLS
//compare ID inside function to ID inside shortURL
//return long URL and short URL from that id


