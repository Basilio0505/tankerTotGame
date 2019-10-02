/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import TestScene0 from './scenes/TestScene0.js';
import EndLevelScene from './scenes/EndLevelScene.js';
import Config from './config/config.js';
import Level1 from './scenes/Level1.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('TestScene0', TestScene0);
    this.scene.add('EndLevelScene', EndLevelScene);
    this.scene.add('Level1', Level1);
    this.scene.start('Boot');
  }
}

window.game = new Game();
