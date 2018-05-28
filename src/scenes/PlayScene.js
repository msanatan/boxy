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
    this.lavaLayer = this.map.createDynamicLayer('Lava', tiles);
    this.lavaLayer.setTileIndexCallback(2, () => this.playerDies());

    this.originalPlayerX = this.map.tileWidth;
    this.originalPlayerY = this.map.heightInPixels - (this.map.tileHeight * 2);

    // Create the player
    this.player = this.physics.add.sprite(
      this.originalPlayerX,
      this.originalPlayerY,
      'player');
    this.player.setBounce(0.175);
    this.player.setCollideWorldBounds(true);

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

    this.collidingBlocks = this.physics.add.staticGroup();
    this.createFromObjects(this.map, 'Moving Boxes', this.collidingBlocks);

    let box1Tween = this.tweens.timeline({
      targets: this.collidingBlocks.getChildren()[1],
      loop: -1,
      tweens: [
        {
          x: 200,
          ease: 'Linear',
          duration: 3000,
          yoyo: true,
        },
      ]
    });

    let box2Tween = this.tweens.timeline({
      targets: this.collidingBlocks.getChildren()[0],
      loop: -1,
      tweens: [
        {
          x: 700,
          ease: 'Power2',
          duration: 2000,
          yoyo: true,
        },
      ]
    });

    let box3Tween = this.tweens.timeline({
      targets: this.collidingBlocks.getChildren()[2],
      loop: -1,
      tweens: [
        {
          y: 315,
          ease: 'Linear',
          duration: 600,
          yoyo: true,
        },
      ]
    });

    let box4Tween = this.tweens.timeline({
      targets: this.collidingBlocks.getChildren()[3],
      loop: -1,
      tweens: [
        {
          y: 55,
          ease: 'Linear',
          duration: 600,
          yoyo: true,
        },
      ]
    });
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

  playerDies() {
    this.player.setVelocity(0, 0);
    this.player.x = this.originalPlayerX;
    this.player.y = this.originalPlayerY;
    this.player.setAlpha(0);
    let tw = this.tweens.add(this.playerDieTween);
  }

  // Loosely based on https://github.com/photonstorm/phaser-ce/blob/v2.10.5/src/tilemap/Tilemap.js#L379
  createFromObjects(map, name, group) {
    let objectLayers = map.objects;
    objectLayers.forEach((ol) => {
      if (ol.name == name) {
        ol.objects.forEach((olObject) => {
          let obj = group.create(olObject.x, olObject.y, 'player');
          group.add(obj);
        });
      }
    });
  }
}
