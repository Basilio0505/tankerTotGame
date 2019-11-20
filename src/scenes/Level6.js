/*global Phaser*/
export default class Level6 extends Phaser.Scene {
  constructor () {
    super('Level6');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 3;
    this.twoStar = 4;
    this.oneStar = 6;

    this.registry.set('level', 6)
    this.squirrelCount = 3;

    this.pointerLocation = {x:0, y:0};

    this.playerCategory = this.registry.get('playerCategory');
    this.enemyCategory = this.registry.get('enemyCategory');
    this.borderCategory = this.registry.get('borderCategory');
    this.bulletCategory = this.registry.get('bulletCategory');
    this.enemybulletCategoy = this.registry.get('enemybulletCategoy');
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
    this.enemy1bulletPresent = false;
    this.enemy2bulletPresent = false;
    this.enemy3bulletPresent = false;
    this.squirrelDead = false;
    this.tankyDead = false;
    this.speedyDead = false;

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
    this.dunes1 = this.add.tileSprite(this.centerX,this.centerY+20,0,0, 'dunes1');
    this.dunes2 = this.add.tileSprite(this.centerX,this.centerY+30,0,0, 'dunes2');
    this.dunes3 = this.add.tileSprite(this.centerX,this.centerY+40,0,0, 'dunes3');
    this.dunes4 = this.add.tileSprite(this.centerX,this.centerY+50,0,0, 'dunes4');

    //create player
    this.player = this.matter.add.image(68, 536, 'tankertot', null, {friction:0}).setFixedRotation(true).setCollisionCategory(this.playerCategory);
    this.cannon = this.matter.add.image(68, 540, 'cannon', null, {friction:0, shape: 'circle'}).setCollisionCategory(this.playerCategory).setScale(.78);
    this.trajectory = this.add.image(68, 540, 'trajectory', null, {friction:0});

    //create borders
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);

    //create platforms
    var plat1 = this.matter.add.image(100, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat2 = this.matter.add.image(695, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat3 = this.matter.add.image(400, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);

    //create enemies
    this.squirrel = this.matter.add.image(165, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    this.speedy = this.matter.add.image(740, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    this.tanky = this.matter.add.image(465, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);

    //create text/UI
    this.countText = this.add.text( 16, 6, 'Bullets Used: 0', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var levelText = this.add.text( this.centerX - 30, 6, 'Level 6', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    //assign collisions
    this.player.setCollidesWith([this.borderCategory, this.environmentCategory, this.bulletCategory, this.enemybulletCategoy ]);
    this.cannon.setCollidesWith([this.borderCategory, this.environmentCategory]);

    var squirrelTween = this.tweens.add({
      targets: this.squirrel,
      x: 60,
      ease: "Cubic",
      duration: 1200,
      yoyo: true,
      repeat: -1,
      repeatDelay: 500
    });

    var speedyTween = this.tweens.add({
      targets: this.speedy,
      x: 660,
      ease: "Cubic",
      duration: 1500,
      yoyo: true,
      repeat: -1,
      repeatDelay: 500
    });

    var tankyTween = this.tweens.add({
      targets: this.tanky,
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
      //console.log(event.pairs[0].bodyA);
      //console.log(event.pairs[0].bodyB);

      //Checks if the two objects colliding are the regular squirrel and bullet
      if (event.pairs[0].bodyB.gameObject == this.bullet){
        if(event.pairs[0].bodyA.gameObject == this.squirrel ){//&& event.pairs[0].bodyB.gameObject == this.bullet){
          squirrelTween.remove();
          this.squirrel.destroy();
          this.squirrelDead = true;
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }//Checks if the two objects colliding are the tank squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == this.tanky ){//&& event.pairs[0].bodyB.gameObject == this.bullet){
          tankyTween.remove();
          this.tanky.destroy();
          this.tankyDead = true;
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        //Checks if the two objects colliding are the speedy squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == this.speedy ){//&& event.pairs[0].bodyB.gameObject == this.bullet){
          speedyTween.remove();
          this.speedy.destroy();
          this.speedyDead = true;
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        //Checks if the two objects colliding are the player and the player bullet
        else if(event.pairs[0].bodyA.gameObject == this.player ){//&& event.pairs[0].bodyB.gameObject == this.bullet){
          //GAME OVER
          this.registry.set('selfHit', true)
          console.log(this.player.category);
          this.registry.set('Level6Score', 0)
          if(this.registry.get('Level6HighScore') < this.registry.get('Level6Score')){
            this.registry.set('Level6HighScore', this.registry.get('Level6Score'))
          }
          this.scene.start('Section2End', {
            backgroundX: this.background.tilePositionX,
            dunes1X: this.dunes1.tilePositionX,
            dunes2X: this.dunes1.tilePositionX,
            dunes3X: this.dunes1.tilePositionX,
            dunes4X: this.dunes1.tilePositionX,
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
            event.pairs[0].bodyA.gameObject == vwall2) ){//&& event.pairs[0].bodyB.gameObject == this.bullet){
          this.bounceCount += 1;
          this.bullet.setFrame(this.bounceCount);
          this.sound.play('bounce');
        }
      }

      if(event.pairs[0].bodyB.gameObject == this.enemy1bullet || event.pairs[0].bodyB.gameObject == this.enemy2bullet || event.pairs[0].bodyB.gameObject == this.enemy3bullet){
        if(event.pairs[0].bodyA.gameObject == this.player){//&& event.pairs[0].bodyB.gameObject == this.enemy1bullet){
          this.registry.set('Level6Score', 0);
          if(this.registry.get('Level6HighScore') < this.registry.get('Level6Score')){
            this.registry.set('Level6HighScore', this.registry.get('Level6Score'));
          }
          this.scene.start('Section2End', {
            backgroundX: this.background.tilePositionX,
            dunes1X: this.dunes1.tilePositionX,
            dunes2X: this.dunes1.tilePositionX,
            dunes3X: this.dunes1.tilePositionX,
            dunes4X: this.dunes1.tilePositionX,
            tankerX: this.player.x
          });
        }
        //Checks if the two objects colliding are the walls or the enemy bullet
        else if((event.pairs[0].bodyA.gameObject == ground ||
          event.pairs[0].bodyA.gameObject == vwall1 ||
          event.pairs[0].bodyA.gameObject == vwall2) && event.pairs[0].bodyB.gameObject == this.enemy1bullet){
            this.enemy1bullet.destroy();
            this.enemy1bulletPresent = false;
        }
        else if((event.pairs[0].bodyA.gameObject == ground ||
          event.pairs[0].bodyA.gameObject == vwall1 ||
          event.pairs[0].bodyA.gameObject == vwall2) && event.pairs[0].bodyB.gameObject == this.enemy2bullet){
            this.enemy2bullet.destroy();
            this.enemy2bulletPresent = false;
        }
        else if((event.pairs[0].bodyA.gameObject == ground ||
          event.pairs[0].bodyA.gameObject == vwall1 ||
          event.pairs[0].bodyA.gameObject == vwall2) && event.pairs[0].bodyB.gameObject == this.enemy3bullet){
            this.enemy3bullet.destroy();
            this.enemy3bulletPresent = false;
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

    if(this.enemy1bulletPresent == false && !this.squirrelDead){
      this.enemy1Shoot(this.squirrel);
    }
    if(this.enemy2bulletPresent == false && !this.tankyDead){
      this.enemy2Shoot(this.tanky);
    }
    if(this.enemy3bulletPresent == false && !this.speedyDead){
      this.enemy3Shoot(this.speedy);
    }

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
        if(this.shotCount <= this.threeStar){
          this.registry.set('Level6Score', 3)
        }else if(this.shotCount <= this.twoStar){
          this.registry.set('Level6Score', 2)
        }else if(this.shotCount <= this.oneStar){
          this.registry.set('Level6Score', 1)
        }
        if(this.registry.get('Level6HighScore') < this.registry.get('Level6Score')){
          this.registry.set('Level6HighScore', this.registry.get('Level6Score'))
        }
        this.scene.start('Section2End', {
          backgroundX: this.background.tilePositionX,
          dunes1X: this.dunes1.tilePositionX,
          dunes2X: this.dunes1.tilePositionX,
          dunes3X: this.dunes1.tilePositionX,
          dunes4X: this.dunes1.tilePositionX,
          tankerX: this.player.x
          });
      }
    }

    if(this.movement.a.isDown){
      this.player.setVelocityX(-2);
      this.cannon.setVelocityX(-2);
      if(this.player.x > 100){
        this.background.tilePositionX -= 0.1;
        this.dunes1.tilePositionX -= 0.15;
        this.dunes2.tilePositionX -= 0.2;
        this.dunes3.tilePositionX -= 0.25;
        this.dunes4.tilePositionX -= 0.3;
      }
    } else if(this.movement.d.isDown){
      this.player.setVelocityX(2);
      this.cannon.setVelocityX(2);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.dunes1.tilePositionX += 0.15;
        this.dunes2.tilePositionX += 0.2;
        this.dunes3.tilePositionX += 0.25;
        this.dunes4.tilePositionX += 0.3;
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

    if (this.enemy1bulletPresent){
      if ((this.enemy1bullet.x < 0) || (this.enemy1bullet.x > 800) || (this.enemy1bullet.y < 0) || (this.enemy1bullet.y > 600)){
        this.enemy1bullet.destroy();
        this.enemy1bulletPresent = false;
      }
    }
    if (this.enemy2bulletPresent){
      if ((this.enemy2bullet.x < 0) || (this.enemy2bullet.x > 800) || (this.enemy2bullet.y < 0) || (this.enemy2bullet.y > 600)){
        this.enemy2bullet.destroy();
        this.enemy2bulletPresent = false;
      }
    }
    if (this.enemy3bulletPresent){
      if ((this.enemy3bullet.x < 0) || (this.enemy3bullet.x > 800) || (this.enemy3bullet.y < 0) || (this.enemy3bullet.y > 600)){
        this.enemy3bullet.destroy();
        this.enemy3bulletPresent = false;
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

  enemy1Shoot(enemy){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, enemy);
    if  (this.enemy1bulletPresent == false){
      this.enemy1bullet = this.matter.add.sprite(enemy.x /*+ (Math.cos(angle)*45)*/,
        enemy.y /*+ (Math.sin(angle)*45)*/,
        'enemybullet', null, {
          shape: 'circle',
          ignoreGravity: true,
          collisionFilter:{category: this.enemybulletCategoy},
          isStatic: false,
          restitution: 1,
          frictionAir: 0
        }).setScale(2);
      this.enemy1bullet.setCollidesWith([this.playerCategory, this.borderCategory]);
      this.enemy1bullet.setVelocity(Math.cos(angle) * -4, Math.sin(angle) * -4);
      this.sound.play('shot');
      this.enemy1bulletPresent = true;
    }
  }
  enemy2Shoot(enemy){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, enemy);
    if  (this.enemy2bulletPresent == false){
      this.enemy2bullet = this.matter.add.sprite(enemy.x /*+ (Math.cos(angle)*45)*/,
        enemy.y /*+ (Math.sin(angle)*45)*/,
        'enemybullet', null, {
          shape: 'circle',
          ignoreGravity: true,
          collisionFilter:{category: this.enemybulletCategoy},
          isStatic: false,
          restitution: 1,
          frictionAir: 0
        }).setScale(2);
      this.enemy2bullet.setCollidesWith([this.playerCategory, this.borderCategory]);
      this.enemy2bullet.setVelocity(Math.cos(angle) * -4, Math.sin(angle) * -4);
      this.sound.play('shot');
      this.enemy2bulletPresent = true;
    }
  }
  enemy3Shoot(enemy){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, enemy);
    if  (this.enemy3bulletPresent == false){
      this.enemy3bullet = this.matter.add.sprite(enemy.x /*+ (Math.cos(angle)*45)*/,
        enemy.y /*+ (Math.sin(angle)*45)*/,
        'enemybullet', null, {
          shape: 'circle',
          ignoreGravity: true,
          collisionFilter:{category: this.enemybulletCategoy},
          isStatic: false,
          restitution: 1,
          frictionAir: 0
        }).setScale(2);
      this.enemy3bullet.setCollidesWith([this.playerCategory, this.borderCategory]);
      this.enemy3bullet.setVelocity(Math.cos(angle) * -4, Math.sin(angle) * -4);
      this.sound.play('shot');
      this.enemy3bulletPresent = true;
    }
  }

  //updates cannon to point at pointer location
  updateCannon(pointerLocation){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointerLocation);
    this.cannon.setAngle(angle);
    this.trajectory.setAngle(angle+45)
    this.trajectory.setPosition(this.player.x + (Math.cos(angle*Math.PI/180)*50), 540 + (Math.sin(angle*Math.PI/180)*50))

  }
}
