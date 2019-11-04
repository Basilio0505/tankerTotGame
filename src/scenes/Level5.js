/*global Phaser*/
export default class Level5 extends Phaser.Scene {
  constructor () {
    super('Level5');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 1;
    this.twoStar = 3;
    this.oneStar = 5;

    this.currentLevel = 5;
    this.squirrelCount = 3;

    this.pointerLocation = {x:0, y:0};

    this.playerCategory = data.playerCategory;
    this.enemyCategory = data.enemyCategory;
    this.borderCategory = data.borderCategory;
    this.bulletCategory = data.bulletCategory;
    console.log(data.environmentCategory)
    this.environmentCategory = data.environmentCategory;
  }

  preload () {// Preload assets
    //Player Assets
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('bullet', './assets/TankerTot/bullet.png');
    //this.load.image('rocket', './assets/rocket.png');

    //Environment
    this.load.image('ground', './assets/Environment/groundGrass.png');
    this.load.image('background','./assets/Environment/background.png');
    this.load.image('dunes1','./assets/Environment/dunes1.png');
    this.load.image('dunes2','./assets/Environment/dunes2.png');
    this.load.image('dunes3','./assets/Environment/dunes3.png');
    this.load.image('dunes4','./assets/Environment/dunes4.png');
    this.load.image('woodPlatform', './assets/smallWoodPlat.png');
    this.load.spritesheet('break', './assets/smallWoodPlat_Breakable.png',{
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
    console.log(this.environmentCategory)
    //Create the scene
    this.background = this.add.tileSprite(this.centerX,this.centerY,0,0, 'background');
    this.dunes1 = this.add.tileSprite(this.centerX,this.centerY+20,0,0, 'dunes1');
    this.dunes2 = this.add.tileSprite(this.centerX,this.centerY+30,0,0, 'dunes2');
    this.dunes3 = this.add.tileSprite(this.centerX,this.centerY+40,0,0, 'dunes3');
    this.dunes4 = this.add.tileSprite(this.centerX,this.centerY+50,0,0, 'dunes4');

    this.player = this.matter.add.image(250, 530, 'tankertot', null, {friction:0}).setCollisionCategory(this.playerCategory);
    this.cannon = this.matter.add.image(250, 530, 'cannon', null, {friction:0, shape: 'circle'}).setCollisionCategory(this.playerCategory).setScale(.84);
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 }).setCollisionCategory(this.borderCategory);

    var plat1 = this.matter.add.image(340, 480, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(2).setCollisionCategory(this.environmentCategory).setAngle(90);
    var plat2 = this.matter.add.image(525, 200, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    //var plat3 = this.matter.add.image(500, 365, "woodPlatform", null, { isStatic: true, friction: 0 }).setScale(1.5).setCollisionCategory(this.environmentCategory);

    var break1frame = 0;
    var break1 = this.matter.add.sprite(500, 365, 'break', null, { isStatic: true, friction: 0 }, break1frame).setScale(2).setCollisionCategory(this.environmentCategory);

    this.player.setCollidesWith([this.borderCategory, this.environmentCategory, this.bulletCategory]);
    this.cannon.setCollidesWith([this.borderCategory, this.environmentCategory]);

    var squirrel = this.matter.add.image(421, 530, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var speedy = this.matter.add.image(511, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var tanky = this.matter.add.image(511, 530, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);

    //this.squirrelCount = 3;

    this.bulletPresent = false;
    this.gameOver = false;
    this.bounceCount = 0;
    this.bulletspeed = 400;

    this.input.on(
      "pointermove",
      function(pointer){
        this.pointerLocation = pointer;
        //var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        //var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointer);
        //this.cannon.setAngle(angle);
      }, this
    );

    this.input.on("pointerdown", this.shoot, this);
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
        this.scene.start('Section2End', {
            currentLevel: this.currentLevel,
            shotCount: this.shotCount,
            threeStar: this.threeStar,
            twoStar: this.twoStar,
            oneStar: this.oneStar,
            backgroundX: this.background.tilePositionX,
            dunes1X: this.dunes1.tilePositionX,
            dunes2X: this.dunes1.tilePositionX,
            dunes3X: this.dunes1.tilePositionX,
            dunes4X: this.dunes1.tilePositionX,
            tankerX: this.player.x,
            playerCategory: this.playerCategory,
            enemyCategory: this.enemyCategory,
            borderCategory: this.borderCategory,
            bulletCategory: this.bulletCategory,
            environmentCategory: this.environmentCategory
          });
      }
      //Checks if the two objects colliding are the walls or platforms and bullet
      else if((event.pairs[0].bodyA.gameObject == plat1 ||
          event.pairs[0].bodyA.gameObject == plat2 ||
          event.pairs[0].bodyA.gameObject == break1 ||
          event.pairs[0].bodyA.gameObject == ground ||
          event.pairs[0].bodyA.gameObject == hwall ||
          event.pairs[0].bodyA.gameObject == vwall1 ||
          event.pairs[0].bodyA.gameObject == vwall2) && event.pairs[0].bodyB.gameObject == this.bullet){
        this.bounceCount += 1;
        this.sound.play('bounce');
      }
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
        this.scene.start('Section2End', {
            currentLevel: this.currentLevel,
            shotCount: this.shotCount,
            threeStar: this.threeStar,
            twoStar: this.twoStar,
            oneStar: this.oneStar,
            backgroundX: this.background.tilePositionX,
            dunes1X: this.dunes1.tilePositionX,
            dunes2X: this.dunes1.tilePositionX,
            dunes3X: this.dunes1.tilePositionX,
            dunes4X: this.dunes1.tilePositionX,
            tankerX: this.player.x,
            playerCategory: this.playerCategory,
            enemyCategory: this.enemyCategory,
            borderCategory: this.borderCategory,
            bulletCategory: this.bulletCategory,
            environmentCategory: this.environmentCategory
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
        this.dunes1.tilePositionX -= 0.15;
        this.dunes2.tilePositionX -= 0.2;
        this.dunes3.tilePositionX -= 0.25;
        this.dunes4.tilePositionX -= 0.3;
      };
    } else if(movement.d.isDown){
      this.player.setVelocityX(2);
      this.cannon.setVelocityX(2);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.dunes1.tilePositionX += 0.15;
        this.dunes2.tilePositionX += 0.2;
        this.dunes3.tilePositionX += 0.25;
        this.dunes4.tilePositionX += 0.3;
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

  updateCannon(pointerLocation){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointerLocation);
    this.cannon.setAngle(angle);
  }
}
