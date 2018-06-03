import { Scene } from 'phaser'
import colourPalette from '../assets/tileset/colour_palette.png'
import level1 from '../assets/tilemaps/level1.json'
import player from '../assets/player.png'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('player', player);
    this.load.spritesheet('colourPalette', colourPalette, {frameWidth: 35, frameHeight: 35});
    this.load.tilemapTiledJSON('level1', level1);
  }

  create () {
    this.scene.start('PlayScene')
  }
}
