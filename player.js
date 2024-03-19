// class Player extends Phaser.Physics.Arcade.Sprite {
//     constructor(scene, x, y) {
//         super(scene, x, y, 'playerRight');
//         scene.add.existing(this);
//         scene.physics.add.existing(this);

//         // Inicjalizacja animacji gracza
//         this.initAnimations();

//         // Inicjalizacja pozycji gracza
//         this.initPosition(x, y);
//     }

//     initAnimations() {
//         this.anims.create({
//             key: 'right',
//             frames: this.anims.generateFrameNumbers('playerRight', { start: 0, end: 5 }),
//             frameRate: 10,
//             repeat: -1
//         });
    
//         this.anims.create({
//             key: 'front',
//             frames: this.anims.generateFrameNumbers('playerFront', { start: 0, end: 7 }),
//             frameRate: 10,
//             repeat: -1
//         });
    
//         this.anims.create({
//             key: 'back',
//             frames: this.anims.generateFrameNumbers('playerBack', { start: 0, end: 7 }),
//             frameRate: 10,
//             repeat: -1
//         });
//     }

//     initPosition(x, y) {
//         this.setPosition(x, y);
//         this._oldPosition = { x: x, y: y };
//     }

//     update(cursors) {
//         const speed = 400;

//         if (cursors.left.isDown) {
//             this.setVelocityX(-speed);
//             this.setVelocityY(0);
//         } else if (cursors.right.isDown) {
//             this.setVelocityX(speed);
//             this.setVelocityY(0);
//         } else if (cursors.up.isDown) {
//             this.setVelocityY(-speed);
//             this.setVelocityX(0);
//         } else if (cursors.down.isDown) {
//             this.setVelocityY(speed);
//             this.setVelocityX(0);
//         } else {
//             this.setVelocity(0, 0);
//         }

//         if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
//             if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
//                 if (this.body.velocity.x < 0) {
//                     this.anims.play('right', true);
//                     this.flipX = true;
//                 } else {
//                     this.anims.play('right', true);
//                     this.flipX = false;
//                 }
//             } else {
//                 if (this.body.velocity.y < 0) {
//                     this.anims.play('back', true);
//                 } else {
//                     this.anims.play('front', true);
//                 }
//             }
//         } else {
//             this.anims.stop(['back', 'front', 'right']);
//         }
//     }
// }
