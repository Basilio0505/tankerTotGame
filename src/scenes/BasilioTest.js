/*global Phaser*/
export default class BasilioTest extends Phaser.Scene {
  constructor () {
    super('BasilioTest');
  }

  init (data) {
    // Initialization code goes here

  }

  preload () {
    // Preload assets
    this.load.spritesheet('tankertot', './assets/tankerTotSpritesheet.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    //All to be replaced
    this.load.image("background", "./assets/Environment/map.png");
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');
    //this.load.image('gate', './assets/Environment/gate.png');

    this.load.image('bullet', './assets/bullet.png');
    this.load.image('rocket', './assets/rocket.png');
    //this.load.image('squirrel','./assets/enemySquirrel.png');
    //this.load.image('speedy','./assets/speedySquirrel.png');
    //this.load.image('tanky','./assets/tankSquirrel.png' );

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    var background = this.add.sprite(this.centerX, this.centerY, 'background');
    this.player = this.physics.add.sprite(this.centerX, this.centerY, 'tankertot', 0);
    this.player.scaleX = 4;
    this.player.scaleY = 4;
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 800, 600);

    this.walls = this.physics.add.staticGroup();
    this.walls.create(16,16, 'vwall');
    this.walls.create(784,16, 'vwall');
    this.walls.create(16,16, 'hwall');
    this.walls.create(16,584, 'hwall');

    this.physics.add.collider(this.player, this.walls);

    //this.gameOver = false;

    //var bullets, bullet;
    //this.nextFire = 0;
    //this.fireRate = 200;
    this.bounceCount = 0;
    this.bulletspeed = 300;

    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 1
    });

    this.input.on("pointerdown", this.shoot, this);
  }

  update (time, delta) {
    // Update the scene

    var movement = this.input.keyboard.addKeys({
      w:Phaser.Input.Keyboard.KeyCodes.W,
      s:Phaser.Input.Keyboard.KeyCodes.S,
      a:Phaser.Input.Keyboard.KeyCodes.A,
      d:Phaser.Input.Keyboard.KeyCodes.D});
    var speed = 3;

    if(movement.a.isDown){
      this.player.setVelocityX(-200);
      //this.player.body.velocity.x -= speed;
      this.player.setFrame(3);
    } else if(movement.d.isDown){
      this.player.setVelocityX(200);
      //this.player.body.velocity.x += speed;
      this.player.setFrame(0);
    } else{
      this.player.setVelocityX(0);
    }
    if(movement.w.isDown && this.player.body.touching.down){
      this.player.setVelocityY(-200);
    }

    this.bullets.children.each(
      function(b){
        //var bounceCount = 0;
        b.setScale(2);
        this.physics.add.collider(b, this.walls, this.bulletBounce, null, this);
        b.body.bounce.setTo(1,1);
        //if(b.body.checkCollision == true){
        //  this.add.text(0, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
        //  this.bounceCount +=1;
        //}

        if(b.active) {
          //if(b.y < 0 || b.y > 600 || b.x < 0 || b.x > 800){
          if(this.bounceCount >= 5){
            b.setActive(false);
            console.log("what");
            this.bounceCount = 0;
          }
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
      .enableBody(true, this.player.x, this.player.y, true, true)
      .setVelocity(velocity.x, velocity.y);
  }

  bulletBounce(){
    console.log(this.bounceCount);
    this.bounceCount += 1;
  }
}
