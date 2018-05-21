import { Scene } from 'phaser'

export default class PlayScene extends Scene {
  constructor() {
    super({ key: 'PlayScene' })
  }

  create() {
    // Set up the level, first by displaying each layer
    this.map = this.make.tilemap({ key: 'level1' });
    let tiles = this.map.addTilesetImage('colour_palette', 'colour_palette');
    let backgroundLayer = this.map.createStaticLayer('Background', tiles);
    this.platformLayer = this.map.createDynamicLayer('Platforms', tiles);
    this.platformLayer.setCollisionByExclusion([-1]);
    this.originalPlayerX = this.map.tileWidth;
    this.originalPlayerY = this.map.heightInPixels - (this.map.tileHeight * 2);

    // Create the player
    this.player = this.physics.add.sprite(
      this.originalPlayerX,
      this.originalPlayerY,
      'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.lavaLayer = this.map.createDynamicLayer('Lava', tiles);
    this.lavaLayer.setTileIndexCallback(2, () => this.playerDies());

    // We need to scale the world in the physics engine
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.physics.add.collider(this.player, this.platformLayer);
    this.physics.add.overlap(this.player, this.lavaLayer);
    // Set the bounds on the camera as well
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.playerDieTween = {
      targets: this.player,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 10,
    };

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
    if ((this.cursors.space.isDown) && this.player.body.onFloor()) {
      this.player.body.setVelocityY(-350);
    }
  }

  checkContains(sprite1, sprite2) {
    let bounds1 = sprite1.getBounds();
    let bounds2 = sprite2.getBounds();
    return Phaser.Geom.Rectangle.Contains(bounds1, bounds2);
  }

  playerDies() {
    this.player.setVelocity(0, 0);
    this.player.x = this.originalPlayerX;
    this.player.y = this.originalPlayerY;
    this.player.setAlpha(0);
    let tw = this.tweens.add(this.playerDieTween);
  }
}
