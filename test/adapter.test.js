const {assert} = require("chai");
const Hubot = require("hubot/es2015");
const path = require("path");

const {Adapter} = require("../lib/adapter");

describe("Adapter", function() {
  let adapter;

  beforeEach(function() {
    adapter = new Adapter({});
  });

  it("calls a callback when a message arrives", function() {
    adapter.send({room: "default"}, "before");

    const received = [];
    const sub = adapter.onDidProduceMessage(m => received.push(m));

    adapter.send({room: "default"}, "first");
    adapter.send({room: "default"}, "second", "third");
    adapter.send({room: "different"}, "fourth");

    assert.deepEqual(received, [
      {message: "first", room: "default"},
      {message: "second", room: "default"},
      {message: "third", room: "default"},
      {message: "fourth", room: "different"},
    ]);

    sub.dispose();

    adapter.send({room: "default"}, "after");
    assert.lengthOf(received, 4);
  });
});
