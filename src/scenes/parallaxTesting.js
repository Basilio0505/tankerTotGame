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
    this.load.image('grass','./assets/groundGrass.png');
    this.load.image('tree1','./assets/tree1.png');
    this.load.image('tree2','./assets/tree2.png');
    this.load.image('tree3','./assets/tree3.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene

    //Add background
    var background = this.add.sprite(this.centerX, this.centerY, 'background');


  }

  update (time, delta) {
    // Update the scene

  }
}
