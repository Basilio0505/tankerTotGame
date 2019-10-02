/*global Phaser*/
export default class EndLevelScene extends Phaser.Scene {
  constructor () {
    super('EndLevelScene');
  }

  init (data) {
    // Initialization code goes here
    this.shotCount = data.shotCount;
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
    this.background.tilePositionX = this.backgroundX;
    this.mountains.tilePositionX = this.mountainsX;
    this.trees.tilePositionX = this.treesX;
    this.player = this.physics.add.sprite(this.tankerX, 540, 'tankertot');
    this.cannon = this.physics.add.sprite(this.tankerX, 540, 'cannon');
    this.walls = this.physics.add.staticGroup();
    this.walls.create(16,16, 'vwall');
    this.walls.create(784,16, 'vwall');
    this.walls.create(16,16, 'hwall');
    this.walls.create(16,584, 'hwall');
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.cannon, this.walls);
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(600, 440, "woodPlatform").setScale(2).refreshBody();
    this.platforms.create(150, 300, "woodPlatform").setScale(2).refreshBody();
    this.platforms.create(400, 200, "woodPlatform").setScale(2).refreshBody();
    console.log(this.shotCount);




  }

  update (time, delta) {
    // Update the scene


  }
}
