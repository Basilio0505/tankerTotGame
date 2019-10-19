/*global Phaser*/
export default class Level2 extends Phaser.Scene {
  constructor () {
    super('Level2');
  }

  init (data) {
    // Initialization code goes here
    this.bulltPresent = false
    this.threeStar = 2;
    this.twoStar = 4;
    this.oneStar = 6;

    this.currentLevel = 2; //##########CHANGE AFTER LEVEL 3 CREATED

  }

  preload () {// Preload assets
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('bullet', './assets/bullet.png');

    this.load.image('squirrel','./assets/enemySquirrel.png');

    //Environment
    this.load.image('ground', './assets/Environment/groundGrass.png');
    this.load.image('background','./assets/Environment/background.png');
    this.load.image('dunes1','./assets/Environment/dunes1.png');
    this.load.image('dunes2','./assets/Environment/dunes2.png');
    this.load.image('dunes3','./assets/Environment/dunes3.png');
    this.load.image('dunes4','./assets/Environment/dunes4.png');
    this.load.image('woodPlatform', './assets/smallWoodPlat.png');
    this.load.image('wideWoodPlat', './assets/wideWoodPlat.png');

    //All to be replaced
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');
    //this.load.image('gate', './assets/Environment/gate.png');
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('speedy','./assets/speedySquirrel.png');
    this.load.image('tanky','./assets/tankSquirrel.png' );

    //Load Sound FX
    this.load.audio('shot','./assets/Sounds/FX/shot.wav');
    this.load.audio('squirreldeath','./assets/Sounds/FX/squirreldeath.wav');
    this.load.audio('bounce','./assets/Sounds/FX/bounce.wav');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    this.background = this.add.tileSprite(this.centerX,this.centerY,0,0, 'background');
    this.dunes1 = this.add.tileSprite(this.centerX,this.centerY+20,0,0, 'dunes1');
    this.dunes2 = this.add.tileSprite(this.centerX,this.centerY+30,0,0, 'dunes2');
    this.dunes3 = this.add.tileSprite(this.centerX,this.centerY+40,0,0, 'dunes3');
    this.dunes4 = this.add.tileSprite(this.centerX,this.centerY+50,0,0, 'dunes4');
    this.player = this.physics.add.sprite(60, 540, 'tankertot');
    this.cannon = this.physics.add.sprite(60, 540, 'cannon');

    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 800, 600);

    this.walls = this.physics.add.staticGroup();
    this.walls.create(16,16, 'vwall');
    this.walls.create(784,16, 'vwall');
    this.walls.create(16,16, 'hwall');
    this.walls.create(16,584, 'ground');

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.cannon, this.walls);

    //create platforms and hitboxes
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(128, 300, "wideWoodPlat").setScale(1.5).refreshBody();
    this.platforms.create(670, 200, "wideWoodPlat").setScale(1.5).refreshBody();
    this.platforms.create(400, 365, "woodPlatform").setScale(1.5).refreshBody();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.cannon, this.platforms);

    //place enemy squirrels
    this.squirrels = this.physics.add.group();
    this.physics.add.collider(this.squirrels, this.walls);
    this.physics.add.collider(this.squirrels, this.platforms);
    this.squirrels.create(74, 240, "squirrel").setScale(.8)
    this.squirrels.create(681, 135, "speedy").setScale(5)
    this.squirrels.create(411, 300, "tanky").setScale(5)

    //this.gameOver = false;
    this.bounceCount = 0;
    this.bulletspeed = 400;

    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 1
    });

    this.input.on(
      "pointermove",
      function(pointer){
        var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointer);
        this.cannon.setAngle(angle);
      }, this
    );

    this.input.on("pointerdown", this.shoot, this);
    this.shotCount = 0;
  }

  update (time, delta) {
    // Update the scene
    if (this.squirrels.getLength() == 0) {
      if (this.bulletPresent == false){
        this.scene.start('Section2End', {
            currentLevel: this.currentLevel,
            shotCount: this.shotCount,
            threeStar: this.threeStar,
            twoStar: this.twoStar,
            oneStar: this.oneStar,
            backgroundX: this.background.tilePositionX,
            dunes1X: this.dunes1.tilePositionX,
            dunes2X: this.dunes2.tilePositionX,
            dunes3X: this.dunes3.tilePositionX,
            dunes4X: this.dunes4.tilePositionX,
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
      this.player.setVelocityX(-200);
      this.cannon.setVelocityX(-200);
      if(this.player.x > 100){
        this.background.tilePositionX -= 0.1;
        this.dunes1.tilePositionX -= 0.15;
        this.dunes2.tilePositionX -= 0.2;
        this.dunes3.tilePositionX -= 0.25;
        this.dunes4.tilePositionX -= 0.3;
      };
      //this.player.body.velocity.x -= speed;
    } else if(movement.d.isDown){
      this.player.setVelocityX(200);
      this.cannon.setVelocityX(200);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.dunes1.tilePositionX += 0.15;
        this.dunes2.tilePositionX += 0.2;
        this.dunes3.tilePositionX += 0.25;
        this.dunes4.tilePositionX += 0.3;
      };
      //this.player.body.velocity.x += speed;
    } else{
      this.player.setVelocityX(0);
      this.cannon.setVelocityX(0);
    }
    //if(movement.w.isDown && this.player.body.touching.down){
      //this.player.setVelocityY(-200);
      //this.cannon.setVelocityY(-200);
    //}

    this.bullets.children.each(
      function(b){
        //var bounceCount = 0;
        b.setScale(2);
        this.physics.add.collider(b, this.walls, this.bulletBounce, null, this);
        this.physics.add.collider(b, this.platforms, this.bulletBounce, null, this);

        b.body.bounce.setTo(1,1);

        if(b.active) {
          this.physics.add.overlap(b, this.player, this.shootPlayer, null, this);
          this.physics.add.overlap(b, this.cannon, this.shootPlayer, null, this);
          if(this.bounceCount >= 5){
            b.setActive(false);
            b.disableBody(true, true);
            this.bulletPresent = false
            this.bounceCount = 0;
          }
        }
      }.bind(this)
    );
    this.bullets.children.each(
  function(b){
    if(b.active) {
        this.physics.add.overlap(b, this.squirrels, this.shootSquirrel, null, this);
      if(b.y < 0 || b.y > 600 || b.x < 0 || b.x > 800){
        b.setActive(false);
      }
    }
  }.bind(this)
);
  }

  shoot(pointer){
    this.bulletPresent = true;
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, pointer);
    var velocityFromRotation = this.physics.velocityFromRotation;
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(angle, this.bulletspeed, velocity);

    var bullet = this.bullets.get();
    bullet.body.allowGravity = false;
    bullet.setAngle(Phaser.Math.RAD_TO_DEG * angle);
    bullet
      .enableBody(true, this.player.x + (Math.cos(angle) * 45), this.player.y + (Math.sin(angle) * 45), true, true)
      .setVelocity(velocity.x, velocity.y);
    this.shotCount += 1;
    this.sound.play('shot');
  }
  shootPlayer(bullet, player){
    this.scene.start('Section2End', {
      currentLevel: this.currentLevel,
      shotCount: 100,
      threeStar: this.threeStar,
      twoStar: this.twoStar,
      oneStar: this.oneStar,
      backgroundX: this.background.tilePositionX,
      dunes1X: this.dunes1.tilePositionX,
      dunes2X: this.dunes2.tilePositionX,
      dunes3X: this.dunes3.tilePositionX,
      dunes4X: this.dunes4.tilePositionX,
      tankerX: this.player.x
      });
  }
  shootSquirrel(bullet, squirrel){
    squirrel.disableBody(true, true);
    this.squirrels.remove(squirrel);
    this.sound.play('squirreldeath');
  }
  bulletBounce(){
    this.bounceCount += 1;
    this.sound.play('bounce');
  }
}
