const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const {assert} = chai;

const {Harness} = require("../lib/harness");

describe("Harness", function() {
  it("resolves a promise when a matching message is sent", async function() {
    const h = new Harness({name: "pushbot"});
    h.load(__dirname, "scripts/ping");

    h.say("pushbot: ping");
    await assert.isFulfilled(h.waitForResponse("pong"));
  });

  it("rejects a promise when a non-matching message is sent", async function() {
    const h = new Harness({name: "pushbot"});
    h.load(__dirname, "scripts/ping");

    h.say("pushbot: ping");
    await assert.isRejected(h.waitForResponse("prong"));
  });

  it("routes messages among multiple rooms", async function() {
    const h = new Harness({name: "!"});
    h.load(__dirname, "scripts/ping");

    const r0 = h.createRoom("room-zero");
    const r1 = h.createRoom("room-one");

    r0.say("!ping");
    await assert.isFulfilled(r0.waitForResponse("pong"));

    r1.say("!ping");
    await assert.isFulfilled(r1.waitForResponse("pong"));

    h.setCurrentRoom("room-one");
    h.say("!ping");
    await assert.isFulfilled(r1.waitForResponse("pong"));
    h.say("!ping");
    await assert.isFulfilled(h.waitForResponse("pong"));
  });

  it("manages different users", async function() {
    const h = new Harness({name: "."});
    h.createUser("0", "user0");
    h.createUser("1", "user1", {extra: "here"});
    h.load(__dirname, "scripts/me");

    h.sayAs("user0", ".who am i");
    await h.waitForResponse(
      "user0: your username is user0 with id 0 and extra prop -"
    );

    h.sayAs("1", ".who am i");
    await h.waitForResponse(
      "user1: your username is user1 with id 1 and extra prop here"
    );

    h.setCurrentUser("1");
    h.say(".who am i");
    await h.waitForResponse(
      "user1: your username is user1 with id 1 and extra prop here"
    );

    h.setCurrentUser("user0");
    h.say(".who am i");
    await h.waitForResponse(
      "user0: your username is user0 with id 0 and extra prop -"
    );
  });
});
