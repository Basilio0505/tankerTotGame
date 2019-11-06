<<<<<<< HEAD
=======
/*global Phaser*/

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    //arcade: {
        //gravity: { y: 200 },
        //debug: true
    //},
    matter: {
      debug: false,
      gravity: {y: 0.5}
    }
  },
pixelArt: true
};
>>>>>>> development
