import { Scene } from 'phaser'

export default class PlayScene extends Scene {
  constructor() {
    super({ key: 'PlayScene' })
  }

  create() {
    // Set up the level, first by displaying each layer
    this.map = this.make.tilemap({ key: 'level1' });
    let tiles = this.map.addTilesetImage('colour_palette', 'colour_palette');
    let backgroundLayer = this.map.createStaticLayer('Background', tiles, 0, 0);
    this.platformLayer = this.map.createDynamicLayer('Platforms', tiles, 0, 0);
    this.platformLayer.setCollisionByExclusion([-1]);
    this.lavaLayer = this.map.createDynamicLayer('Lava', tiles, 0, 0);

    // Scale the layers to the screen's dimensions
    backgroundLayer.setScale(this.sys.game.config.width / this.map.widthInPixels, 1);
    this.platformLayer.setScale(this.sys.game.config.width / this.map.widthInPixels, 1);
    this.lavaLayer.setScale(this.sys.game.config.width / this.map.widthInPixels, 1);

    // Create the player
    this.player = this.physics.add.sprite(
      this.map.tileWidth,
      this.map.heightInPixels - (this.map.tileHeight * 2),
      'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Find the real bounds of the screen
    let scaledWidth = this.platformLayer.width * this.platformLayer.scaleX;
    let scaledHeight = this.platformLayer.height * this.platformLayer.scaleY;
    // We need to scale the world in the physics engine
    this.physics.world.bounds.width = scaledWidth;
    this.physics.world.bounds.height = scaledHeight;
    this.physics.add.collider(this.player, this.platformLayer);
    // Set the bounds on the camera as well
    this.cameras.main.setBounds(0, 0, scaledWidth, scaledHeight);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    // Moving left and right
    this.player.setVelocityX(0);
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(200);
    }

    // Jumping
    if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
      this.player.body.setVelocityY(-350);
    }
  }
}
