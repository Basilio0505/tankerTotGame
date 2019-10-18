/*global Phaser*/
export default class Level1 extends Phaser.Scene {
  constructor () {
    super('Level1');
  }

  init (data) {
    // Initialization code goes here
    this.threeStar = 1;
    this.twoStar = 3;
    this.oneStar = 5;

    this.currentLevel = 1;
  }

  preload () {// Preload assets
    this.load.image('tankertot', './assets/TankerTot/tankerTot.png');
    this.load.image('cannon', './assets/TankerTot/cannon.png');
    this.load.image('bullet', './assets/bullet.png');

    this.load.image('squirrel','./assets/enemySquirrel.png');

    //Environment
    this.load.image('ground', './assets/Environment/groundGrass.png');
    this.load.image('background','./assets/Environment/background.png');
    this.load.image('mountains','./assets/Environment/mountains.png');
    this.load.image('trees','./assets/Environment/trees.png');
    this.load.image('woodPlatform', './assets/smallWoodPlat.png');

    //All to be replaced
    this.load.image('hwall', './assets/Environment/horizontalWall.png');
    this.load.image('vwall', './assets/Environment/verticalWall.png');
    this.load.image('shield', './assets/shield.png');
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
    this.mountains = this.add.tileSprite(this.centerX,this.centerY+100,0,0, 'mountains');
    this.trees = this.add.tileSprite(this.centerX,this.centerY+150,0,0, 'trees');

    this.player = this.matter.add.image(60, 535, 'tankertot', null, {friction:0});
    this.cannon = this.matter.add.image(60, 535, 'cannon', null, {friction:0});

    var playerCategory = this.matter.world.nextCategory();
    this.player.setCollisionCategory(playerCategory);
    this.cannon.setCollisionCategory(playerCategory);
    //this.player.setCollidesWith([playerCategory, borderCategory]);

    var borderCategory = this.matter.world.nextCategory();
    this.matter.add.image(16,16, 'vwall', null, { isStatic: true }).setCollisionCategory(borderCategory);
    this.matter.add.image(784,16, 'vwall', null, { isStatic: true }).setCollisionCategory(borderCategory);
    this.matter.add.image(16,16, 'hwall', null, { isStatic: true }).setCollisionCategory(borderCategory);
    this.matter.add.image(16,584, 'ground', null, { isStatic: true, friction: 0 }).setCollisionCategory(borderCategory);

    var environmentCategory = this.matter.world.nextCategory();
    this.matter.add.image(400, 520, "woodPlatform", null, { isStatic: true }).setScale(1.5).setCollisionCategory(environmentCategory);
    this.matter.add.image(400, 200, "woodPlatform", null, { isStatic: true }).setScale(1.5).setCollisionCategory(environmentCategory);
    this.matter.add.image(400, 365, "woodPlatform", null, { isStatic: true }).setScale(1.5).setCollisionCategory(environmentCategory);

    this.player.setCollidesWith([borderCategory, environmentCategory]);
    this.cannon.setCollidesWith([borderCategory, environmentCategory]);

    var enemyCategory = this.matter.world.nextCategory();
    this.matter.add.image(370, 315, "shield", null, { isStatic: true }).setScale(.1).setCollisionCategory(enemyCategory);

    this.matter.add.image(411, 135, "speedy").setScale(5).setCollisionCategory(enemyCategory);
    this.matter.add.image(411, 300, "tanky").setScale(5).setCollisionCategory(enemyCategory);

    var bulletPresent = false;
    this.gameOver = false;
    this.bounceCount = 0;
    this.bulletspeed = 400;

    var Bodies = Phaser.Physics.Matter.Matter.Bodies;
    var rectA = Bodies.rectangle(380, 455, 40, 65.6);
    var rectB = Bodies.rectangle(421, 455, 40, 65.6);
    var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
        parts: [rectA, rectB]
    });
    var enemy = this.matter.add.image(150, 100, 'squirrel').setScale(.8)
    enemy.setExistingBody(compoundBody);

    var cat1 = this.matter.world.nextCategory()
    var cat2 = this.matter.world.nextCategory()

    var block = this.matter.add.image(150, 100, 'squirrel').setScale(.8).setCollisionCategory(enemyCategory);

    block.setExistingBody(compoundBody);

    enemy.setCollisionCategory(cat1);
    //this.bullets = this.physics.add.group({
      //defaultKey: "bullet",
      //maxSize: 1
    //});
    this.input.on("pointerdown", this.shoot, this);
    this.shotCount = 0;
  }

  update (time, delta) {
    // Update the scene

    //if (this.squirrels.getLength() == 0) {
      //if (this.bulletPresent == false){
        //this.scene.start('Section1End', {
            //currentLevel: this.currentLevel,
            //shotCount: this.shotCount,
            //threeStar: this.threeStar,
            //twoStar: this.twoStar,
            //oneStar: this.oneStar,
            //backgroundX: this.background.tilePositionX,
            //mountainsX: this.mountains.tilePositionX,
            //treesX: this.trees.tilePositionX,
            //tankerX: this.player.x
          //});
        //}
    //}

    var movement = this.input.keyboard.addKeys({
      w:Phaser.Input.Keyboard.KeyCodes.W,
      s:Phaser.Input.Keyboard.KeyCodes.S,
      a:Phaser.Input.Keyboard.KeyCodes.A,
      d:Phaser.Input.Keyboard.KeyCodes.D});
    var speed = 3;

    if(movement.a.isDown){
      this.player.setVelocityX(-2);
      this.cannon.setVelocityX(-2);
      if(this.player.x > 100){
        this.background.tilePositionX -= 0.1;
        this.mountains.tilePositionX -= 0.2;
        this.trees.tilePositionX -= 0.3;
      };
    } else if(movement.d.isDown){
      this.player.setVelocityX(2);
      this.cannon.setVelocityX(2);
      if(this.player.x < 700){
        this.background.tilePositionX += 0.1;
        this.mountains.tilePositionX += 0.2;
        this.trees.tilePositionX += 0.3;
      };
    } else{
      this.player.setVelocityX(0);
      this.cannon.setVelocityX(0);
    }

    //this.bullets.children.each(
      //function(b){
        //var bounceCount = 0;
        //b.setScale(2);
        //this.matter.add.collider(b, this.walls, this.bulletBounce, null, this);
        //this.matter.add.collider(b, this.platforms, this.bulletBounce, null, this);

        //b.body.bounce.setTo(1,1);

        //if(b.active) {
          //if(this.bounceCount >= 4){
            //this.bulletPresent = false
            //b.setActive(false);
            //b.disableBody(true, true);
            //this.bounceCount = 0;
          //}
        //}
      //}.bind(this)
    //);
    //this.bullets.children.each(
      //function(b){
        //if(b.active) {
          //this.matter.add.overlap(b, this.shields, this.bulletAbsorb, null, this);

          //this.matter.add.overlap(b, this.player, this.shootPlayer, null, this);
          //this.matter.add.overlap(b, this.cannon, this.shootPlayer, null, this);
          //this.matter.add.overlap(b, this.squirrels, this.shootSquirrel, null, this);
          //if(b.y < 0 || b.y > 600 || b.x < 0 || b.x > 800){
            //b.setActive(false);
          //}
        //}
      //}.bind(this)
    //);
  }

  shoot(pointer){
    var betweenPoints = Phaser.Math.Angle.BetweenPoints;
    var angle = betweenPoints(this.player, pointer);
    console.log(angle);
    var bullet = this.matter.add.sprite(this.player.x + (Math.cos(angle)*45),
    this.player.y+ (Math.sin(angle)*45),
    'bullet',null,{
        shape: 'circle',
        ignoreGravity: true,
        collisionFilter: {group: 1},
        isStatic: false,
        restitution: 1,
        frictionAir: 0
    }).setScale(2);
    bullet.setVelocity(Math.cos(angle)*10, Math.sin(angle)*10);
    this.shotCount += 1;
    this.sound.play('shot');
    this.bulletPresent = true
  }
  //shootSquirrel(bullet, squirrel){
    //squirrel.disableBody(true, true);
    //this.squirrels.remove(squirrel);
    //this.sound.play('squirreldeath');
  //}
  //shootPlayer(bullet, player){
    //this.player.disableBody(true, true);
    //this.cannon.disableBody(true, true);
    //this.scene.start('Section1End', {
      //currentLevel: this.currentLevel,
      //shotCount: 100,
      //threeStar: this.threeStar,
      //twoStar: this.twoStar,
      //oneStar: this.oneStar,
      //backgroundX: this.background.tilePositionX,
      //mountainsX: this.mountains.tilePositionX,
      //treesX: this.trees.tilePositionX,
      //tankerX: this.player.x
      //});
  //}
  //bulletAbsorb(bullet, object){
    //bullet.disableBody(true, true)
    //this.sound.play('bounce');
  //}
  bulletBounce(){
    this.bounceCount += 1;
    this.sound.play('bounce');
  }
}
