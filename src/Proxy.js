const User = require("mppn-base").User;
const url = require("url");
const fs = require("fs");
const _ = require("lodash");
const channel = "" || "lolwutsecretlobbybackdoor";
const channelTest = "ProxyListS Test Room";

// Functions
let verifyTimeout = false;
function verify(master, data, i) {
  if (data.success + data.failed == data.input.length || verifyTimeout) {
    clearInterval(data.timeoutInt);
    const slaves = JSON.parse(fs.readFileSync(`${__dirname}/ProxyList.json`));
    let newSlaves = slaves.concat(data.output);
    newSlaves = _.uniq(newSlaves);
    fs.writeFileSync(`${__dirname}/ProxyList.json`, JSON.stringify(newSlaves, null, 2));
    fs.writeFileSync(`${__dirname}/ProxyInput.json`, '[]');
    console.log("Verification complete.");
    if (verifyTimeout) master.sendMessage(`Verification timed out (2m). (Partial Results) ${data.failed} failed, ${data.success} work.`);
    else master.sendMessage(`Verification complete. ${data.failed} failed, ${data.success} work.`);
    return verifyTimeout = false;
  }
  console.log(`Verification in process @ ${data.input[i]}.`);
  let slave = new User({
    "name": `Proxy Verifier @ ${data.input[i]}`,
    "channel": channelTest,
    "proxy": "http://" + data.input[i] + "/",
    "uri": "ws://www.multiplayerpiano.com:8080/"
  });
  let event = false;
  slave.once("ready", () => {
    event = true;
    console.log(`Slave sucess @ ${data.input[i]}`);
    data.success++;
    data.output.push(data.input[i]);
    if (slave) slave.destroy();
    slave = null;
    i++;
    setTimeout(() => { verify(master, data, i); }, 0);
  });
  slave.once("clienterror", () => {
    event = true;
    console.log(`Slave failure @ ${data.input[i]}`);
    data.failed++;
    if (slave) slave.destroy();
    slave = null;
    i++;
    setTimeout(() => { verify(master, data, i); }, 0);
  });
  setTimeout(() => {
    if (!event) {
      i++;
      verify(master, data, i); 
    }
  }, 5000);
}

// Main
const master = new User({
  "name": "ProxyListS Master",
  "channel": channel
});
master.on("status", s => {
  if (s.toLowerCase().includes("connecting")) {
    console.log("Master Connecting...");
  }
});
master.on("clienterror", e => {
  console.log("Master client invalid. Please find a new IP.");
});
master.on("ready", () => {
  console.log("Master Controller ready.");
  let proxies = [];
  try {
    proxies = JSON.parse(fs.readFileSync(`${__dirname}/ProxyList.json`));
  } catch(e) {
    console.warn(e);
    master.sendMessage("Unable to read the proxy list.");
  }
  master.on("a", m => {
    const prefix = "+";
    const owner = "03c9787365ef913ca626e51c";
    if (!m.a.startsWith(prefix) || m.p._id != owner) return;
    const args = m.a.split(" ");
    const argsLower = m.a.toLowerCase().split(" ");
    const command = m.a.substring(prefix.length, args[0].length).toLowerCase();
    if (command == "ping") {
      return master.sendMessage(`Pong! MPPA's ping time for this proxy is ${Math.abs(master.serverTimeOffset)}ms.`);
    }
    if (command == "verify") {
      try {
        const useNew = false;
        master.sendMessage("Verification of Proxies now running.");
        const input = JSON.parse(fs.readFileSync(`${__dirname}/ProxyInput.json`));
        const hostexists = (master.proxy ? input.indexOf(url.parse(master.proxy).host) : -1);
        if (hostexists != -1 && input[hostexists]) {
          input.splice(hostexists, 1);
          master.sendMessage("Host IP was found in verification list. Removed when testing.");
        }
        if (useNew) {
          const timeoutInt = setTimeout(() => {
            verifyTimeout = true;
          }, 120000);
          return verify(master, {
            "input": input,
            "output": [],
            "success": 0,
            "failed": 0,
            "timeoutInt": timeoutInt
          }, 0);
        }
        const output = [];
        let success = 0;
        let failed = 0;
        let timeout = false;
        for (let i = 0; i < input.length; i++) {
          try {
            let slave = new User({
              "name": `Proxy Verifier @ ${input[i]}`,
              "channel": channelTest,
              "proxy": "http://" + input[i] + "/"
            });
            slave.once("ready", () => {
              console.log(`Slave sucess @ ${input[i]}`);
              success++;
              output.push(input[i]);
              if (slave) slave.disconnect();
              slave = null;
            });
            slave.on("clienterror", () => {
              console.log(`Slave failure @ ${input[i]}`);
              failed++;
              if (slave) slave.disconnect();
              slave = null;
            });
            slave.connect();
          } catch(e) {
            failed++;
          }
        }
        const waitForFinish = setInterval(() => {
          console.log("Verification in process.");
          if (success + failed == input.length || timeout) {
            clearInterval(waitForFinish);
            const slaves = JSON.parse(fs.readFileSync(`${__dirname}/ProxyList.json`));
            let newSlaves = slaves.concat(output);
            newSlaves = _.uniq(newSlaves);
            fs.writeFileSync(`${__dirname}/ProxyList.json`, JSON.stringify(newSlaves, null, 2));
            fs.writeFileSync(`${__dirname}/ProxyInput.json`, '[]');
            console.log("Verification complete.");
            if (!timeout) return master.sendMessage(`Verification complete. ${failed} failed, ${success} work.`);
            else return master.sendMessage(`Verification timed out (2m). (Partial Results) ${failed} failed, ${success} work.`);
          }
        }, 1000);
        setTimeout(() => {
          timeout = true;
        }, 120000);
      } catch(e) {
        console.warn(e);
        return master.sendMessage("There was an internal error parsing this command. Check console for more information.");
      }
    }
    if (command == "eval") {
      try {
        return master.sendMessage(`Result: ${eval(m.a.substring(command.length+1, m.a.length))}`);
      } catch(e) {
        return master.sendMessage(`Result: ${e.message}`);
      }
    }
    if (command == "shutdown") {
      master.disconnect();
      process.exit();
    }
  });
});
master.connect();

process.on("unhandledRejection", console.error);