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

    initAnimations() {
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('playerRight', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Dodaj inne animacje gracza tutaj
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

        // Dodaj logikę animacji gracza tutaj
    }
}