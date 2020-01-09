// @flow

class HighscoreManager {
  highscore: number;

  constructor() {
    this.highscore = parseInt(localStorage.getItem('localHighscore')) || 0;
  }

  addScore(score: number) {
    if (score > this.highscore) {
      this.highscore = score;

      try {
        localStorage.setItem('localHighscore', this.highscore.toString());
      } catch (err) {
        console.error('Saving to local storage failed');
        console.error(err);
      }
    }
  }

  localHighscore() {
    return this.highscore
  }
}

const instance = new HighscoreManager();

export default instance;