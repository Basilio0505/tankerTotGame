/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import MainScene from './scenes/MainScene.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Main', MainScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
