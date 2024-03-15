export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerRight');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Inicjalizacja animacji gracza
        this.initAnimations();

        // Inicjalizacja pozycji gracza
        this.initPosition(x, y);
    }
    preload() {
        // Wczytywanie spritesheets dla gracza
        this.scene.load.spritesheet('playerRight', 'images/spritesheets/right.png', { frameWidth: 86, frameHeight: 62 });
        this.scene.load.spritesheet('playerFront', 'images/spritesheets/front.png', { frameWidth: 86, frameHeight: 62 });
        this.scene.load.spritesheet('playerBack', 'images/spritesheets/back.png', { frameWidth: 86, frameHeight: 62 });
    }
    
    initAnimations() {
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('playerRight', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'front',
            frames: this.anims.generateFrameNumbers('playerFront', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'back',
            frames: this.anims.generateFrameNumbers('playerBack', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

    }

    initPosition(x, y) {
        this.setPosition(x, y);
        this._oldPosition = { x: x, y: y };
    }

    update(cursors) {
        const speed = 400;

        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.setVelocityY(0);
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.setVelocityY(0);
        } else if (cursors.up.isDown) {
            this.setVelocityY(-speed);
            this.setVelocityX(0);
        } else if (cursors.down.isDown) {
            this.setVelocityY(speed);
            this.setVelocityX(0);
        } else {
            this.setVelocity(0, 0);
        }

        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            if (Math.abs(this.player.body.velocity.x) > Math.abs(this.player.body.velocity.y)) {
                if (this.player.body.velocity.x < 0) {
                    this.player.anims.play('right', true);
                    this.player.flipX = true;
                } else {
                    this.player.anims.play('right', true);
                    this.player.flipX = false;
                }
            } else {
                if (this.player.body.velocity.y < 0) {
                    this.player.anims.play('back', true);
                } else {
                    this.player.anims.play('front', true);
                }
            }
        } else {
            this.player.anims.stop(['back', 'front', 'right']);
        }


    }
}