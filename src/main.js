import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 700,
  height: 770,
  pixelArt: true,
  scene: [BootScene, PlayScene],
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 500 }, // will affect our player sprite
        debug: false // change if you need
    }
  },
}

const game = new Phaser.Game(config)
window.game = game
