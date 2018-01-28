const WebSocket = require("ws");
const client = new WebSocket("ws://www.multiplayerpiano.com:443/", {
  "headers": {"origin": "http://www.multiplayerpiano.com"}
});

client.addEventListener("close", e => {
  console.log("Closed");
});
client.addEventListener("error", err => {
  console.log(err.msg);
});
client.addEventListener("open", e => {
  this.sendArray([{m: "hi"}]);
  console.log("OPEN");
});
client.addEventListener("message", e => {
  try {
    const transmission = JSON.parse(e.data);
    for (let i = 0; i < transmission.length; i++) {
      const msg = transmission[i];
      console.log(msg);
    }
  } catch(err) {
    console.error(err);
  }
});