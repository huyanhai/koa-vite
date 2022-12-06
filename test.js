const { fork } = require("child_process");

const child = fork("./demo.js", ["args1", "args2"]);

child.send("xxx1");

child.on("message", () => {
  child.send("xxx", child);
});
