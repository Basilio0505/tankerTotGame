/*global Phaser, window*/
import BootScene from './scenes/BootScene.js';
import MainScene from './scenes/MainScene.js';
import TestScene0 from './scenes/TestScene0.js';
import EndLevelScene from './scenes/EndLevelScene.js';
import Config from './config/config.js';
import BasilioTest from './scenes/BasilioTest.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Main', MainScene);
    this.scene.add('TestScene0', TestScene0);
    this.scene.add('EndLevelScene', EndLevelScene);
    this.scene.add('BasilioTest', BasilioTest)
    this.scene.start('Boot');
  }
}

window.game = new Game();
