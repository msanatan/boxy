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

    this.collidingBlocks = this.physics.add.group({
      immovable: true
    });
    this.createFromObjects(this.map, 'Moving Boxes', this.collidingBlocks, false, true);
    this.physics.add.collider(this.player, this.collidingBlocks, this.playerDies, null, this);
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

    // First box encountered
    let firstBox = this.collidingBlocks.getChildren()[1];
    if (firstBox.body.x >= 610) {
      firstBox.body.setVelocityX(-300);
    } else if (firstBox.body.x <= 200) {
      firstBox.body.setVelocityX(350);
    }

    // Second box encountered
    let secondBox = this.collidingBlocks.getChildren()[0];
    if (secondBox.body.x <= 15) {
      secondBox.body.setVelocityX(300);
    } else if (secondBox.body.x >= 550) {
      secondBox.body.setVelocityX(-300);
    }

    // Third box encountered
    let thirdBox = this.collidingBlocks.getChildren()[2];
    if (thirdBox.body.y <= 40) {
      thirdBox.body.setVelocityY(300);
    } else if (thirdBox.body.y >= 290) {
      thirdBox.body.setVelocityY(-250);
    }

    // Fourth box encountered
    let fourthBox = this.collidingBlocks.getChildren()[3];
    if (fourthBox.body.y <= 40) {
      fourthBox.body.setVelocityY(300);
    } else if (fourthBox.body.y >= 290) {
      fourthBox.body.setVelocityY(-300);
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
  createFromObjects(map, name, group, gravity, immovable) {
    let objectLayers = map.objects;
    objectLayers.forEach((ol) => {
      if (ol.name == name) {
        ol.objects.forEach((olObject) => {
          let obj = group.create(olObject.x, olObject.y, 'player');
          obj.body.allowGravity = gravity;
          obj.body.immovable = immovable;
          group.add(obj);
        });
      }
    });
  }
}
