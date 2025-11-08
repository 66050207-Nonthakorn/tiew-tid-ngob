export class Timer {
  private startTime = 0;
  private elapsed = 0;
  private running = false;
  private checkpoints: number[] = [];

  start() {
    if (this.running) return;
    this.startTime = Date.now() - this.elapsed;
    this.running = true;
    this.checkpoints.push(this.startTime);
  }

  pause() {
    if (!this.running) return;
    this.elapsed = Date.now() - this.startTime;
    this.running = false;
  }

  reset() {
    this.startTime = 0;
    this.elapsed = 0;
    this.running = false;
    this.checkpoints = [];
  }

  checkpoint() {
    const time = this.getElapsed();
    this.checkpoints.push(this.startTime + time);
  }

  getStartTime() {
    return this.startTime;
  }

  getElapsed() {
    return this.running ? Date.now() - this.startTime : this.elapsed;
  }

  getElapsedFormatted() {
    const elapsed = this.getElapsed();
    return formatTime(elapsed);
  }

  getCheckpoints() {
    return this.checkpoints;
  }
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  const pad = (n: number, z = 2) => n.toString().padStart(z, "0");
  return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}
