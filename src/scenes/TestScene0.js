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
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    //All to be replaced
    this.load.image("background", "./assets/Environment/map.png");
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');
    //this.load.image('gate', './assets/Environment/gate.png');

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
    console.log('what')
    //Create the scene
    //Define Variables
    this.gameOver = false;
    this.bulletspeed = 300;
    this.physics.world.setBounds(0, 0, 800, 600);

    //Add background
    var background = this.add.sprite(this.centerX, this.centerY, 'background');

    //Add Player
    this.player = this.physics.add.sprite(this.centerX, this.centerY, 'tankertot');
    this.player.setCollideWorldBounds(true);

    this.walls = this.physics.add.staticGroup();
    this.walls.create(16,16, 'vwall');
    this.walls.create(784,16, 'vwall');
    this.walls.create(16,16, 'hwall');
    this.walls.create(16,584, 'hwall');

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.cannon, this.walls);

    //Add Gate
    //this.gate = this.physics.add.staticGroup();
    //this.gate.create(this.centerX, 16, 'gate');

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
      maxSize: 1
    });

    //Add input
    this.input.on(
      "pointermove",
      function(pointer){
        var betweenPoints = Phaser.Math.Angle.BetweenPoints;
        var angle = Phaser.Math.RAD_TO_DEG * betweenPoints(this.cannon, pointer);
        this.cannon.setAngle(angle);
      }, this
    );

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

    //Squirrel Movement
    //this.squirrels.children.each(this.moveSquirrel());

    //Squirrel interaction
    this.bullets.children.each(
      function(b){
        //var bounceCount = 0;
        b.setScale(2);
        this.physics.add.collider(b, this.walls, this.bulletBounce, null, this);
        b.body.bounce.setTo(1,1);

        if(b.active) {
          //if(b.y < 0 || b.y > 600 || b.x < 0 || b.x > 800){
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

  bulletBounce(){
      this.bounceCount += 1;
  }
}
