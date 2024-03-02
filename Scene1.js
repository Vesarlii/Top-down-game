class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {
        console.log("Preload method is being called.");
    
        this.load.spritesheet('playerRight', 'images/spritesheets/right.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerFront', 'images/spritesheets/front.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerBack', 'images/spritesheets/back.png', { frameWidth: 86, frameHeight: 62 });

        this.load.image('tiles', 'images/map/ground.png', { image: { compression: 'none' } });
        this.load.image('tilestrees', 'images/map/treeset.png', { image: { compression: 'none' } });
        this.load.tilemapTiledJSON("map", "images/map/map1.json", undefined, Phaser.Tilemaps.TILED_JSON, { compression: 'none' });
    }

    create() {

        console.log("Create method is being called."); 
        const gameWidth = window.innerWidth;
        const gameHeight = window.innerHeight;

        
    
        const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage("ground", "tiles");
        console.log("Tileset 'ground' loaded");
    
        const tilesettrees = map.addTilesetImage("trees", "tilestrees");
        console.log("Tileset 'trees' loaded");
    
        let layer0 = map.createLayer("bot", tileset, 0, 0).setScale(2);
        console.log("Layer 'bot' loaded");
    
        this.layer1 = map.createLayer("mid", tileset, 0, 0).setScale(2);
        console.log("Layer 'mid' loaded");
    
        this.layer2 = map.createLayer("mid-top", tileset, 0, 0).setScale(2);
        console.log("Layer 'mid-top' loaded");
    
        this.layer3 = map.createLayer("top", [tileset, tilesettrees], 0, 0).setScale(2);
        console.log("Layer 'top' loaded");
    
        // Debugowanie fizyki
        this.physics.world.enable(layer0);
        layer0.setCollisionByExclusion([-1]);

        /*this.layer0.setAntialias(true);
        this.layer1.setAntialias(true);
        this.layer2.setAntialias(true);
        this.layer3.setAntialias(true);*/
        
    
        this.player = this.physics.add.sprite(gameWidth / 4, gameHeight / 2, 'playerRight').setScale(2);
        //this.player.setCollideWorldBounds(true);
        this.player.setDepth(1);
        //this.layer3.setDepth(2);
        


        this.cameras.main.startFollow(this.player);
        


        this.cameras.main.setBackgroundColor('#ffffff');
    
        this.physics.world.enable(this.player);
        this.player.body.setImmovable(false);
        
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
        const speed = 5;
    
        if (!this.player) {
            return;
        }
    
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
    
        // Sprawdź kolizję z warstwą "top" tylko jeśli gracz się porusza
        if (isLeftKeyDown || isRightKeyDown || isUpKeyDown || isDownKeyDown) {
            // Sprawdź kolizję z warstwą "top"
            this.physics.world.overlap(this.player, this.layer3, (player, tile) => {
                if (tile.index !== -1) {
                    console.log("Kolizja z kafelkiem o indeksie:", tile.index);
                    player.body.setVelocity(0);
                }
            });
    
            // Sprawdź kolizję z warstwą "top" przy aktualnej pozycji docelowej gracza
            const nextX = this.player.x + (isLeftKeyDown ? -speed : isRightKeyDown ? speed : 0);
            const nextY = this.player.y + (isUpKeyDown ? -speed : isDownKeyDown ? speed : 0);
    
            if (!this.layer3.getTileAtWorldXY(nextX, nextY) || this.layer3.getTileAtWorldXY(nextX, nextY).index === -1) {
                // Gracz może przemieścić się na następną pozycję
                this.player.x = nextX;
                this.player.y = nextY;
            }
        }
    
        if (isLeftKeyDown) {
            this.player.anims.play('right', true);
            this.player.flipX = true;
        } else if (isRightKeyDown) {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
    
        if (isUpKeyDown) {
            this.player.anims.play('back', true);
        } else if (isDownKeyDown) {
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
