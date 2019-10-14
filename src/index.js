/*global Phaser, window*/
import Config from './config/config.js';
import TitleScene from './scenes/TitleScene.js';
import TestScene0 from './scenes/TestScene0.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Section1End from './scenes/Section1End.js';
import Section2End from './scenes/Section2End.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Title', TitleScene);
    this.scene.add('Level1', Level1);
    this.scene.add('Level2', Level2);
    this.scene.add('Section1End', Section1End);
    this.scene.add('Section2End', Section2End);
    this.scene.add('TestScene0', TestScene0);
    this.scene.start('TestScene0');
  }
}

window.game = new Game();
