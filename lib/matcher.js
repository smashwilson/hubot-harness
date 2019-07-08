class Matcher {
  constructor(pattern, resolve, reject, timeout) {
    this.pattern = pattern;
    this.resolve = resolve;
    this.reject = reject;

    this.timer = setTimeout(this.expire.bind(this), timeout);
    this.completed = false;
  }

  match(msg) {
    if (this.completed) {
      return;
    }
    this.completed = true;
    clearTimeout(this.timer);

    const ok = this.pattern.test
      ? this.pattern.test(msg.message)
      : msg.message === this.pattern;
    if (ok) {
      this.resolve();
    } else {
      this.reject(
        new Error(`Expected [${this.pattern}] to match [${msg.message}]`)
      );
    }
  }

  expire() {
    if (this.completed) {
      return;
    }
    this.completed = true;

    this.reject(
      new Error(`Timed out waiting for a response matching [${this.pattern}]`)
    );
  }
}

module.exports = {Matcher};
