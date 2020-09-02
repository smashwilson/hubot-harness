# hubot-harness

![npm](https://img.shields.io/npm/v/hubot-harness?style=plastic) | ![Node CI](https://github.com/smashwilson/hubot-adventure/workflows/Node%20CI/badge.svg)

This is a testing harness for Hubot scripts and packages that takes advantage of language features like async/await, with support for interactions across multiple rooms and users.

## Installation

Hubot 3.x is a peer dependency, so your package will also need to depend on Hubot itself separately. If you're writing Hubot scripts, this is likely already the case.

```
npm install --dev hubot-harness
```

## Use

Here's an example using a [Mocha](https://mochajs.org/) test suite. Note that there isn't anything Mocha-specific in the test harness.

```js
const {Harness} = require("hubot-harness");

describe("my command", function () {
  let hubot;

  beforeEach(function () {
    hubot = new Harness({name: "the-bot"});

    // Use .load() to initialize this bot with the scripts you wish to test.
    // Its arguments are combined with `path.resolve()`.
    hubot.load(__dirname, "../scripts/my-script");
  });

  it("runs a command and waits for the response", async function () {
    hubot.say("the-bot: ping");
    await hubot.waitForResponse("PONG");
  });

  it("can match responses with regular expressions", async function () {
    hubot.say("the-bot: do the thing");
    await hubot.waitForResponse(/the thing is complete/);
  });

  it("can say things as different users", async function () {
    hubot.createUser("id0", "user-zero");
    hubot.createUser("id1", "user-one", {extra: true});

    hubot.sayAs("id0", "can i do this");
    await hubot.waitForResponse(/no/);

    hubot.sayAs("id1", "can i do this");
    await hubot.waitForResponse(/yes/);
  });

  it("can say and listen in different rooms", async function () {
    const room0 = hubot.createRoom("#zero");
    const room1 = hubot.createRoom("#one");

    room0.say("which room is this");
    await room0.waitForResponse(/#zero/);

    room1.say("which room is this");
    await room1.waitForResponse(/#one/);
  });
});
```
