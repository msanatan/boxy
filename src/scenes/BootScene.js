  import { Scene } from 'phaser'
  import colourPalette from '../assets/tileset/colour_palette.png'
  import level1 from '../assets/tilemaps/level1.json'
  import player from '../assets/player.png'
  import playerDieSfxOgg from '../assets/audio/sfx_sounds_negative1.ogg'
  import playerDieSfxMp3 from '../assets/audio/sfx_sounds_negative1.mp3'
  import llpixel3Png from '../assets/font/llpixel3.png'
  import llpixel3Xml from '../assets/font/llpixel3.xml'

  export default class BootScene extends Scene {
    constructor () {
      super({ key: 'BootScene' })
    }

    preload () {
      this.load.image('player', player);
      this.load.spritesheet('colourPalette', colourPalette, {frameWidth: 35, frameHeight: 35});
      this.load.audio('playerDiesSfx', [playerDieSfxOgg, playerDieSfxMp3]);
      this.load.bitmapFont('llpixel3', llpixel3Png, llpixel3Xml);
      this.load.tilemapTiledJSON('level1', level1);
    }

    create () {
      this.scene.start('PlayScene')
    }
  }
