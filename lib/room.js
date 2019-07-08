const Hubot = require("hubot/es2015");

const {Matcher} = require("./matcher");

class Room {
  constructor(adapter, userStore, name) {
    this.adapter = adapter;
    this.userStore = userStore;
    this.name = name;

    this.received = [];
    this.matchers = [];

    this.sub = adapter.onDidProduceMessage(msg => {
      if (msg.room === this.name) {
        const matcher = this.matchers.shift();
        if (matcher) {
          matcher.match(msg);
        } else {
          this.received.push(msg);
        }
      }
    });
  }

  say(text) {
    const user = this.userStore.getCurrentUser();
    user.room = this.name;
    const message = new Hubot.TextMessage(user, text, "id");
    return new Promise(resolve => this.adapter.robot.receive(message, resolve));
  }

  sayAs(userIdentifier, text) {
    const user = this.userStore.getUser(userIdentifier);
    if (!user) {
      throw new Error(`Unrecognized user: ${userIdentifier}`);
    }
    user.room = this.name;
    const message = new Hubot.TextMessage(user, text, "id");
    return new Promise(resolve => this.adapter.robot.receive(message, resolve));
  }

  waitForResponse(pattern) {
    return new Promise((resolve, reject) => {
      const matcher = new Matcher(pattern, resolve, reject);
      const recent = this.received.shift();
      if (recent) {
        matcher.match(recent);
      } else {
        this.matchers.push(matcher);
      }
    });
  }

  dispose() {
    this.sub.dispose();
  }
}

module.exports = {Room};
