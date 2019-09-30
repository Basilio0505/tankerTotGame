/*global Phaser*/
export default class MainScene extends Phaser.Scene {
  constructor () {
    super('Main');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet('start', './assets/StartMenu/Start_Button.png', {
      frameHeight: 20,
      frameWidth: 50
    });
    this.load.image('title', './assets/StartMenu/TileText.png');
    this.load.image('image', './assets/StartMenu/Starting_TankerTot.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    this.cameras.main.setBackgroundColor(0xE83009);

    var tankertot = this.add.image(this.centerX, this.centerY, 'image');
    tankertot.scaleX = 0.1;
    tankertot.scaleY = 0.1;

    var title = this.add.image(this.centerX, this.centerY-50, 'title');
    title.scaleX = 0.2;
    title.scaleY = 0.2;

    var start1 = this.add.sprite(this.centerX,this.centerY+180,'start',0)
    start1.setInteractive();
    start1.scaleX = 5;
    start1.scaleY = 5;

    start1.on("pointerover", function(){
      this.setFrame(1);
    });
    start1.on("pointerout", function(){
      this.setFrame(0);
    });
    start1.on("pointerup", function(){
      this.scene.start("BasilioTest")
    }, this);

  }

  update (time, delta) {
    // Update the scene

  }
}
