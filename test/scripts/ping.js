// Description:
//   Liveness check.

module.exports = function (robot) {
  robot.respond(/ping/, (msg) => {
    msg.send("pong");
  });
};
