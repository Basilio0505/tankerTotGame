/*global Phaser*/
export default class Level2 extends Phaser.Scene {
  constructor () {
    super('Level2');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 1;
    this.twoStar = 3;
    this.oneStar = 5;
    this.registry.set('level', 2)
    this.squirrelCount = 3;

    this.pointerLocation = {x:0, y:0};

    this.playerCategory = this.registry.get('playerCategory');
    this.enemyCategory = this.registry.get('enemyCategory');
    this.borderCategory = this.registry.get('borderCategory');
    this.bulletCategory = this.registry.get('bulletCategory');
    this.environmentCategory = this.registry.get('environmentCategory');
  }

  preload () {
    // Preload assets
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

    //create plyaer
    this.player = this.matter.add.image(68, 536, 'tankertot', null, {friction:0}).setFixedRotation(true).setCollisionCategory(this.playerCategory);
    this.cannon = this.matter.add.image(68, 540, 'cannon', null, {friction:0, shape: 'circle'}).setCollisionCategory(this.playerCategory).setScale(.78);
    this.trajectory = this.add.image(68, 540, 'trajectory', null, {friction:0});

    //create border
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);

    //create platforms
    var plat1 = this.matter.add.image(700, 545, "brickPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory).setAngle(135);
    var plat2 = this.matter.add.image(500, 365, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat3 = this.matter.add.image(100, 365, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat4 = this.matter.add.image(700, 280, "brickPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory).setAngle(45);
    var plat5 = this.matter.add.image(500, 580, "brickPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);

    //create enemies
    var squirrel = this.matter.add.image(600, 528, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var speedy = this.matter.add.image(500, 301, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var tanky = this.matter.add.image(111, 301, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);

    //create tutorial frames
    this.tutorialActive = true;//bool used to stop all other actions while tutorialText is active
    this.tutorialScore = this.add.image(this.centerX, this.centerY, "scoreText").setScale(1.5);
    this.tutorialBullet = this.add.image(this.centerX, this.centerY, "bulletText").setScale(1.5);

    //create text/UI
    this.countText = this.add.text( 16, 6, 'Bullets Used: 0', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var levelText = this.add.text( this.centerX - 30, 6, 'Level 2', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    //assign collisions
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
      if (event.pairs[0].bodyB.gameObject == this.bullet){
        if(event.pairs[0].bodyA.gameObject == squirrel){
          squirrel.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }//Checks if the two objects colliding are the tank squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == tanky){
          tanky.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        //Checks if the two objects colliding are the speedy squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == speedy){
          speedy.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        //Checks if the two objects colliding are the player and the player bullet
        else if(event.pairs[0].bodyA.gameObject == this.player){
          //GAME OVER
          this.registry.set('Level2Score', 0);
          this.registry.set('selfHit', true);
          if(this.registry.get('Level2HighScore') < this.registry.get('Level2Score')){
            this.registry.set('Level2HighScore', this.registry.get('Level2Score'));
          }
          this.scene.start('Section1End', {
            backgroundX: this.background.tilePositionX,
            mountainsX: this.mountains.tilePositionX,
            treesX: this.trees.tilePositionX,
            tankerX: this.player.x
            });
        }
          //Checks if the two objects colliding are the walls or platforms and bullet
        else if(event.pairs[0].bodyA.gameObject == plat1 ||
            event.pairs[0].bodyA.gameObject == plat2 ||
            event.pairs[0].bodyA.gameObject == plat3 ||
            event.pairs[0].bodyA.gameObject == plat4 ||
            event.pairs[0].bodyA.gameObject == plat5 ||
            event.pairs[0].bodyA.gameObject == ground ||
            event.pairs[0].bodyA.gameObject == hwall ||
            event.pairs[0].bodyA.gameObject == vwall1 ||
            event.pairs[0].bodyA.gameObject == vwall2){
          this.bounceCount += 1;
          this.bullet.setFrame(this.bounceCount);
          this.sound.play('bounce');
        }
      }

      //If player bullet bounce reaches limit
      if (this.bounceCount > 3){
        this.trajectory = this.add.image(68, 540, 'trajectory', null, {friction:0});
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
    this.cannon.setPosition(this.player.x, 540);

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
          this.registry.set('Level2Score', 3)
        }else if(this.shotCount <= this.twoStar){
          this.registry.set('Level2Score', 2)
        }else if(this.shotCount <= this.oneStar){
          this.registry.set('Level2Score', 1)
        }else if(this.shotCount > this.oneStar){
          this.registry.set('Level2Score', 0)
        }
        if(this.registry.get('Level2HighScore') < this.registry.get('Level2Score')){
          this.registry.set('Level2HighScore', this.registry.get('Level2Score'))
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
      this.trajectory.destroy()
      this.explosion = this.add.image(this.player.x + (Math.cos(angle)*20), this.player.y + (Math.sin(angle)*20), "explosion" + Math.floor(Math.random()*4)).setScale(1.6);
      this.explosionCounter = 15
      this.bullet = this.matter.add.sprite(this.player.x + (Math.cos(angle)*40),
      this.player.y+ (Math.sin(angle)*40),
      'bulletss',0,{
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
      if(this.tutorialBullet.x == this.centerX){
        this.tutorialBullet.destroy();
        this.tutorialBullet.x = this.centerX-30;
      } else {
        this.tutorialScore.destroy();
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
    var test = Math.sqrt((this.pointerLocation.x-this.cannon.x)*(this.pointerLocation.x-this.cannon.x)+
    (this.pointerLocation.y-this.cannon.y)*(this.pointerLocation.y-this.cannon.y))
    var scale = test/730
    this.cannon.setAngle(angle);
    this.trajectory.setAngle(angle+45)
    this.trajectory.setPosition(this.player.x + (Math.cos(angle*Math.PI/180)*(370 * scale)),
     540 + (Math.sin(angle*Math.PI/180)*(370 * scale)))
    this.trajectory.setScale(scale)
  }
}
