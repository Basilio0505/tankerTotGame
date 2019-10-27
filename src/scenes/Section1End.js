/*global Phaser*/
export default class Section1End extends Phaser.Scene {
  constructor () {
    super('Section1End');
  }

  init (data) {
    // Initialization code goes here
    this.currentLevel = data.currentLevel;
    this.shotCount = data.shotCount;
    this.threeStar = data.threeStar;
    this.twoStar = data.twoStar;
    this.oneStar = data. oneStar;
    this.backgroundX = data.backgroundX;
    this.mountainsX = data.mountainsX;
    this.treesX = data.treesX;
    this.tankerX = data.tankerX;
  }

  preload () {
    // Preload assets

    this.load.image('background','./assets/background.png');
    this.load.image('mountains','./assets/mountains.png');
    this.load.image('trees','./assets/trees.png');
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');
    this.load.image('woodPlatform', './assets/smallWoodPlat.png');
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('emptystar','./assets/UI/emptystar.png');
    this.load.image('winDog','./assets/UI/totGuitar.png');
    this.load.image('loseDog', './assets/UI/totSad.png');
    this.load.image('fullstar','./assets/UI/fullstar.png');
    this.load.spritesheet('restart','./assets/UI/restartlevelbutton.png', {
      frameHeight: 100,
      frameWidth: 200
    });
    this.load.spritesheet('next','./assets/UI/nextlevelbutton.png', {
      frameHeight: 100,
      frameWidth: 200
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.advance = false;
  }

  create (data) {
    //Create the scene

    //Add background
    this.background = this.add.tileSprite(this.centerX,this.centerY,0,0, 'background');
    this.mountains = this.add.tileSprite(this.centerX,this.centerY+100,0,0, 'mountains');
    this.trees = this.add.tileSprite(this.centerX,this.centerY+150,0,0, 'trees');
    this.background.tilePositionX = this.backgroundX;
    this.mountains.tilePositionX = this.mountainsX;
    this.trees.tilePositionX = this.treesX;
    this.player = this.add.sprite(this.tankerX, 530, 'tankertot');
    this.cannon = this.add.sprite(this.tankerX, 530, 'cannon');
    this.add.image(16,16, 'vwall', null);
    this.add.image(784,16, 'vwall', null);
    this.add.image(16,16, 'hwall', null);
    this.add.image(16,584, 'ground', null);
    //this.platforms = this.physics.add.staticGroup();
    //this.platforms.create(400, 500, "woodPlatform").setScale(1.5).refreshBody();
    //this.platforms.create(400, 200, "woodPlatform").setScale(1.5).refreshBody();
    //this.platforms.create(400, 350, "woodPlatform").setScale(1.5).refreshBody();

    if(this.shotCount == this.threeStar){
      this.add.image(this.centerX - 9, this.centerY - 83, 'winDog').setScale(1.7)
      var star1 = this.add.image(this.centerX - 125, this.centerY, 'fullstar');
      star1.setScale(0.6);
      var star2 = this.add.image(this.centerX, this.centerY, 'fullstar');
      star2.setScale(0.6);
      var star3 = this.add.image(this.centerX + 125, this.centerY, 'fullstar');
      star3.setScale(0.6);
      this.advance = true;

    } else if(this.shotCount <= this.twoStar){
      this.add.image(this.centerX - 9, this.centerY - 83, 'winDog').setScale(1.7)
      var star1 = this.add.image(this.centerX - 125, this.centerY, 'fullstar');
      star1.setScale(0.6);
      var star2 = this.add.image(this.centerX, this.centerY, 'fullstar');
      star2.setScale(0.6);
      var star3 = this.add.image(this.centerX + 125, this.centerY, 'emptystar');
      star3.setScale(0.6);
      this.advance = true;

    } else if(this.shotCount <= this.oneStar){
      this.add.image(this.centerX - 9, this.centerY - 83, 'winDog').setScale(1.7)
      var star1 = this.add.image(this.centerX - 125, this.centerY, 'fullstar');
      star1.setScale(0.6);
      var star2 = this.add.image(this.centerX, this.centerY, 'emptystar');
      star2.setScale(0.6);
      var star3 = this.add.image(this.centerX + 125, this.centerY, 'emptystar');
      star3.setScale(0.6);
      this.advance = true;

    } else {
      this.add.image(this.centerX - 9, this.centerY - 140, 'loseDog').setScale(1.7)
      var star1 = this.add.image(this.centerX - 125, this.centerY, 'emptystar');
      star1.setScale(0.6);
      var star2 = this.add.image(this.centerX, this.centerY, 'emptystar');
      star2.setScale(0.6);
      var star3 = this.add.image(this.centerX + 125, this.centerY, 'emptystar');
      star3.setScale(0.6);
      this.advance = false;
    }

    //################################################################
    var nextButton = this.add.sprite(this.centerX + 150, this.centerY + 150, 'next', 0);
    nextButton.setScale(0.75);
    if(this.advance){
      nextButton.setInteractive();
      nextButton.on("pointerover", function(){
        this.setFrame(1);
      });
      nextButton.on("pointerout", function(){
        this.setFrame(0);
      });
      nextButton.on("pointerup", function(){
        this.scene.start("Level"+(this.currentLevel+1));
      }, this);
    }

    var restartButton = this.add.sprite(this.centerX - 150, this.centerY + 150, 'restart',0);
    restartButton.setInteractive();
    restartButton.setScale(0.75);
    restartButton.on("pointerover", function(){
      this.setFrame(1);
    });
    restartButton.on("pointerout", function(){
      this.setFrame(0);
    });
    restartButton.on("pointerup", function(){
      this.scene.start("Level"+this.currentLevel);
    }, this);
    //################################################################
  }

  update (time, delta) {
    // Update the scene


  }
}
