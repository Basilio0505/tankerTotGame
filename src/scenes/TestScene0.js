/*global Phaser*/
export default class TestScene0 extends Phaser.Scene {
  constructor () {
    super('TestScene0');
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
    //this.load.image('hwall', './assets/Environment/horizontalWall.png');
    //this.load.image('vwall', './assets/Environment/verticalWall.png');
    this.load.image('gate', './assets/Environment/gate.png');

    this.load.image('bullet', './assets/bullet.png');
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('squirrel','./assets/enemySquirrel.png');
    this.load.image('speedy','./assets/speedySquirrel.png');
    this.load.image('tanky','./assets/tankSquirrel.png' );

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    //Define Variables
    this.gameOver = false;
    this.bulletspeed = 300;
    this.physics.world.setBounds(0, 0, 800, 600);

    //Add background
    var background = this.add.sprite(this.centerX, this.centerY, 'background');

    //Add Player
    this.player = this.physics.add.sprite(this.centerX, this.centerY, 'tankertot', 0);
    this.player.scaleX = 4;
    this.player.scaleY = 4;
    this.player.setCollideWorldBounds(true);

    //Add Gate
    this.gate = this.physics.add.staticGroup();
    this.gate.create(this.centerX, 16, 'gate');

    //Add squirrels
    this.squirrels = this.physics.add.group({
      key: "squirrel",
      repeat: 0,
      setXY: { x: 100, y: 50, stepX: Phaser.Math.Between(100, 275), stepY: Phaser.Math.Between(0, 50) },
    });

    this.squirrels.children.iterate(function(child){
      child.setScale(3);
    });

    //Add Bullets
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 20
    });

    this.bullets.children.iterate(function(child){
      child.setScale(3);
    });

    //Add input
    this.input.on("pointerdown", this.shoot, this);

    //Add collider
    this.physics.add.collider(
      this.player,
      this.squirrels,
      this.hitSquirrel,
      null,
      this
    );
  }

  update (time, delta) {
    // Update the scene
    if(this.gameOver){
      this.scene.start('Boot');
      return;
    }

    //Check overlapping of gate
    var isOverlapping = this.physics.world.overlap(this.gate, this.player);
    //console.log(isOverlapping);

    //End of level checking
    //if (isOverlapping) {
    //  if (this.squirrels.getLength() == 0) {
    //    this.scene.start("TestScene1");
    //  };
    //};

    //Movement
    var movement = this.input.keyboard.addKeys({
      w:Phaser.Input.Keyboard.KeyCodes.W,
      s:Phaser.Input.Keyboard.KeyCodes.S,
      a:Phaser.Input.Keyboard.KeyCodes.A,
      d:Phaser.Input.Keyboard.KeyCodes.D});
    var speed = 3;

    if(movement.a.isDown){
      this.player.x -= speed;
      this.player.setFrame(3);
    } else if(movement.d.isDown){
      this.player.x += speed;
      this.player.setFrame(0);
    }
    if(movement.w.isDown){
      this.player.y -= speed;
      this.player.setFrame(1);
    } else if(movement.s.isDown){
      this.player.y += speed;
      this.player.setFrame(2);
    }

    //Squirrel Movement
    this.squirrels.children.each(this.moveSquirrel());

    //Squirrel interaction
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
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, pointer);
    var velocityFromRotation = this.physics.velocityFromRotation;
    var velocity = new Phaser.Math.Vector2();
    velocityFromRotation(angle, this.bulletspeed, velocity);

    var bullet = this.bullets.get();
    bullet.setAngle(Phaser.Math.RAD_TO_DEG * angle);
    bullet
      .enableBody(true, this.player.x, this.player.y, true, true)
      .setVelocity(velocity.x, velocity.y);
  }

  moveSquirrel(b){
    this.physics.moveToObject(b, this.player);
  }

  shootSquirrel(bullet, squirrel){
    squirrel.disableBody(true, true);
    this.squirrels.remove(squirrel);
    bullet.disableBody(true, true);
  }

  hitSquirrel(player, squirrel){
    this.gameOver = true;
  }
}
