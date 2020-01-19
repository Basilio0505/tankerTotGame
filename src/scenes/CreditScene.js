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

    var creditTitleText = this.add.text( this.centerX-55, this.centerY-200, 'Credits', { fontSize: '30px', fill: '#000', stroke: '#000', strokeThickness: 3 });
    var inspirationText = this.add.text(this.centerX-180, this.centerY-160, 'A game based on Jason Harron\'s dog taterTot', { fontSize: '15px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    var alexText = this.add.text( this.centerX-160, this.centerY-110, 'Alex Ayala - Art, Programming', { fontSize: '20px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var basilioText = this.add.text( this.centerX-260, this.centerY-80, 'Basilio Bazan III - Game Design, Programming', { fontSize: '20px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var millsText = this.add.text( this.centerX-300, this.centerY-50, 'John Mills LeMaire - Art, Sound Design, Programming', { fontSize: '20px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var topracText = this.add.text( this.centerX-140, this.centerY-20, 'Dr. Paul Toprac - Producer', { fontSize: '20px', fill: '#000', stroke: '#000', strokeThickness: 2 });
    var jasonText = this.add.text( this.centerX-190, this.centerY+10, 'Jason Harron - Assistant Producer', { fontSize: '20px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    var phaserText = this.add.text( this.centerX-70, this.centerY+180, 'Made in Phaser 3', { fontSize: '15px', fill: '#000', stroke: '#000', strokeThickness: 2 });

    var back = this.add.sprite(this.centerX,this.centerY+250,'back',0).setInteractive().setScale(5);
    back.on("pointerover", function(){this.setFrame(1);});
    back.on("pointerout", function(){this.setFrame(0);});
    back.on("pointerup", function(){this.scene.start("Title")}, this);

  }

  update (time, delta) {
    // Update the scene

  }
}
