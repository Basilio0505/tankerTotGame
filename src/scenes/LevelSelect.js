/*global Phaser*/
export default class LevelSelect extends Phaser.Scene {
  constructor () {
    super('LevelSelect');
  }

  init (data) {
    // Initialization code goes here
    //DEBUG MODE. Still go to level 1 first
    //this.registry.set('level', 9);
    //New Debug Mode:
    this.ourDebug = true;
    if (this.ourDebug){
      this.registry.set('Level1HighScore', 1);
      this.registry.set('Level2HighScore', 1);
      this.registry.set('Level3HighScore', 1);
      this.registry.set('Level4HighScore', 1);
      this.registry.set('Level5HighScore', 1);
      this.registry.set('Level6HighScore', 1);
      this.registry.set('Level7HighScore', 1);
      this.registry.set('Level8HighScore', 1);
      this.registry.set('Level9HighScore', 1);
      this.registry.set('Level1Score', 1);
      this.registry.set('Level2Score', 1);
      this.registry.set('Level3Score', 1);
      this.registry.set('Level4Score', 1);
      this.registry.set('Level5Score', 1);
      this.registry.set('Level6Score', 1);
      this.registry.set('Level7Score', 1);
      this.registry.set('Level8Score', 1);
      this.registry.set('Level9Score', 1);
    };
    this.currentLevel = this.registry.get('level');
  }

  preload () {
    // Preload assets
    /*this.load.spritesheet('start', './assets/StartMenu/Start_Button.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('back', './assets/StartMenu/Back_Button.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level1', './assets/StartMenu/Level1.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level2', './assets/StartMenu/Level2.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level3', './assets/StartMenu/Level3.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level4', './assets/StartMenu/Level4.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level5', './assets/StartMenu/Level5.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level6', './assets/StartMenu/Level6.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level7', './assets/StartMenu/Level7.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level8', './assets/StartMenu/Level8.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('level9', './assets/StartMenu/Level9.png', {frameHeight: 20,frameWidth: 50});
    this.load.image('title', './assets/StartMenu/TileText.png');
    this.load.image('image', './assets/StartMenu/Starting_TankerTot.png');
    this.load.image('unlocked', './assets/StartMenu/unlockedLevel.png');
    this.load.image('locked', './assets/StartMenu/lockedLevel.png');
    this.load.image('emptystar','./assets/UI/emptystar.png');
    this.load.image('fullstar','./assets/UI/fullstar.png');*/
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {


    //Create the scene
    this.cameras.main.setBackgroundColor(0xb8b8b8);

    var start1 = this.add.sprite(this.centerX-150,this.centerY-200,'level1',0).setInteractive().setScale(5);
    //var check1 = this.add.image(this.centerX-280, this.centerY-185, 'unlocked').setScale(4)

    start1.on("pointerover", function(){this.setFrame(1);});
    start1.on("pointerout", function(){this.setFrame(0);});
    start1.on("pointerup", function(){this.scene.start("Level1")}, this);

    var start2 = this.add.sprite(this.centerX+150,this.centerY-200,'level2',0).setInteractive().setScale(5);
    start2.on("pointerover", function(){this.setFrame(1);});
    start2.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level1HighScore') > 0){
      //var check2 = this.add.image(this.centerX+280, this.centerY-185, 'unlocked').setScale(4)
      start2.on("pointerup", function(){this.scene.start("Level2")}, this);
    }else{
      var check2 = this.add.image(this.centerX+280, this.centerY-205, 'locked').setScale(4)
    }

    var start3 = this.add.sprite(this.centerX-150,this.centerY-110,'level3',0).setInteractive().setScale(5);
    start3.on("pointerover", function(){this.setFrame(1);});
    start3.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level2HighScore') > 0){
      //var check2 = this.add.image(this.centerX-280, this.centerY-90, 'unlocked').setScale(4)
      start3.on("pointerup", function(){this.scene.start("Level3")}, this);
    }else{
      var check2 = this.add.image(this.centerX-280, this.centerY-110, 'locked').setScale(4)
    }

    var start4 = this.add.sprite(this.centerX+150,this.centerY-110,'level4',0).setInteractive().setScale(5);
    start4.on("pointerover", function(){this.setFrame(1);});
    start4.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level3HighScore') > 0){
      //var check4 = this.add.image(this.centerX+280, this.centerY-90, 'unlocked').setScale(4)
      start4.on("pointerup", function(){this.scene.start("Level4")}, this);
    }else{
      var check4 = this.add.image(this.centerX+280, this.centerY-110, 'locked').setScale(4)
    }

    var start5 = this.add.sprite(this.centerX-150,this.centerY-20,'level5',0).setInteractive().setScale(5);
    start5.on("pointerover", function(){this.setFrame(1);});
    start5.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level4HighScore') > 0){
      //var check5 = this.add.image(this.centerX-280, this.centerY, 'unlocked').setScale(4)
      start5.on("pointerup", function(){this.scene.start("Level5")}, this)
    }else{
      var check5 = this.add.image(this.centerX-280, this.centerY-20, 'locked').setScale(4)
    }

    var start6 = this.add.sprite(this.centerX+150,this.centerY-20,'level6',0).setInteractive().setScale(5);
    start6.on("pointerover", function(){this.setFrame(1);});
    start6.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level5HighScore') > 0){
      //var check6 = this.add.image(this.centerX+280, this.centerY, 'unlocked').setScale(4)
      start6.on("pointerup", function(){this.scene.start("Level6")}, this);
    }else{
      var check6 = this.add.image(this.centerX+280, this.centerY-20, 'locked').setScale(4)
    }

    var start7 = this.add.sprite(this.centerX-150,this.centerY+70,'level7',0).setInteractive().setScale(5);
    start7.on("pointerover", function(){this.setFrame(1);});
    start7.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level6HighScore') > 0){
      //var check6 = this.add.image(this.centerX+280, this.centerY, 'unlocked').setScale(4)
      start7.on("pointerup", function(){this.scene.start("Level7")}, this);
    }else{
      var check7 = this.add.image(this.centerX-280, this.centerY+70, 'locked').setScale(4)
    }

    var start8 = this.add.sprite(this.centerX+150,this.centerY+70,'level8',0).setInteractive().setScale(5);
    start8.on("pointerover", function(){this.setFrame(1);});
    start8.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level7HighScore') > 0){
      //var check6 = this.add.image(this.centerX+280, this.centerY, 'unlocked').setScale(4)
      start8.on("pointerup", function(){this.scene.start("Level8")}, this);
    }else{
      var check8 = this.add.image(this.centerX+280, this.centerY+70, 'locked').setScale(4)
    }

    var start9 = this.add.sprite(this.centerX-150,this.centerY+160,'level9',0).setInteractive().setScale(5);
    start9.on("pointerover", function(){this.setFrame(1);});
    start9.on("pointerout", function(){this.setFrame(0);});
    if(this.registry.get('Level8HighScore') > 0){
      //var check6 = this.add.image(this.centerX+280, this.centerY, 'unlocked').setScale(4)
      start9.on("pointerup", function(){this.scene.start("Level9")}, this);
    }else{
      var check9 = this.add.image(this.centerX-280, this.centerY+160, 'locked').setScale(4)
    }

    var back = this.add.sprite(this.centerX,this.centerY+250,'back',0).setInteractive().setScale(5);
    back.on("pointerover", function(){this.setFrame(1);});
    back.on("pointerout", function(){this.setFrame(0);});
    back.on("pointerup", function(){this.scene.start("Title")}, this);

    var levels = [this.registry.get('Level1HighScore'),this.registry.get('Level2HighScore'),
    this.registry.get('Level3HighScore'),this.registry.get('Level4HighScore'),
    this.registry.get('Level5HighScore'),this.registry.get('Level6HighScore'),
    this.registry.get('Level7HighScore'),this.registry.get('Level8HighScore'),
    this.registry.get('Level9HighScore')]
    var right = 0;
    var down = 0;
    for(var i = 0; i < levels.length; i++){
      if(levels[i] == -1){
        continue;
      }else{
        for(var j = 0; j < levels[i]; j++){
          var star = this.add.image(this.centerX - 180 + j * 30 + right, this.centerY - 170 + down, 'fullstar');
          star.setScale(0.2);
        }
      }
      if(right == 0){
        right = 300
      }else{
        right = 0
      }
      if(i % 2 == 1){
        down += 90
      }
    }
  }

  update (time, delta) {
    // Update the scene

  }
}
