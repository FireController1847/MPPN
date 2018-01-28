const User = require("mppn-base").User;
const master = new User({
  "name": "ProxyListS Master",
  "channel": "lolwutsecretlobbybackdoor",
  "proxy": "http://185.82.212.95:8080/",
  "uri": "ws://www.multiplayerpiano.com:8080",
  "proxyOptions": {
    "secureProxy": "false"
  }
});
master.connect();
master.on("ready", () => {
  console.log("Master Ready");
});
master.on("clienterror", console.error);