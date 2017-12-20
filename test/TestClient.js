const User = require('../src/User.js');

// Create a new user and connect to a test channel.
const user = new User({
  "name": "Test User",
  "channel": "MPPN"
});

user.on("ready", () => {
  console.log("Connected.");
  user.sendMessage("Testing.");
  user.press("c3", 1);
  user.press("c4", 0.5, 1000);
  user.press("c5", 0.25, 2000);
  user.press("c6", 0.125, 3000);
  user.press("c7", 0.1, 4000);
  setTimeout(() => {
    process.exit();
  }, 5000);
});

user.on("clienterror", console.warn);

user.connect();