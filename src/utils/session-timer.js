export default class SessionTimer {

  constructor(props) {
    props && this.initialize(props);

    this.end = this.end.bind(this);
    this.restart = this.restart.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  initialize(props) {
    this.isActive = false;

    this.onEnd = props.onEnd
    this.onRestart = props.onRestart
    this.onStart = props.onStart
    this.timeout = props.timeout
  }


  end(silent=false) {
    this.stop();

    !silent && this.onEnd && this.onEnd();
  }

  restart(silent=false) {
    console.log('ABOUT TO RESTART');
    if (!this.isActive) {
      return
    }

    this.stop();
    this.start(true);

    !silent && this.onRestart && this.onRestart();
  }

  start(silent=false) {
    console.log('ABOUT TO START')
    this.isActive = true;
    this.activeTimer = setTimeout(this.end, this.timeout);

    !silent && this.onStart && this.onStart();
  }

  stop() {
    this.isActive = false;
    clearTimeout(this.activeTimer);
    this.activeTimer = null;
  }

}
