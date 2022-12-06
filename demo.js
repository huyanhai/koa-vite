console.log("args1", process.argv);

process.on("message", (m) => {
  console.log("child", m);
});

process.send({ hello: "parent" });
