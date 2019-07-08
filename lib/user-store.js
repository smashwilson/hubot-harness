class UserStore {
  constructor(robot) {
    this.robot = robot;
    this.currentUser = this.createUser("default-uid", "default");
  }

  createUser(id, name, extra = {}) {
    const existing = this.robot.brain.users();
    if (existing.hasOwnProperty(id)) {
      throw new Error(`Duplicate user ID: ${id}`);
    }
    return this.robot.brain.userForId(id, {name, ...extra});
  }

  getUser(idOrName) {
    const users = this.robot.brain.users();
    if (users.hasOwnProperty(idOrName)) {
      return users[idOrName];
    } else {
      return this.robot.brain.userForName(idOrName);
    }
  }

  setCurrentUser(idOrName) {
    const user = this.getUser(idOrName);
    if (!user) {
      throw new Error(`Unrecognized user ${idOrName}`);
    }
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

module.exports = {UserStore};
