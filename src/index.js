/*global Phaser, window*/
import Config from './config/config.js';
import TitleScene from './scenes/TitleScene.js';
import TestScene0 from './scenes/TestScene0.js';
import Level1 from './scenes/Level1.js';
import Level1End from './scenes/Level1End.js';
import Level3 from './scenes/Level3.js';
import Level3End from './scenes/Level3End.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Title', TitleScene);
    this.scene.add('Level1', Level1);
    this.scene.add('Level1End', Level1End);
    this.scene.add('Level3', Level3);
    this.scene.add('Level3End', Level3End);
    this.scene.add('TestScene0', TestScene0);
    this.scene.start('Title');
  }
}

window.game = new Game();
