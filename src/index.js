/*global Phaser, window*/
import Config from './config/config.js';
import TitleScene from './scenes/TitleScene.js';
import CreditScene from './scenes/CreditScene.js';
import LevelSelect from './scenes/LevelSelect.js';
import TestScene0 from './scenes/TestScene0.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Level3 from './scenes/Level3.js';
import Level4 from './scenes/Level4.js';
import Level5 from './scenes/Level5.js';
import Level6 from './scenes/Level6.js';
import Level7 from './scenes/Level7.js';
import Level8 from './scenes/Level8.js';
import Level9 from './scenes/Level9.js';
import Section1End from './scenes/Section1End.js';
import Section2End from './scenes/Section2End.js';
import Section3End from './scenes/Section3End.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Title', TitleScene);
    this.scene.add('Credits', CreditScene);
    this.scene.add('LevelSelect', LevelSelect);
    this.scene.add('Level1', Level1);
    this.scene.add('Level2', Level2);
    this.scene.add('Level3', Level3);
    this.scene.add('Level4', Level4);
    this.scene.add('Level5', Level5);
    this.scene.add('Level6', Level6);
    this.scene.add('Level7', Level7);
    this.scene.add('Level8', Level8);
    this.scene.add('Level9', Level9);
    this.scene.add('Section1End', Section1End);
    this.scene.add('Section2End', Section2End);
    this.scene.add('Section3End', Section3End);
    this.scene.add('TestScene0', TestScene0);
    this.scene.start('Title');
  }
}

window.game = new Game();
