class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {
        console.log("Preload method is being called.");
    
        this.load.spritesheet('playerRight', 'images/spritesheets/right.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerFront', 'images/spritesheets/front.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerBack', 'images/spritesheets/back.png', { frameWidth: 86, frameHeight: 62 });

        
        this.load.image('mapImage', 'images/map/map01.png');
        this.load.image('itemsImage', 'images/map/items01.png');
    }

    create() {
        console.log("Create method is being called."); 
        const gameWidth = window.innerWidth;
        const gameHeight = window.innerHeight;

        
        this.add.image(0, 0, 'mapImage').setOrigin(0);

        this.player = this.physics.add.sprite(gameWidth / 2, gameHeight / 2, 'playerRight');
        this.player.setCollideWorldBounds(true);

        
        const itemsLayer = this.add.image(0, 0, 'itemsImage').setOrigin(0);
        
        
        this.physics.add.collider(this.player, itemsLayer, (player, item) => {
            
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.prevKeyState = { left: false, right: false, up: false, down: false };

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

        this.cameras.main.setBackgroundColor('#ffffff'); 
    }

    update() {
        const speed = 200;

        this.player.setVelocity(0, 0);

        const wasLeftKeyDown = this.prevKeyState.left;
        const wasRightKeyDown = this.prevKeyState.right;
        const wasUpKeyDown = this.prevKeyState.up;
        const wasDownKeyDown = this.prevKeyState.down;

        const isLeftKeyDown = this.cursors.left.isDown;
        const isRightKeyDown = this.cursors.right.isDown;
        const isUpKeyDown = this.cursors.up.isDown;
        const isDownKeyDown = this.cursors.down.isDown;

        this.prevKeyState = { left: isLeftKeyDown, right: isRightKeyDown, up: isUpKeyDown, down: isDownKeyDown };

        if (isLeftKeyDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('right', true);
            this.player.flipX = true;
        } else if (isRightKeyDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }

        if (isUpKeyDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('back', true);
        } else if (isDownKeyDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play('front', true);
        }

        if (wasLeftKeyDown && !isLeftKeyDown || wasRightKeyDown && !isRightKeyDown) {
            this.player.anims.stop('right');
        }

        if (wasUpKeyDown && !isUpKeyDown || wasDownKeyDown && !isDownKeyDown) {
            this.player.anims.stop(['back', 'front']);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Scene1]
};

const game = new Phaser.Game(config);
