const path = require("path");
const Hubot = require("hubot/es2015");

const {Adapter} = require("./adapter");
const {UserStore} = require("./user-store");
const {Room} = require("./room");

class AdaptedRobot extends Hubot.Robot {
  loadAdapter() {
    this.logger.debug("Loading hubot-harness adapter");
    this.adapter = new Adapter(this);
  }
}

class Harness {
  constructor(options) {
    this.rooms = new Map();

    this.robot = new AdaptedRobot("", "", false, options.name, options.alias);

    this.adapter = this.robot.adapter;
    this.userStore = new UserStore(this.robot);

    this.currentRoom = this.createRoom("default");
  }

  load(...fileNames) {
    const fullPath = path.resolve(...fileNames);
    const resolvedPath = require.resolve(fullPath);
    const dir = path.dirname(resolvedPath);
    const base = path.basename(resolvedPath);

    this.robot.loadFile(dir, base);
  }

  createRoom(identifier) {
    const room = new Room(this.adapter, this.userStore, identifier);
    this.rooms.set(identifier, room);
    return room;
  }

  createUser(id, username, extra = {}) {
    return this.userStore.createUser(id, username, extra);
  }

  setCurrentRoom(identifier) {
    const room = this.rooms.get(identifier);
    if (!room) {
      throw new Error(`Unrecognized room identifier: ${identifier}`);
    }
    this.currentRoom = room;
  }

  setCurrentUser(userIdentifier) {
    this.userStore.setCurrentUser(userIdentifier);
  }

  say(text) {
    this.currentRoom.say(text);
  }

  sayAs(userIdentifier, text) {
    this.currentRoom.sayAs(userIdentifier, text);
  }

  waitForResponse(pattern) {
    return this.currentRoom.waitForResponse(pattern);
  }
}

module.exports = {Harness};
