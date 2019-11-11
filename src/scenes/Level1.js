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
    this.registry.set('level', 1)
    this.squirrelCount = 3;

    this.pointerLocation = {x:0, y:0};

    this.playerCategory = this.registry.get('playerCategory');
    this.enemyCategory = this.registry.get('enemyCategory');
    this.borderCategory = this.registry.get('borderCategory');
    this.bulletCategory = this.registry.get('bulletCategory');
    this.environmentCategory = this.registry.get('environmentCategory');
  }

  preload () {// Preload assets
    //Tutorial Text
    this.load.image('movementText', './assets/Tutorial/TextBox_Movement.png');
    this.load.image('shootText', './assets/Tutorial/TextBox_ShootBasics.png');
    this.load.image('startText', './assets/Tutorial/TextBox_PugIncoming.png');
    this.load.image('dutyText', './assets/Tutorial/TextBox_PugDuty.png');
    this.load.image('timeText', './assets/Tutorial/TextBox_PugAboutTime.png');
    this.load.image('speedText', './assets/Tutorial/TextBox_PugSpeed.png');

    //Tutorial General
    this.load.image('blackGeneral', './assets/Tutorial/blackGeneralPug.png');
    this.load.image('generalPug', './assets/Tutorial/generalPug.png');

    //Player Assets
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('bullet', './assets/TankerTot/bullet.png');
    //this.load.image('rocket', './assets/rocket.png');

    //Environment
    this.load.image('ground', './assets/Environment/groundGrass.png');
    this.load.image('background','./assets/Environment/background.png');
    this.load.image('mountains','./assets/Environment/mountains2.png');
    this.load.image('trees','./assets/Environment/trees.png');
    this.load.image('woodPlatform', './assets/Environment/smallWoodPlat.png');
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
    //create variables
    this.bulletPresent = false;
    this.gameOver = false;
    this.bounceCount = 0;
    this.shotCount = 0;
    this.movement = this.input.keyboard.addKeys({
      w:Phaser.Input.Keyboard.KeyCodes.W,
      s:Phaser.Input.Keyboard.KeyCodes.S,
      a:Phaser.Input.Keyboard.KeyCodes.A,
      d:Phaser.Input.Keyboard.KeyCodes.D});



    //Create the scene background
    this.background = this.add.tileSprite(this.centerX,this.centerY,0,0, 'background');
    this.mountains = this.add.tileSprite(this.centerX,this.centerY-100,0,0, 'mountains');
    this.trees = this.add.tileSprite(this.centerX,this.centerY+150,0,0, 'trees');

    //create player
    this.player = this.matter.add.image(68, 536, 'tankertot', null, {friction:0}).setFixedRotation(true).setCollisionCategory(this.playerCategory);
    this.cannon = this.matter.add.image(68, 536, 'cannon', null, {friction:0, shape: 'circle'}).setCollisionCategory(this.playerCategory).setScale(.84);

    //create borders
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);

    //create platfroms
    var plat1 = this.matter.add.image(240, 520, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat2 = this.matter.add.image(640, 200, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat3 = this.matter.add.image(440, 365, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(this.environmentCategory);

    var break1frame = 0;
    var break1 = this.matter.add.sprite(100, 100, 'break', null, { isStatic: true, friction: 0 }, break1frame).setScale(2).setCollisionCategory(this.environmentCategory);

    //create enemies
    var squirrel = this.matter.add.image(205, 456, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var speedy = this.matter.add.image(611, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var tanky = this.matter.add.image(411, 301, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);

    //create tutorial frames
    this.tutorialActive = true;//bool used to stop all other actions while tutorialText is active
    this.tutorialShoot = this.add.image(this.centerX, this.centerY, "shootText").setScale(1.5);
    this.tutorialMove = this.add.image(this.centerX, this.centerY, "movementText").setScale(1.5);
    this.tutorialSpeed = this.add.image(this.centerX, this.centerY, "speedText").setScale(1.5);
    this.tutorialDuty = this.add.image(this.centerX, this.centerY, "dutyText").setScale(1.5);
    this.tutorialTime = this.add.image(this.centerX, this.centerY, "timeText").setScale(1.5);
    this.tutorialStart = this.add.image(this.centerX, this.centerY, "startText").setScale(1.5);

    this.pug = this.add.image(this.centerX - 140, this.centerY - 100, "generalPug").setScale(1.5);
    this.blackPug = this.add.image(this.centerX - 140, this.centerY - 100, "blackGeneral").setScale(1.5);

    //create text/UI
    this.countText = this.add.text( 16, 6, 'Bullets Used: 0', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var levelText = this.add.text( this.centerX - 30, 6, 'Level 1', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    //assign collisons
    this.player.setCollidesWith([this.borderCategory, this.environmentCategory, this.bulletCategory]);
    this.cannon.setCollidesWith([this.borderCategory, this.environmentCategory]);

    //create pointer interactions
    this.input.on(
      "pointermove",
      function(pointer){
        this.pointerLocation = pointer;
      }, this
    );

    this.input.on("pointerdown", this.tutorial, this);

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
      //Checks if the two objects colliding are the player and the player bullet
      else if(event.pairs[0].bodyA.gameObject == this.player && event.pairs[0].bodyB.gameObject == this.bullet){
        //GAME OVER
        this.registry.set('Level1Score', 0)
        if(this.registry.get('Level1HighScore') < this.registry.get('Level1Score')){
          this.registry.set('Level1HighScore', this.registry.get('Level1Score'))
        }
        this.scene.start('Section1End', {
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
      //checks if the two objects colliding are the breakable walls or the bullet
      else if(event.pairs[0].bodyA.gameObject == break1 && event.pairs[0].bodyB.gameObject == this.bullet){
        this.bounceCount += 1;
        break1frame +=1;
        if(break1frame > 2){
          break1.destroy();
        }
        else{
          break1.setFrame(break1frame);
        }
        this.sound.play('bounce');
      }

      //If player bullet bounce reaches limit
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
    this.cannon.setPosition(this.player.x, this.player.y+3);

    //Checks if Winning Condition is met
    if (this.squirrelCount == 0) {
      //Makes sure there is no active bullet present
      if (this.bulletPresent == false){
        //Loads score Scene and passes info for display over
        if(this.shotCount == this.threeStar){
          this.registry.set('Level1Score', 3)
        }else if(this.shotCount <= this.twoStar){
          this.registry.set('Level1Score', 2)
        }else if(this.shotCount <= this.oneStar){
          this.registry.set('Level1Score', 1)
        }
        if(this.registry.get('Level1HighScore') < this.registry.get('Level1Score')){
          this.registry.set('Level1HighScore', this.registry.get('Level1Score'))
        }
        this.scene.start('Section1End', {
          backgroundX: this.background.tilePositionX,
          mountainsX: this.mountains.tilePositionX,
          treesX: this.trees.tilePositionX,
          tankerX: this.player.x
          });
      }
    }

    if(this.movement.a.isDown){
      this.player.setVelocityX(-2);
      this.cannon.setVelocityX(-2);
      if(this.player.x > 100){
        this.background.tilePositionX -= 0.1;
        this.mountains.tilePositionX -= 0.2;
        this.trees.tilePositionX -= 0.3;
      }
    } else if(this.movement.d.isDown){
      this.player.setVelocityX(2);
      this.cannon.setVelocityX(2);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.mountains.tilePositionX += 0.2;
        this.trees.tilePositionX += 0.3;
      }
    } else{
      this.player.setVelocityX(0);
      this.cannon.setVelocityX(0);
    }

    //Check if bullet is out of bounds, destroys and resets bullet vars
    if (this.bulletPresent){
      if ((this.bullet.x < 0) || (this.bullet.x > 800) || (this.bullet.y < 0) || (this.bullet.y > 600)){
        this.bullet.destroy();
        this.bulletPresent = false;
        this.bounceCount = 0;
      }
    }
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
      this.bullet.setVelocity(Math.cos(angle)*7.5, Math.sin(angle)*7.5);
      this.shotCount += 1;
      this.sound.play('shot');
      this.bulletPresent = true;
      this.countText.setText('Bullets Used: ' + this.shotCount);
    }
  }

  //handles switching through tutorial frames
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

  //updates cannon to point at pointer location
  updateCannon(pointerLocation){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointerLocation);
    this.cannon.setAngle(angle);
  }
}
