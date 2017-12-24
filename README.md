# MPPN
Multiplayer Piano Node.js

# Usage
Download both User.js and Client.js, this is not a Node.js module, but a manual file. For more details on how to use check the example blow.

# Example
## User Example
```js
// User.js and Client.js must be in the same file to use User.
const User = require("./User.js");
const options = {
  // Client.js / User.js
  "uri": "ws://www.multiplayerpiano.com/", // This usually is not required unless you want to change the internal connection URL.
  "proxy": "http://192.168.0.1:3123/", // This is where you'd include the proxy for this specific client. Your proxy MUST be HTTPS, but you use an HTTP url due to compatability issues with MPP.
  // User.js ONLY
  "name": "My Bot Name", // Sets the name when the bot becomes ready (user.on("ready"))
  "channel": "lolwutsecretlobbybackdoor" // Set the initial channel when the bot is created.
};
const user = new User(options);
user.on("ready", () => {
  // Client created and connected.
});
```

## Client Example
```js
// You should only use the client if you want pure MPP source with no utilities/extensions that the user file gives you.
const Client = require("./Client.js");
// User utilities in the options are not available when using the client.
const options = {
  "uri": "See Above",
  "proxy": "See Above"
}
const client = new Client(options);
client.on("ready", () => {
  // Client created and connected.
});
```
