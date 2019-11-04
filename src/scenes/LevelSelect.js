/*global Phaser*/
export default class LevelSelect extends Phaser.Scene {
  constructor () {
    super('LevelSelect');
  }

  init (data) {
    // Initialization code goes here
    this.playerCategory = data.playerCategory;
    this.enemyCategory = data.enemyCategory;
    this.borderCategory = data.borderCategory;
    this.bulletCategory = data.bulletCategory
    this.environmentCategory = data.environmentCategory;
    this.currentLevel = data.level;
  }

  preload () {
    // Preload assets
    this.load.spritesheet('start', './assets/StartMenu/Start_Button.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('back', './assets/StartMenu/Back_Button.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level1', './assets/StartMenu/Level1.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level2', './assets/StartMenu/Level2.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level3', './assets/StartMenu/Level3.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level4', './assets/StartMenu/Level4.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level5', './assets/StartMenu/Level5.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level6', './assets/StartMenu/Level6.png', {frameHeight: 20,frameWidth: 50});
    this.load.image('title', './assets/StartMenu/TileText.png');
    this.load.image('image', './assets/StartMenu/Starting_TankerTot.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    console.log(this.currentLevel)
    //Create the scene
    this.cameras.main.setBackgroundColor(0xE83009);

    var start1 = this.add.sprite(this.centerX-150,this.centerY-180,'level1',0).setInteractive().setScale(5);
    start1.on("pointerover", function(){this.setFrame(1);});
    start1.on("pointerout", function(){this.setFrame(0);});
    start1.on("pointerup", function(){this.scene.start("Level1", {
      playerCategory: this.playerCategory,
      enemyCategory: this.enemyCategory,
      borderCategory: this.borderCategory,
      bulletCategory: this.bulletCategory,
      environmentCategory: this.environmentCategory
    })}, this);

    var start2 = this.add.sprite(this.centerX+150,this.centerY-180,'level2',0).setInteractive().setScale(5);
    start2.on("pointerover", function(){this.setFrame(1);});
    start2.on("pointerout", function(){this.setFrame(0);});
    if(this.currentLevel >= 2){
      start2.on("pointerup", function(){this.scene.start("Level2", {
        playerCategory: this.playerCategory,
        enemyCategory: this.enemyCategory,
        borderCategory: this.borderCategory,
        bulletCategory: this.bulletCategory,
        environmentCategory: this.environmentCategory
      })}, this);
    }

    var start3 = this.add.sprite(this.centerX-150,this.centerY-90,'level3',0).setInteractive().setScale(5);
    start3.on("pointerover", function(){this.setFrame(1);});
    start3.on("pointerout", function(){this.setFrame(0);});
    if(this.currentLevel >= 3){
      start3.on("pointerup", function(){this.scene.start("Level3", {
        playerCategory: this.playerCategory,
        enemyCategory: this.enemyCategory,
        borderCategory: this.borderCategory,
        bulletCategory: this.bulletCategory,
        environmentCategory: this.environmentCategory
      })}, this);
    }

    var start4 = this.add.sprite(this.centerX+150,this.centerY-90,'level4',0).setInteractive().setScale(5);
    start4.on("pointerover", function(){this.setFrame(1);});
    start4.on("pointerout", function(){this.setFrame(0);});
    if(this.currentLevel >= 4){
      start4.on("pointerup", function(){this.scene.start("Level4", {
        playerCategory: this.playerCategory,
        enemyCategory: this.enemyCategory,
        borderCategory: this.borderCategory,
        bulletCategory: this.bulletCategory,
        environmentCategory: this.environmentCategory
      })}, this);
    }

    var start5 = this.add.sprite(this.centerX-150,this.centerY,'level5',0).setInteractive().setScale(5);
    start5.on("pointerover", function(){this.setFrame(1);});
    start5.on("pointerout", function(){this.setFrame(0);});
    if(this.currentLevel >= 5){
      start5.on("pointerup", function(){this.scene.start("Level5", {
        playerCategory: this.playerCategory,
        enemyCategory: this.enemyCategory,
        borderCategory: this.borderCategory,
        bulletCategory: this.bulletCategory,
        environmentCategory: this.environmentCategory
      })}, this)
    }

    var start6 = this.add.sprite(this.centerX+150,this.centerY,'level6',0).setInteractive().setScale(5);
    start6.on("pointerover", function(){this.setFrame(1);});
    start6.on("pointerout", function(){this.setFrame(0);});
    if(this.currentLevel >= 6){
      start6.on("pointerup", function(){this.scene.start("Level6", {
        playerCategory: this.playerCategory,
        enemyCategory: this.enemyCategory,
        borderCategory: this.borderCategory,
        bulletCategory: this.bulletCategory,
        environmentCategory: this.environmentCategory
      })}, this);
    }

    var back = this.add.sprite(this.centerX,this.centerY+180,'back',0).setInteractive().setScale(5);
    back.on("pointerover", function(){this.setFrame(1);});
    back.on("pointerout", function(){this.setFrame(0);});
    back.on("pointerup", function(){this.scene.start("Title")}, this);


  }

  update (time, delta) {
    // Update the scene

  }
}
