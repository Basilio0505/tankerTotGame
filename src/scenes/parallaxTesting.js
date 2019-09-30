/*global Phaser*/
export default class Parallax extends Phaser.Scene {
  constructor () {
    super('Parallax');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets

    this.load.image('background','./assets/background.png');
    this.load.image('mountains','./assets/mountains.png');
    this.load.image('trees','./assets/trees.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene

    //Add background
    this.background = this.add.tileSprite(this.centerX,this.centerY,0,0, 'background');
    this.mountains = this.add.tileSprite(this.centerX,this.centerY+100,0,0, 'mountains');
    this.trees = this.add.tileSprite(this.centerX,this.centerY+150,0,0, 'trees');




  }

  update (time, delta) {
    // Update the scene
    this.background.tilePositionX -= 0.05;
    this.mountains.tilePositionX -= 0.1;
    this.trees.tilePositionX -= 0.2;

  }
}
