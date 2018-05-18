import { Scene } from 'phaser'

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
  }

  create () {
    this.map = this.make.tilemap({key: 'level1'});
    let tiles = this.map.addTilesetImage('colour_palette', 'colour_palette');
    let backgroundLayer = this.map.createStaticLayer('Background', tiles, 0, 0);
    this.platformLayer = this .map.createDynamicLayer('Platforms', tiles, 0, 0);
    this.platformLayer.setCollisionByProperty({ collides: true });
  }
}
