# MPPN
Multiplayer Piano Node.js

# Usage
Download both User.js and Client.js, this is not a Node.js module, but a manual file. For more details on how to use check the example blow.

# Example
### User Example
```js
const User = require("mppn-base").User;
const options = {
  // Client / User
  "uri": "ws://www.multiplayerpiano.com/", // This usually is not required unless you want to change the internal connection URL.
  "proxy": "http://192.168.0.1:3123/", // This is where you'd include the proxy for this specific client. Your proxy MUST be HTTPS, but you use an HTTP url due to compatability issues with MPP.
  // User ONLY
  "name": "My Bot Name", // Sets the name when the bot becomes ready (user.on("ready"))
  "channel": "lolwutsecretlobbybackdoor" // Set the initial channel when the bot is created.
};
const user = new User(options);
user.on("ready", () => {
  // Client created and connected.
});
user.connect();
```

### Client Example
```js
// You should only use the client if you want pure MPP source with no utilities/extensions that the user file gives you.
const Client = require("mppn-base").Client;
// User utilities in the options are not available when using the client.
const options = {
  "uri": "See Above",
  "proxy": "See Above"
}
const client = new Client(options);
client.on("ready", () => {
  // Client created and connected.
});
client.connect();
```

# Q&A
### Why use this instead of making my own from the source of MPP?
Well, the Client.js has been updated to Node.js ES6 standards, which means there's more opportunities for modification. It's also got multiple buxfixes that the original client.js would error on due to it not being Node.js compatible. I also added an extra event called "ready" that gets called when the bot *first* connects to a room.

### Why use User instead of Client?
The User.js is an extension of the Client.js which adds more utility functions like .sendMessage and .setUsername. More utility functions are to come in the future. It will also have other utilities through the options, such as setting the initial channel and setting a username on ready. No more needing to call `client.setChannel()` or `client.setUsername()` before creating it.

### Why is there no start() function?
Because within the actual client, it was unessecary and useless. The function has been renamed to `connect()`, to make more sense. You can also call disconnect(), but due to a function within the original client.js it will attempt to auto-reconnect.
