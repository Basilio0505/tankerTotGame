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
<<<<<<< HEAD
      debug: false,
=======
      //debug: true,
>>>>>>> 13dd6f778cb369c969d69d0fbbfac036536d2252
      gravity: {y: 0.5}
    }
  },
pixelArt: true
};
