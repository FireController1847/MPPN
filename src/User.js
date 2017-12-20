const Client = require("./Client.js");

module.exports = class User extends Client {
  constructor(options) {
    super(options);
    if (!options) options = {};
    this.name = options.name || "Anonymous";
    this.on("ready", () => {
      this.setUsername(this.name);
    });
    this.setChannel(options.channel || "lobby");
    this.checkChannel = setInterval(() => {
      if (!this.channel || this.channel._id != options.channel || "lobby") 
        this.setChannel(options.channel || "lobby");
    }, 15000);
  }

  // Setters
  setUsername(name) {
    this.sendArray([{m: "userset", set: {"name": name}}]);
  }

  // Utilities
  sendMessage(msg) {
    return this.sendArray([{m: "a", message: msg}]);
  }
  press(note, vel, delay) {
    setTimeout(() => {
      this.startNote(note, vel);
    }, delay);
  }
};