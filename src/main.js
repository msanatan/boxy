import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  scene: [BootScene, PlayScene],
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 500 },
        debug: false
    }
  },
  audio: {
    disableWebAudio: true
  },
}

const game = new Phaser.Game(config)
window.game = game
