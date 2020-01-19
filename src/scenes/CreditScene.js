/*global Phaser*/
export default class CreditScene extends Phaser.Scene {
  constructor () {
    super('Credits');
  }

  init (data) {

  }

  preload () {

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }

  create (data) {
    this.registry.set('selfHit', false)
    //Create the scene
    //Background Color
    this.cameras.main.setBackgroundColor(0xb8b8b8);


    var title = this.add.image(this.centerX, this.centerY-250, 'title').setScale(.5);

    var creditTitleText = this.add.text( this.centerX-55, this.centerY-200, 'Credits', { fontSize: '30px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    //var basilioText = this.add.text( this.centerX-55, this.centerY-200, 'Credits', { fontSize: '30px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    var back = this.add.sprite(this.centerX,this.centerY+250,'back',0).setInteractive().setScale(5);
    back.on("pointerover", function(){this.setFrame(1);});
    back.on("pointerout", function(){this.setFrame(0);});
    back.on("pointerup", function(){this.scene.start("Title")}, this);

  }

  update (time, delta) {
    // Update the scene

  }
}
