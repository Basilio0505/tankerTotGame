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
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
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
    this.player = this.physics.add.sprite(this.centerX, this.centerY, 'tankertot');
    this.cannon = this.physics.add.sprite(this.centerX, this.centerY, 'cannon');
    //this.cannon.body.allowGravity = false;

    //this.container = this.add.container();
    //this.container.add(this.player);
    //this.container.add(this.cannon);

    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 800, 600);

    this.walls = this.physics.add.staticGroup();
    this.walls.create(16,16, 'vwall');
    this.walls.create(784,16, 'vwall');
    this.walls.create(16,16, 'hwall');
    this.walls.create(16,584, 'hwall');

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.cannon, this.walls);

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
      this.cannon.setVelocityX(-200);
      //this.player.body.velocity.x -= speed;
    } else if(movement.d.isDown){
      this.player.setVelocityX(200);
      this.cannon.setVelocityX(200);
      //this.player.body.velocity.x += speed;
    } else{
      this.player.setVelocityX(0);
      this.cannon.setVelocityX(0);
    }
    if(movement.w.isDown && this.player.body.touching.down){
      this.player.setVelocityY(-200);
      this.cannon.setVelocityY(-200);
    }

    this.bullets.children.each(
      function(b){
        //var bounceCount = 0;
        b.setScale(2);
        this.physics.add.collider(b, this.walls, this.bulletBounce, null, this);
        b.body.bounce.setTo(1,1);

        if(b.active) {
          if(this.bounceCount >= 5){
            b.setActive(false);
            b.disableBody(true, true);
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
    this.bounceCount += 1;
  }
}
