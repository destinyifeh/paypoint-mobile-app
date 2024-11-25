export function getCurrentTime() {
  return new Date().valueOf();
}

export class Stopwatch {
  start() {
    this.startTime = getCurrentTime();
    this.stopTime = null;
  }

  stop() {
    this.stopTime = getCurrentTime();
  }

  get secondsElapsed() {
    return this.timeElapsed / 1000;
  }

  get timeElapsed() {
    if (this.stopTime) {
      return this.stopTime - this.startTime;
    }

    return getCurrentTime() - this.startTime;
  }
}
