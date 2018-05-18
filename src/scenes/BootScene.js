import { Scene } from 'phaser'
import logo from '../assets/logo.png'
import colour_palette from '../assets/tileset/colour_palette.png'
import level1 from '../assets/tilemaps/level1.json'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('logo', logo)
    this.load.image('colour_palette', colour_palette);
	  this.load.tilemapTiledJSON('level1', level1);
  }

  create () {
    this.scene.start('PlayScene')
  }
}
