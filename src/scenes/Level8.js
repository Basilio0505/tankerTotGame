/*global Phaser*/
export default class Level8 extends Phaser.Scene {
  constructor () {
    super('Level8');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 5;
    this.twoStar = 8;
    this.oneStar = 10;

    this.registry.set('level', 8)
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
    this.buildingsb = this.add.tileSprite(this.centerX,this.centerY,0,0, 'buildingsb');
    this.buildingsf = this.add.tileSprite(this.centerX,this.centerY,0,0, 'buildingsf');

    //create player
    this.player = this.matter.add.image(200, 535, 'tankertot', null, {friction:0, ignoreGravity: true}).setFixedRotation(true).setCollisionCategory(this.playerCategory);
    this.cannon = this.matter.add.image(200, 540, 'cannon', null, {shape: 'circle', friction:0, ignoreGravity: true}).setCollisionCategory(this.playerCategory).setScale(.78);

    //create borders
    var vwall1 = this.matter.add.image(16,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var vwall2 = this.matter.add.image(784,16, 'vwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var hwall = this.matter.add.image(16,16, 'hwall', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);
    var ground = this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 , restitution: 1 }).setCollisionCategory(this.borderCategory);

    //create platforms
    var plat1 = this.matter.add.image(100, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat2 = this.matter.add.image(695, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);
    var plat3 = this.matter.add.image(400, 200, "woodPlatform", null, { isStatic: true, friction: 0 , restitution: 1 }).setScale(1.5).setCollisionCategory(this.environmentCategory);

    var break1frame = 0;
    var break1 = this.matter.add.sprite(190, 120, 'break', null, { isStatic: true, friction: 0 , restitution: 1 }, break1frame).setScale(2).setCollisionCategory(this.environmentCategory).setAngle(90);
    var break2frame = 0;
    var break2 = this.matter.add.sprite(310, 120, 'break', null, { isStatic: true, friction: 0 , restitution: 1 }, break2frame).setScale(2).setCollisionCategory(this.environmentCategory).setAngle(90);
    var break3frame = 0;
    var break3 = this.matter.add.sprite(490, 120, 'break', null, { isStatic: true, friction: 0 , restitution: 1 }, break3frame).setScale(2).setCollisionCategory(this.environmentCategory).setAngle(90);
    var break4frame = 0;
    var break4 = this.matter.add.sprite(610, 120, 'break', null, { isStatic: true, friction: 0 , restitution: 1 }, break4frame).setScale(2).setCollisionCategory(this.environmentCategory).setAngle(90);

    //create enemies
    this.squirrel = this.matter.add.image(165, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    this.speedy = this.matter.add.image(740, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);
    this.tanky = this.matter.add.image(465, 136, "squirrel", null, { isStatic: true }).setScale(1.27).setCollisionCategory(this.enemyCategory).setSensor(true);

    //player trajectory
    this.trajectory = this.add.image(68, 540, 'trajectory', null, {friction:0});

    //create text/UI
    this.countText = this.add.text( 16, 6, 'Bullets Left: ' + this.oneStar, { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var levelText = this.add.text( this.centerX - 30, 6, 'Level 8', { fontSize: '26px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var exit = this.add.sprite(this.centerX+300,this.centerY-283,'exit',0).setInteractive().setScale(2.2);
    exit.on("pointerover", function(){this.setFrame(1);});
    exit.on("pointerout", function(){this.setFrame(0);});
    exit.on("pointerup", function(){this.scene.start("LevelSelect")}, this);

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
      if (event.pairs[0].bodyB.gameObject == this.bullet){
        //Checks if the two objects colliding are the regular squirrel and bullet
        if(event.pairs[0].bodyA.gameObject == this.squirrel ){
          squirrelTween.remove();
          this.squirrel.destroy();
          this.squirrelDead = true;
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }//Checks if the two objects colliding are the tank squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == this.tanky ){
          tankyTween.remove();
          this.tanky.destroy();
          this.tankyDead = true;
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        //Checks if the two objects colliding are the speedy squirrel and bullet
        else if(event.pairs[0].bodyA.gameObject == this.speedy ){
          speedyTween.remove();
          this.speedy.destroy();
          this.speedyDead = true;
          this.squirrelCount -= 1;
          this.sound.play('squirreldeath');
        }
        //Checks if the two objects colliding are the player and the player bullet
        else if(event.pairs[0].bodyA.gameObject == this.player){
          //GAME OVER
          this.registry.set('selfHit', true);
          this.registry.set('Level8Score', 0);
          if(this.registry.get('Level8HighScore') < this.registry.get('Level8Score')){
            this.registry.set('Level8HighScore', this.registry.get('Level8Score'));
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
            event.pairs[0].bodyA.gameObject == ground ||
            event.pairs[0].bodyA.gameObject == hwall ||
            event.pairs[0].bodyA.gameObject == vwall1 ||
            event.pairs[0].bodyA.gameObject == vwall2){
          this.bounceCount += 1;
          this.bullet.setFrame(this.bounceCount);
          this.sound.play('bounce');
        }
        //checks if the two objects colliding are the breakable walls or the bullet
        else if(event.pairs[0].bodyA.gameObject == break1){
          this.bounceCount += 1;
          break1frame +=1;
          if(break1frame > 2){
            break1.destroy();
          }
          else{
            break1.setFrame(break1frame);
          }
          this.sound.play('bounce');
        }else if(event.pairs[0].bodyA.gameObject == break2){
          this.bounceCount += 1;
          break2frame +=1;
          if(break2frame > 2){
            break2.destroy();
          }
          else{
            break2.setFrame(break2frame);
          }
          this.sound.play('bounce');
        }else if(event.pairs[0].bodyA.gameObject == break3){
          this.bounceCount += 1;
          break3frame +=1;
          if(break3frame > 2){
            break3.destroy();
          }
          else{
            break3.setFrame(break3frame);
          }
          this.sound.play('bounce');
        }else if(event.pairs[0].bodyA.gameObject == break4){
          this.bounceCount += 1;
          break4frame +=1;
          if(break4frame > 2){
            break4.destroy();
          }
          else{
            break4.setFrame(break4frame);
          }
          this.sound.play('bounce');
        }
      }

      if(event.pairs[0].bodyB.gameObject == this.enemy1bullet || event.pairs[0].bodyB.gameObject == this.enemy2bullet || event.pairs[0].bodyB.gameObject == this.enemy3bullet){
        if(event.pairs[0].bodyA.gameObject == this.player){
          this.registry.set('Level8Score', 0);
          if(this.registry.get('Level8HighScore') < this.registry.get('Level8Score')){
            this.registry.set('Level8HighScore', this.registry.get('Level8Score'));
          }
          this.registry.set('selfHit', true)
          this.scene.start('Section3End', {
            backgroundX: this.background.tilePositionX,
            buildingsfX: this.buildingsf.tilePositionX,
            buildingsbX: this.buildingsb.tilePositionX,
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
    if (this.bulletPresent == false) {
      //Makes sure there is no active bullet present
      if (this.squirrelCount == 0){
        //Loads score Scene and passes info for display over
        if(this.shotCount == this.threeStar){
          this.registry.set('Level8Score', 3)
        }else if(this.shotCount <= this.twoStar){
          this.registry.set('Level8Score', 2)
        }else if(this.shotCount <= this.oneStar){
          this.registry.set('Level8Score', 1)
        }else if(this.shotCount > this.oneStar){
          this.registry.set('Level8Score', 0)
        }
        if(this.registry.get('Level8HighScore') < this.registry.get('Level8Score')){
          this.registry.set('Level8HighScore', this.registry.get('Level8Score'))
        }
        this.scene.start('Section3End', {
          backgroundX: this.background.tilePositionX,
          buildingsfX: this.buildingsf.tilePositionX,
          buildingsbX: this.buildingsb.tilePositionX,
          tankerX: this.player.x
          });
      }
      else if(this.oneStar - this.shotCount < 1){
        this.registry.set('Level8Score', 0)
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

  enemy1Shoot(enemy){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, enemy);
    if  (this.enemy1bulletPresent == false){
      this.enemy1bullet = this.matter.add.sprite(enemy.x, enemy.y,
        'enemybullet', null, {
          shape: 'circle',
          ignoreGravity: true,
          collisionFilter:{category: this.enemybulletCategoy},
          isStatic: false,
          restitution: 1,
          frictionAir: 0
        });
      this.enemy1bullet.setCollidesWith([this.playerCategory, this.borderCategory]);
      this.enemy1bullet.setVelocity(Math.cos(angle) * -4, Math.sin(angle) * -4);
      this.enemy1bullet.setAngle((angle * (180 / Math.PI))+90);
      this.sound.play('shot');
      this.enemy1bulletPresent = true;
    }
  }
  enemy2Shoot(enemy){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, enemy);
    if  (this.enemy2bulletPresent == false){
      this.enemy2bullet = this.matter.add.sprite(enemy.x, enemy.y,
        'enemybullet', null, {
          shape: 'circle',
          ignoreGravity: true,
          collisionFilter:{category: this.enemybulletCategoy},
          isStatic: false,
          restitution: 1,
          frictionAir: 0
        });
      this.enemy2bullet.setCollidesWith([this.playerCategory, this.borderCategory]);
      this.enemy2bullet.setVelocity(Math.cos(angle) * -4, Math.sin(angle) * -4);
      this.enemy2bullet.setAngle((angle * (180 / Math.PI))+90);
      this.sound.play('shot');
      this.enemy2bulletPresent = true;
    }
  }
  enemy3Shoot(enemy){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, enemy);
    if  (this.enemy3bulletPresent == false){
      this.enemy3bullet = this.matter.add.sprite(enemy.x, enemy.y,
        'enemybullet', null, {
          shape: 'circle',
          ignoreGravity: true,
          collisionFilter:{category: this.enemybulletCategoy},
          isStatic: false,
          restitution: 1,
          frictionAir: 0
        });
      this.enemy3bullet.setCollidesWith([this.playerCategory, this.borderCategory]);
      this.enemy3bullet.setVelocity(Math.cos(angle) * -4, Math.sin(angle) * -4);
      this.enemy3bullet.setAngle((angle * (180 / Math.PI))+90);
      this.sound.play('shot');
      this.enemy3bulletPresent = true;
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
