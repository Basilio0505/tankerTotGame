/*global Phaser*/
export default class Level9 extends Phaser.Scene {
  constructor () {
    super('Level9');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 4;
    this.twoStar = 6;
    this.oneStar = 8;

    this.registry.set('level', 9)
    this.squirrelCount = 11;

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
    this.buildingsb = this.add.tileSprite(this.centerX,this.centerY,0,0, 'buildingsb');
    this.buildingsf = this.add.tileSprite(this.centerX,this.centerY,0,0, 'buildingsf');

    //create player
    this.player = this.matter.add.image(68, 535, 'tankertot', null, {friction:0, ignoreGravity: true}).setFixedRotation(true).setCollisionCategory(this.playerCategory);
    this.cannon = this.matter.add.image(68, 540, 'cannon', null, {shape: 'circle', friction:0, ignoreGravity: true}).setCollisionCategory(this.playerCategory).setScale(.78);

    //create borders
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);

    //create platforms
    var plat1 = this.matter.add.image(72, 72, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setAngle(135).setCollisionCategory(this.environmentCategory);
    var plat2 = this.matter.add.image(728, 72, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setAngle(45).setCollisionCategory(this.environmentCategory);
    var plat3 = this.matter.add.image(400, 213, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(2).setCollisionCategory(this.environmentCategory);
    var plat4 = this.matter.add.image(172, 333, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.environmentCategory);
    var plat5 = this.matter.add.image(322, 458, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.environmentCategory);
    var plat6 = this.matter.add.image(628, 333, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.environmentCategory);
    var plat7 = this.matter.add.image(478, 458, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.environmentCategory);

    //create enemies
    var squirrel0 = this.matter.add.image(72, 260, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true).setAngle(90);
    var squirrel1 = this.matter.add.image(72, 330, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true).setAngle(90);
    var squirrel2 = this.matter.add.image(72, 400, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true).setAngle(90);
    var squirrel3 = this.matter.add.image(728, 260, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true).setAngle(270);
    var squirrel4 = this.matter.add.image(728, 330, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true).setAngle(270);
    var squirrel5 = this.matter.add.image(728, 400, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true).setAngle(270);
    var squirrel6 = this.matter.add.image(172, 275, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var squirrel7 = this.matter.add.image(322, 400, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var squirrel8 = this.matter.add.image(628, 275, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    var squirrel9 = this.matter.add.image(478, 400, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    this.kingsquirrel = this.matter.add.image(400, 112, "squirrel", null, { isStatic: true }).setScale(2).setCollisionCategory(this.enemyCategory).setSensor(true);
    this.kingsquirrel.health = 4;

    //player trajectory
    this.trajectory = this.add.image(68, 540, 'trajectory', null, {friction:0});

    //create text/UI
    this.countText = this.add.text( 16, 6, 'Bullets Left: ' + this.oneStar, { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var levelText = this.add.text( this.centerX - 30, 6, 'Level 9', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var exit = this.add.sprite(this.centerX+300,this.centerY-283,'exit',0).setInteractive().setScale(2.2);
    exit.on("pointerover", function(){this.setFrame(1);});
    exit.on("pointerout", function(){this.setFrame(0);});
    exit.on("pointerup", function(){this.scene.start("LevelSelect")}, this);

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

    this.input.on("pointerdown", this.shoot, this);

    //Decects collision of two objects
    this.matter.world.on('collisionstart', function(event){
      if (event.pairs[0].bodyB.gameObject == this.bullet){
        //Checks if the two objects colliding are the regular squirrel and bullet
        if(event.pairs[0].bodyA.gameObject == squirrel0){
          squirrel0.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }//Checks if the two objects colliding are the tank squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == squirrel1){
          squirrel1.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        //Checks if the two objects colliding are the speedy squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == squirrel2){
          squirrel2.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == squirrel3){
          squirrel3.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == squirrel4){
          squirrel4.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == squirrel5){
          squirrel5.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == squirrel6){
          squirrel6.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == squirrel7){
          squirrel7.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == squirrel8){
          squirrel8.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == squirrel9){
          squirrel9.destroy();
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        else if(event.pairs[0].bodyA.gameObject == this.kingsquirrel){
          this.kingsquirrel.health -= 1;
          if (this.kingsquirrel.health == 0){
            this.kingsquirrel.destroy();
            this.squirrelCount -= 1;
            this.sound.play('squirreldeath');
          }

        }

        //Checks if the two objects colliding are the player and the player bullet
        else if(event.pairs[0].bodyA.gameObject == this.player){
          //GAME OVER
          this.registry.set('selfHit', true);
          this.registry.set('Level9Score', 0);
          if(this.registry.get('Level9HighScore') < this.registry.get('Level9Score')){
            this.registry.set('Level9HighScore', this.registry.get('Level9Score'));
          }
          this.scene.start('Section3End', {
            backgroundX: this.background.tilePositionX,
            buildingsfX: this.buildingsf.tilePositionX,
            buildingsbX: this.buildingsb.tilePositionX,
            tankerX: this.player.x
            });
        }
        //Checks if the two objects colliding are the walls or platforms and bullet
        else if(event.pairs[0].bodyA.gameObject == plat1 ||
            event.pairs[0].bodyA.gameObject == plat2 ||
            event.pairs[0].bodyA.gameObject == plat3 ||
            event.pairs[0].bodyA.gameObject == plat4 ||
            event.pairs[0].bodyA.gameObject == plat5 ||
            event.pairs[0].bodyA.gameObject == plat6 ||
            event.pairs[0].bodyA.gameObject == plat7 ||
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
    if (this.bulletPresent == false) {

      //Makes sure there is no active bullet present
      if (this.squirrelCount == 0){
        //Loads score Scene and passes info for display over
        if(this.shotCount == this.threeStar){
          this.registry.set('Level9Score', 3)
        }else if(this.shotCount <= this.twoStar){
          this.registry.set('Level9Score', 2)
        }else if(this.shotCount <= this.oneStar){
          this.registry.set('Level9Score', 1)
        }else if(this.shotCount > this.oneStar){
          this.registry.set('Level9Score', 0)
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
      else if(this.oneStar - this.shotCount < 1){
        this.registry.set('Level7Score', 0)
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
    if(pointer.x > 30 && pointer.x < 770 &&
    pointer.y > 30 && pointer.y < 570){
      if(pointer.x > (this.player.x + 30) || pointer.x < (this.player.x - 30) ||
      pointer.y < (this.player.y - 30)){
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
          this.countText.setText('Bullets Left: ' + (this.oneStar - this.shotCount));
        }
      }
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
