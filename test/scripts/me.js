// Description:
//   User object introspection.

module.exports = function(robot) {
  robot.respond(/who am i/, msg => {
    const user = msg.message.user;
    msg.reply(
      `your username is ${user.name} with id ${
        user.id
      } and extra prop ${user.extra || "-"}`
    );
  });
};
