const Hubot = require("hubot/es2015");

class Adapter extends Hubot.Adapter {
  constructor(robot) {
    super(robot);

    this.subscribers = [];
  }

  send(envelope, ...strings) {
    for (const string of strings) {
      for (const subscriber of this.subscribers) {
        subscriber({...envelope, message: string});
      }
    }
  }

  reply(envelope, ...strings) {
    this.send(envelope, ...strings.map((s) => `${envelope.user.name}: ${s}`));
  }

  run() {
    //
  }

  close() {
    this.subscribers = [];
  }

  onDidProduceMessage(callback) {
    this.subscribers.push(callback);

    return {
      dispose: () => {
        this.subscribers = this.subscribers.filter((cb) => cb !== callback);
      },
    };
  }
}

module.exports = {Adapter};
