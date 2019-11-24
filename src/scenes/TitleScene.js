/*global Phaser*/
export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }

  init (data) {
    // Initialization code goes here

    if(this.registry.get('level') == undefined){
      this.registry.set('level', 1);
    }

    if(this.registry.get('Level1Score') == undefined){
      this.registry.set('Level1Score', -1);
      this.registry.set('Level2Score', -1);
      this.registry.set('Level3Score', -1);
      this.registry.set('Level4Score', -1);
      this.registry.set('Level5Score', -1);
      this.registry.set('Level6Score', -1);
      this.registry.set('Level7Score', -1);
      this.registry.set('Level8Score', -1);
      this.registry.set('Level9Score', -1);
      this.registry.set('Level1HighScore', -1);
      this.registry.set('Level2HighScore', -1);
      this.registry.set('Level3HighScore', -1);
      this.registry.set('Level4HighScore', -1);
      this.registry.set('Level5HighScore', -1);
      this.registry.set('Level6HighScore', -1);
      this.registry.set('Level7HighScore', -1);
      this.registry.set('Level8HighScore', -1);
      this.registry.set('Level9HighScore', -1);
    }
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
    this.load.image('title', './assets/StartMenu/TitleText.png');
    this.load.image('image', './assets/StartMenu/Starting_TankerTot.png');



    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    this.load.audio('music', './assets/Sounds/Music/8bitStage1Loop.wav');

    //Tutorial Text
    //Level 1
    //Tutorial General
    this.load.image('blackGeneral', './assets/Tutorial/blackGeneralPug.png');
    this.load.image('generalPug', './assets/Tutorial/generalPug.png');
    //Text
    this.load.image('movementText', './assets/Tutorial/TextBox_Movement.png');
    this.load.image('shootText', './assets/Tutorial/TextBox_ShootBasics.png');
    this.load.image('startText', './assets/Tutorial/TextBox_PugIncoming.png');
    this.load.image('dutyText', './assets/Tutorial/TextBox_PugDuty.png');
    this.load.image('timeText', './assets/Tutorial/TextBox_PugAboutTime.png');
    this.load.image('speedText', './assets/Tutorial/TextBox_PugSpeed.png');
    //Level 2
    this.load.image('scoreText', './assets/Tutorial/TextBox_Score.png');
    this.load.image('bulletText', './assets/Tutorial/TextBox_Bullet.png');
    //Level 3
    this.load.image('suicideText', './assets/Tutorial/TextBox_Suicide.png');
    this.load.image('bounceText', './assets/Tutorial/TextBox_Bounce.png');

    //Player Assets
    this.load.image('ghost', './assets/tankerTot/ghost.png');
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('bullet', './assets/TankerTot/bullet.png');
    this.load.image('trajectory', './assets/TankerTot/laser.png');
    this.load.spritesheet('bulletss', './assets/TankerTot/bulletss.png',{
      frameWidth: 5,
      frameHeight: 5
    });
    this.load.image('explosion0', './assets/TankerTot/explosion0.png');
    this.load.image('explosion1', './assets/TankerTot/explosion1.png');
    this.load.image('explosion2', './assets/TankerTot/explosion2.png');
    this.load.image('explosion3', './assets/TankerTot/explosion3.png');
    //this.load.image('rocket', './assets/rocket.png');

    //Environment
    this.load.image('ground', './assets/Environment/groundGrass.png');
    this.load.image('background','./assets/Environment/background.png');
    this.load.image('mountains','./assets/Environment/mountains2.png');
    this.load.image('trees','./assets/Environment/trees.png');
    this.load.image('dunes1','./assets/Environment/dunes1.png');
    this.load.image('dunes2','./assets/Environment/dunes2.png');
    this.load.image('dunes3','./assets/Environment/dunes3.png');
    this.load.image('dunes4','./assets/Environment/dunes4.png');
    this.load.image('buildingsb','./assets/Environment/backgroundbuildings.png');
    this.load.image('buildingsf','./assets/Environment/foregroundbuildings.png');

    this.load.image('woodPlatform', './assets/Environment/smallWoodPlat.png');
    this.load.image('steelPlatform', './assets/Environment/steelPlat.png');
    this.load.atlas('sheet', 'assets/Environment/curvy.png', 'assets/physics/curvy.json');
    this.load.json('shapes', 'assets/physics/curvy.json');
    this.load.image('brickPlatform', './assets/Environment/smallBrickPlat.png')
    this.load.spritesheet('break', './assets/Environment/smallWoodPlat_Breakable.png',{
      frameWidth: 64,
      frameHeight: 32
    });

    //All to be replaced
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');

    //Enemies
    this.load.image('speedy','./assets/enemies/speedySquirrel.png');
    this.load.image('tanky','./assets/enemies/tankSquirrel.png' );
    this.load.image('squirrel','./assets/enemies/enemySquirrel.png');
    this.load.image('enemybullet','./assets/enemies/enemybullet.png');

    //Load Sound FX
    this.load.audio('shot','./assets/Sounds/FX/shot.wav');
    this.load.audio('squirreldeath','./assets/Sounds/FX/squirreldeath.wav');
    this.load.audio('bounce','./assets/Sounds/FX/bounce.wav');

    //Level Select
    this.load.spritesheet('start', './assets/StartMenu/Start_Button.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('back', './assets/StartMenu/Back_Button.png', {frameHeight: 20,frameWidth: 50});
    this.load.spritesheet('exit', './assets/StartMenu/Exit_Button.png', {frameHeight: 20,frameWidth: 50});
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
    this.load.image('fullstar','./assets/UI/fullstar.png');

    //Section End
    this.load.image('winDog','./assets/UI/totGuitar.png');
    this.load.image('loseDog', './assets/UI/totSad.png');
    this.load.spritesheet('restart','./assets/UI/restartlevelbutton.png', {
      frameHeight: 100,
      frameWidth: 200
    });
    this.load.spritesheet('next','./assets/UI/nextlevelbutton.png', {
      frameHeight: 100,
      frameWidth: 200
    });
    this.load.spritesheet('levelselect','./assets/UI/levelselectbutton.png', {
      frameHeight: 100,
      frameWidth: 200
    });
  }

  create (data) {
    this.registry.set('selfHit', false)
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
    var title = this.add.image(this.centerX, this.centerY-150, 'title').setScale(1);

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

    //Create collision categories
    if(this.registry.get('playerCategory') == undefined){
      this.playerCategory = this.matter.world.nextCategory();
      this.registry.set('playerCategory', this.playerCategory);
    }

    if(this.registry.get('borderCategory') == undefined){
      this.borderCategory = this.matter.world.nextCategory();
      this.registry.set('borderCategory', this.borderCategory);
    }

    if(this.registry.get('environmentCategory') == undefined){
      this.environmentCategory = this.matter.world.nextCategory();
      this.registry.set('environmentCategory', this.environmentCategory);
    }

    if(this.registry.get('bulletCategory') == undefined){
      this.bulletCategory = this.matter.world.nextCategory();
      this.registry.set('bulletCategory', this.bulletCategory);
    }

    if(this.registry.get('enemyCategory') == undefined){
      this.enemyCategory = this.matter.world.nextCategory();
      this.registry.set('enemyCategory', this.enemyCategory);
    }
    if(this.registry.get('enemybulletCategory') == undefined){
      this.enemybulletCategoy = this.matter.world.nextCategory();
      this.registry.set('enemybulletCategoy', this.enemybulletCategoy);
    }

  }

  update (time, delta) {
    // Update the scene

  }
}
