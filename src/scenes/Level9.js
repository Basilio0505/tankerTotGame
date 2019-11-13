/*global Phaser*/
export default class Level9 extends Phaser.Scene {
  constructor () {
    super('Level9');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 3;
    this.twoStar = 4;
    this.oneStar = 6;

    this.registry.set('level', 9)
    this.squirrelCount = 3;

    this.pointerLocation = {x:0, y:0};

    this.playerCategory = this.registry.get('playerCategory');
    this.enemyCategory = this.registry.get('enemyCategory');
    this.borderCategory = this.registry.get('borderCategory');
    this.bulletCategory = this.registry.get('bulletCategory');
    this.environmentCategory = this.registry.get('environmentCategory');
  }

  preload () {// Preload assets
    //Player Assets
    /*this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('bullet', './assets/TankerTot/bullet.png');
    this.load.image('explosion1', './assets/TankerTot/explosion1.png');
    this.load.image('explosion2', './assets/TankerTot/explosion2.png');
    this.load.image('explosion3', './assets/TankerTot/explosion3.png');
    this.load.image('explosion4', './assets/TankerTot/explosion4.png');
    //this.load.image('rocket', './assets/rocket.png');

    //Environment
    this.load.image('ground', './assets/Environment/groundGrass.png');
    this.load.image('background','./assets/Environment/background.png');
    this.load.image('buildingsb','./assets/Environment/backgroundbuildings.png');
    this.load.image('buildingsf','./assets/Environment/foregroundbuildings.png');
    this.load.image('woodPlatform', './assets/Environment/smallWoodPlat.png');

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
    this.load.audio('bounce','./assets/Sounds/FX/bounce.wav');*/

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
    this.buildingsb = this.add.tileSprite(this.centerX,this.centerY,0,0, 'buildingsb');
    this.buildingsf = this.add.tileSprite(this.centerX,this.centerY,0,0, 'buildingsf');

    //create player
    this.player = this.matter.add.image(68, 530, 'tankertot', null, {friction:0}).setFixedRotation(true).setCollisionCategory(this.playerCategory);
    this.cannon = this.matter.add.image(68, 530, 'cannon', null, {friction:0, shape: 'circle'}).setCollisionCategory(this.playerCategory).setScale(.84);

    //create borders
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);

    //create platforms
    var plat1 = this.matter.add.image(100, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat2 = this.matter.add.image(700, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat3 = this.matter.add.image(400, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);

    //create enemies
    var squirrel = this.matter.add.image(165, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var speedy = this.matter.add.image(740, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var tanky = this.matter.add.image(465, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);

    //create text/UI
    this.countText = this.add.text( 16, 6, 'Bullets Used: 0', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var levelText = this.add.text( this.centerX - 30, 6, 'Level 9', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    //assign collisions
    this.player.setCollidesWith([this.borderCategory, this.environmentCategory, this.bulletCategory]);
    this.cannon.setCollidesWith([this.borderCategory, this.environmentCategory]);

    var squirrelTween = this.tweens.add({
      targets: squirrel,
      x: 60,
      ease: "Cubic",
      duration: 1200,
      yoyo: true,
      repeat: -1,
      repeatDelay: 500
    });

    var speedyTween = this.tweens.add({
      targets: speedy,
      x: 660,
      ease: "Cubic",
      duration: 1500,
      yoyo: true,
      repeat: -1,
      repeatDelay: 500
    });

    var tankyTween = this.tweens.add({
      targets: tanky,
      x: 360,
      ease: "Cubic",
      duration: 1800,
      yoyo: true,
      repeat: -1,
      repeatDelay: 500
    });

    //create pointer interactions
    this.input.on(
      "pointermove",
      function(pointer){
        this.pointerLocation = pointer;
      }, this
    );

    this.input.on("pointerdown", this.shoot, this);

    //Decects collision of two objects
    this.matter.world.on('collisionstart', function(event){
      //Checks if the two objects colliding are the regular squirrel and bullet
      if(event.pairs[0].bodyA.gameObject == squirrel && event.pairs[0].bodyB.gameObject == this.bullet){
        squirrelTween.remove();
        squirrel.destroy();
        this.squirrelCount -= 1;
        this.sound.play('squirreldeath');
      }//Checks if the two objects colliding are the tank squirrel and bullet
      else if(event.pairs[0].bodyA.gameObject == tanky && event.pairs[0].bodyB.gameObject == this.bullet){
        tankyTween.remove();
        tanky.destroy();
        this.squirrelCount -= 1;
        this.sound.play('squirreldeath');
      }
      //Checks if the two objects colliding are the speedy squirrel and bullet
      else if(event.pairs[0].bodyA.gameObject == speedy && event.pairs[0].bodyB.gameObject == this.bullet){
        speedyTween.remove();
        speedy.destroy();
        this.squirrelCount -= 1;
        this.sound.play('squirreldeath');
      }
      //Checks if the two objects colliding are the player and the player bullet
      else if(event.pairs[0].bodyA.gameObject == this.player && event.pairs[0].bodyB.gameObject == this.bullet){
        //GAME OVER
        this.registry.set('Level9Score', 0)
        if(this.registry.get('Level9HighScore') < this.registry.get('Level9Score')){
          this.registry.set('Level9HighScore', this.registry.get('Level9Score'))
        }
        this.scene.start('Section3End', {
          backgroundX: this.background.tilePositionX,
          buildingsfX: this.buildingsf.tilePositionX,
          buildingsbX: this.buildingsb.tilePositionX,
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

    //Gets rid of tank explosion
    if(this.explosionCounter > 0){
      this.explosionCounter -= 1
      if(this.explosionCounter == 0){
        this.explosion.destroy();
        this.explosionCounter = -1
      }
    }

    //Checks if Winning Condition is met
    if (this.squirrelCount == 0) {
      //Makes sure there is no active bullet present
      if (this.bulletPresent == false){
        //Loads score Scene and passes info for display over
        if(this.shotCount == this.threeStar){
          this.registry.set('Level9Score', 3)
        }else if(this.shotCount <= this.twoStar){
          this.registry.set('Level9Score', 2)
        }else if(this.shotCount <= this.oneStar){
          this.registry.set('Level9Score', 1)
        }
        if(this.registry.get('Level9HighScore') < this.registry.get('Level9Score')){
          this.registry.set('Level9HighScore', this.registry.get('Level9Score'))
        }
        this.scene.start('Section3End', {
          backgroundX: this.background.tilePositionX,
          buildingsfX: this.buildingsf.tilePositionX,
          buildingsbX: this.buildingsb.tilePositionX,
          tankerX: this.player.x
          });
      }
    }

    if(this.movement.a.isDown){
      this.player.setVelocityX(-2);
      this.cannon.setVelocityX(-2);
      if(this.player.x > 100){
        this.background.tilePositionX -= 0.1;
        this.buildingsb.tilePositionX -= 0.2;
        this.buildingsf.tilePositionX -= 0.3;
      }
    } else if(this.movement.d.isDown){
      this.player.setVelocityX(2);
      this.cannon.setVelocityX(2);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.buildingsb.tilePositionX += 0.2;
        this.buildingsf.tilePositionX += 0.3;
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
      this.explosion = this.add.image(this.player.x + (Math.cos(angle)*20), this.player.y + (Math.sin(angle)*20), "explosion" + Math.floor(Math.random()*4)).setScale(1.6);
      this.explosionCounter = 15
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

  //updates cannon to point at pointer location
  updateCannon(pointerLocation){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointerLocation);
    this.cannon.setAngle(angle);
  }
}
