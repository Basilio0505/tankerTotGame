/*global Phaser*/
export default class Level3 extends Phaser.Scene {
  constructor () {
    super('Level3');
  }

  init (data) {
    // Initialization code goes here

  }

  preload () {
    // Preload assets
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    //All to be replaced
    //this.load.image("background", "./assets/Environment/map.png");
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');
    this.load.image('background','./assets/background.png');
    this.load.image('mountains','./assets/mountains.png');
    this.load.image('trees','./assets/trees.png');
    //this.load.image('gate', './assets/Environment/gate.png');
    this.load.image('woodPlatform', './assets/smallWoodPlat.png');
    this.load.image('bullet', './assets/bullet.png');
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('squirrel','./assets/enemySquirrel.png');
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
    this.mountains = this.add.tileSprite(this.centerX,this.centerY+100,0,0, 'mountains');
    this.trees = this.add.tileSprite(this.centerX,this.centerY+150,0,0, 'trees');
    this.player = this.physics.add.sprite(400, 150, 'tankertot');
    this.cannon = this.physics.add.sprite(400, 150, 'cannon');
    var bulletPresent = false;

    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 800, 600);

    this.walls = this.physics.add.staticGroup();
    this.walls.create(16,16, 'vwall');
    this.walls.create(784,16, 'vwall');
    this.walls.create(16,16, 'hwall');
    this.walls.create(16,584, 'hwall');

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.cannon, this.walls);

    //create platforms and hitboxes
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(300, 520, "woodPlatform").setScale(1.5).refreshBody();
    this.platforms.create(400, 520, "woodPlatform").setScale(1.5).refreshBody();
    this.platforms.create(500, 520, "woodPlatform").setScale(1.5).refreshBody();
    this.platforms.create(400, 200, "woodPlatform").setScale(.5).refreshBody();
    this.platforms.create(300,300, "woodPlatform").setAngle(100).setOffset(8,12)
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.cannon, this.platforms);

    //place enemy squirrels
    this.squirrels = this.physics.add.group();
    this.physics.add.collider(this.squirrels, this.walls);
    this.physics.add.collider(this.squirrels, this.platforms);
    this.squirrels.create(300, 440, "squirrel").setScale(.8)
    this.squirrels.create(400, 440, "speedy").setScale(5)
    this.squirrels.create(500, 440, "tanky").setScale(5)

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
        //console.log(angle)
      }, this
    );

    this.input.on("pointerdown", this.shoot, this);
    this.shotCount = 0;
  }

  update (time, delta) {
    // Update the scene
    if (this.squirrels.getLength() == 0 ) {
      if(this.bulletPresent == false){
        this.scene.start('Level3End', {
            shotCount: this.shotCount,
            backgroundX: this.background.tilePositionX,
            mountainsX: this.mountains.tilePositionX,
            treesX: this.trees.tilePositionX,
            tankerX: this.player.x
          });
    }}

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
        this.mountains.tilePositionX -= 0.2;
        this.trees.tilePositionX -= 0.3;
      };
      //this.player.body.velocity.x -= speed;
    } else if(movement.d.isDown){
      this.player.setVelocityX(200);
      this.cannon.setVelocityX(200);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.mountains.tilePositionX += 0.2;
        this.trees.tilePositionX += 0.3;
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
          if(this.bounceCount >= 5){
            this.bulletPresent = false
            b.setActive(false);
            b.disableBody(true, true);
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
    this.bullets.children.each(
      function(b){
        if(b.active) {
          this.physics.add.overlap(b, this.player, this.shootPlayer, null, this);
          this.physics.add.overlap(b, this.cannon, this.shootPlayer, null, this);
        }
      }.bind(this)
    );
  }

  shoot(pointer){
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
    console.log(Math.cos(angle))
    this.shotCount += 1;
    this.sound.play('shot');
    this.bulletPresent = true
  }
  shootSquirrel(bullet, squirrel){
    squirrel.disableBody(true, true);
    this.squirrels.remove(squirrel);
    this.sound.play('squirreldeath');
  }
  shootPlayer(bullet, player){
    this.player.disableBody(true, true);
    this.cannon.disableBody(true, true);
    this.scene.start('Level3End', {
        shotCount: 100,
        backgroundX: this.background.tilePositionX,
        mountainsX: this.mountains.tilePositionX,
        treesX: this.trees.tilePositionX,
      });
  }
  bulletBounce(){
    this.bounceCount += 1;
    this.sound.play('bounce');
  }
}
