/*global Phaser*/
export default class Level1 extends Phaser.Scene {
  constructor () {
    super('Level1');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 1;
    this.twoStar = 3;
    this.oneStar = 5;

    this.currentLevel = 1;
    this.squirrelCount = 3;

    this.pointerLocation = {x:0, y:0};
  }

  preload () {// Preload assets
    //Tutorial Text
    this.load.image('movementText', './assets/TutorialText/TextBox_Movement.png');
    this.load.image('shootText', './assets/TutorialText/TextBox_ShootBasics.png');
    this.load.image('startText', './assets/TutorialText/TextBox_PugIncoming.png');
    this.load.image('dutyText', './assets/TutorialText/TextBox_PugDuty.png');
    this.load.image('timeText', './assets/TutorialText/TextBox_PugAboutTime.png');
    this.load.image('speedText', './assets/TutorialText/TextBox_PugSpeed.png');

    //Tutorial General
    this.load.image('blackGeneral', './assets/blackGeneralPug.png');
    this.load.image('generalPug', './assets/generalPug.png');

    //Player Assets
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('bullet', './assets/TankerTot/bullet.png');
    //this.load.image('rocket', './assets/rocket.png');

    //Environment
    this.load.image('ground', './assets/Environment/groundGrass.png');
    this.load.image('background','./assets/Environment/background.png');
    this.load.image('mountains','./assets/Environment/mountains.png');
    this.load.image('trees','./assets/Environment/trees.png');
    this.load.image('woodPlatform', './assets/smallWoodPlat.png');

    //All to be replaced
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');

    //Enemies
    this.load.image('speedy','./assets/enemies/speedySquirrel.png');
    this.load.image('tanky','./assets/enemies/tankSquirrel.png' );
    this.load.image('squirrel','./assets/enemies/enemySquirrel.png');


    //Load Sound FX
    this.load.audio('shot','./assets/Sounds/FX/shot.wav');
    this.load.audio('squirreldeath','./assets/Sounds/FX/squirreldeath.wav');
    this.load.audio('bounce','./assets/Sounds/FX/bounce.wav');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

//############CREATE#####################################################################CREATE
  create (data) {
    //Create the scene
    this.background = this.add.tileSprite(this.centerX,this.centerY,0,0, 'background');
    this.mountains = this.add.tileSprite(this.centerX,this.centerY+100,0,0, 'mountains');
    this.trees = this.add.tileSprite(this.centerX,this.centerY+150,0,0, 'trees');

    var playerCategory = this.matter.world.nextCategory();
    this.player = this.matter.add.image(68, 530, 'tankertot', null, {friction:0}).setCollisionCategory(playerCategory);
    this.cannon = this.matter.add.image(68, 530, 'cannon', null, {friction:0, shape: 'circle'}).setCollisionCategory(playerCategory).setScale(.84);

    var borderCategory = this.matter.world.nextCategory();
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 }).setCollisionCategory(borderCategory);

    var environmentCategory = this.matter.world.nextCategory();
    var plat1 = this.matter.add.image(200, 520, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(environmentCategory);
    var plat2 = this.matter.add.image(600, 200, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(environmentCategory);
    var plat3 = this.matter.add.image(400, 365, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(environmentCategory);

    this.bulletCategory = this.matter.world.nextCategory();

    this.player.setCollidesWith([borderCategory, environmentCategory, this.bulletCategory]);
    this.cannon.setCollidesWith([borderCategory, environmentCategory]);

    var enemyCategory = this.matter.world.nextCategory();
    var squirrel = this.matter.add.image(205, 456, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(enemyCategory).setSensor(true);
    var speedy = this.matter.add.image(611, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(enemyCategory).setSensor(true);
    var tanky = this.matter.add.image(411, 301, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(enemyCategory).setSensor(true);

    //bool used to stop all other actions while tutorialText is active
    this.tutorialActive = true;
    this.tutorialShoot = this.add.image(this.centerX, this.centerY, "shootText").setScale(1.5);
    this.tutorialMove = this.add.image(this.centerX, this.centerY, "movementText").setScale(1.5);
    this.tutorialSpeed = this.add.image(this.centerX, this.centerY, "speedText").setScale(1.5);
    this.tutorialDuty = this.add.image(this.centerX, this.centerY, "dutyText").setScale(1.5);
    this.tutorialTime = this.add.image(this.centerX, this.centerY, "timeText").setScale(1.5);
    this.tutorialStart = this.add.image(this.centerX, this.centerY, "startText").setScale(1.5);

    this.pug = this.add.image(this.centerX - 140, this.centerY - 100, "generalPug").setScale(1.5);
    this.blackPug = this.add.image(this.centerX - 140, this.centerY - 100, "blackGeneral").setScale(1.5);


    this.bulletPresent = false;
    this.gameOver = false;
    this.bounceCount = 0;
    this.bulletspeed = 400;

    this.input.on(
      "pointermove",
      function(pointer){/*
        if(pointer == undefined){
          console.log("BOOM")
          this.pointerLocation = {x:0, y:0}
        }
        console.log(pointer);*/
        this.pointerLocation = pointer;
        //var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        //var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointer);
        //this.cannon.setAngle(angle);
      }, this
    );

    this.input.on("pointerdown", this.tutorial, this);

    this.shotCount = 0;

    //Decects collision of two objects
    this.matter.world.on('collisionstart', function(event){
      //Checks if the two objects colliding are the regular squirrel and bullet
      if(event.pairs[0].bodyA.gameObject == squirrel && event.pairs[0].bodyB.gameObject == this.bullet){
        squirrel.destroy();
        this.squirrelCount -= 1;
        this.sound.play('squirreldeath');
      }//Checks if the two objects colliding are the tank squirrel and bullet
      else if(event.pairs[0].bodyA.gameObject == tanky && event.pairs[0].bodyB.gameObject == this.bullet){
        tanky.destroy();
        this.squirrelCount -= 1;
        this.sound.play('squirreldeath');
      }
      //Checks if the two objects colliding are the speedy squirrel and bullet
      else if(event.pairs[0].bodyA.gameObject == speedy && event.pairs[0].bodyB.gameObject == this.bullet){
        speedy.destroy();
        this.squirrelCount -= 1;
        this.sound.play('squirreldeath');
      }
      else if(event.pairs[0].bodyA.gameObject == this.player && event.pairs[0].bodyB.gameObject == this.bullet){
        this.scene.start('Section1End', {
          currentLevel: this.currentLevel,
          shotCount: 100,
          threeStar: this.threeStar,
          twoStar: this.twoStar,
          oneStar: this.oneStar,
          backgroundX: this.background.tilePositionX,
          mountainsX: this.mountains.tilePositionX,
          treesX: this.trees.tilePositionX,
          tankerX: this.player.x
          });
      }
      //Checks if the two objects colliding are the walls or platforms and bullet
      else if((event.pairs[0].bodyA.gameObject == plat1 ||
          event.pairs[0].bodyA.gameObject == plat2 ||
          event.pairs[0].bodyA.gameObject == plat3 ||
          event.pairs[0].bodyA.gameObject == ground ||
          event.pairs[0].bodyA.gameObject == hwall ||
          event.pairs[0].bodyA.gameObject == vwall1 ||
          event.pairs[0].bodyA.gameObject == vwall2) && event.pairs[0].bodyB.gameObject == this.bullet){
        this.bounceCount += 1;
        this.sound.play('bounce');
      }

      if (this.bounceCount > 3){
        this.bullet.destroy();
        this.bulletPresent = false;
        this.bounceCount = 0;
      };
    }, this);
  }


//############UPDATE######################################################################UPDATE
  update (time, delta) {
    // Update the scene
    this.updateCannon(this.pointerLocation);

    //Checks if Winning Condition is met
    if (this.squirrelCount == 0) {
      //Makes sure there is no active bullet present
      if (this.bulletPresent == false){
        //Loads score Scene and passes info for display over
        this.scene.start('Section1End', {
            currentLevel: this.currentLevel,
            shotCount: this.shotCount,
            threeStar: this.threeStar,
            twoStar: this.twoStar,
            oneStar: this.oneStar,
            backgroundX: this.background.tilePositionX,
            mountainsX: this.mountains.tilePositionX,
            treesX: this.trees.tilePositionX,
            tankerX: this.player.x
          });
        }
    }

    var movement = this.input.keyboard.addKeys({
      w:Phaser.Input.Keyboard.KeyCodes.W,
      s:Phaser.Input.Keyboard.KeyCodes.S,
      a:Phaser.Input.Keyboard.KeyCodes.A,
      d:Phaser.Input.Keyboard.KeyCodes.D});
    var speed = 3;

    if(movement.a.isDown){
      this.player.setVelocityX(-2);
      this.cannon.setVelocityX(-2);
      if(this.player.x > 100){
        this.background.tilePositionX -= 0.1;
        this.mountains.tilePositionX -= 0.2;
        this.trees.tilePositionX -= 0.3;
      };
    } else if(movement.d.isDown){
      this.player.setVelocityX(2);
      this.cannon.setVelocityX(2);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.mountains.tilePositionX += 0.2;
        this.trees.tilePositionX += 0.3;
      };
    } else{
      this.player.setVelocityX(0);
      this.cannon.setVelocityX(0);
    }

    //Check if player is outside of bounds and move them back to starting position
    if ((this.player.x < 0) || (this.player.x > 800) || (this.player.y < 0) || (this.player.y > 600)){
      //this.player.setPosition(68,530); does not fix error
      //this.cannon.setPosition(65,530);
      //this.scene.start("Level"+this.currentLevel); does not fix error
      console.log('Player out of bounds!');
    };

    //Check if bullet is out of bounds, destroys and resets bullet vars
    if (this.bulletPresent){
      if ((this.bullet.x < 0) || (this.bullet.x > 800) || (this.bullet.y < 0) || (this.bullet.y > 600)){
        console.log('Bullet out of bounds!');
        this.bullet.destroy();
        this.bulletPresent = false;
        this.bounceCount = 0;
      };
    };

  }

//#############FUNCTIONS########################################################FUNCTIONS
  shoot(pointer){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, pointer);
    if(this.bulletPresent == false){
      this.bullet = this.matter.add.sprite(this.player.x + (Math.cos(angle)*45),
      this.player.y+ (Math.sin(angle)*45),
      'bullet',null,{
          shape: 'circle',
          ignoreGravity: true,
          collisionFilter: {category: this.bulletCategory},
          isStatic: false,
          restitution: 1,
          frictionAir: 0
      }).setScale(2);
      this.bullet.setVelocity(Math.cos(angle)*10, Math.sin(angle)*10);
      this.shotCount += 1;
      this.sound.play('shot');
      this.bulletPresent = true
    }
  }

  tutorial(pointer){
    //Only way I could figure out for it to move on.
    if(this.tutorialActive == true){
      if(this.tutorialStart.x == this.centerX){
        this.tutorialStart.destroy();
        this.blackPug.destroy()
        this.tutorialStart.x = this.centerX-30;
      } else if(this.tutorialTime.x == this.centerX){
        this.tutorialTime.destroy();
        this.tutorialTime.x = this.centerX-30;
      } else if(this.tutorialDuty.x == this.centerX){
        this.tutorialDuty.destroy();
        this.tutorialDuty.x = this.centerX-30;
      } else if(this.tutorialSpeed.x == this.centerX){
        this.tutorialSpeed.destroy();
        this.pug.destroy()
        this.tutorialSpeed.x = this.centerX-30;
      } else if(this.tutorialMove.x == this.centerX){
        this.tutorialMove.destroy();
        this.tutorialMove.x = this.centerX-30;
      } else {
        this.tutorialShoot.destroy();
        this.tutorialActive = false;
      }
    } else{
      this.shoot(pointer);
    }
  }

  updateCannon(pointerLocation){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointerLocation);
    this.cannon.setAngle(angle);
  }
}
