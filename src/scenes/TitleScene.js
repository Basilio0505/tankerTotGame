/*global Phaser*/
export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
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
    this.load.spritesheet('select', './assets/StartMenu/Select_Button.png', {
      frameHeight: 20,
      frameWidth: 50
    });
    this.load.image('title', './assets/StartMenu/TileText.png');
    this.load.image('image', './assets/StartMenu/Starting_TankerTot.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    this.load.audio('music', './assets/Sounds/Music/8bitStage1Loop.wav');
  }

  create (data) {
    //Create the scene
    //Background Color
    this.cameras.main.setBackgroundColor(0xb8b8b8);

    //Add Music and loop
    this.music = this.sound.add('music',{loop: true});
    if (this.registry.get('music')){

    }else{
      this.music.play();
      this.registry.set('music', true);
    }

    //Add Logo and Title
    var tankertot = this.add.image(this.centerX, this.centerY, 'image').setScale(0.1);
    var title = this.add.image(this.centerX, this.centerY-50, 'title').setScale(0.2);

    //Start Button
    var start1 = this.add.sprite(this.centerX - 150 ,this.centerY+180,'start',0).setInteractive().setScale(5);
    start1.on("pointerover", function(){this.setFrame(1);});
    start1.on("pointerout", function(){this.setFrame(0);});
    start1.on("pointerup", function(){this.scene.start("Level1")}, this);

    //Level Select Button
    var startLS = this.add.sprite(this.centerX + 150 ,this.centerY+180,'select',0).setInteractive().setScale(5);
    startLS.on("pointerover", function(){this.setFrame(1);});
    startLS.on("pointerout", function(){this.setFrame(0);});
    startLS.on("pointerup", function(){this.scene.start("LevelSelect")}, this);
  }

  update (time, delta) {
    // Update the scene

  }
}
