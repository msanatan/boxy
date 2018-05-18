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
    this.platformLayer.setCollisionByExclusion([ -1 ]);
    this.player = this.physics.add.sprite(35, 500, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platformLayer);
  }
}
