class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.npcImage = null;
        this.playerCanMove = true; 
    }

    preload() {
        console.log("Preload method is being called.");
    
        // Wczytywanie obrazków dla gracza
        this.load.spritesheet('playerRight', 'images/spritesheets/right.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerFront', 'images/spritesheets/front.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerBack', 'images/spritesheets/back.png', { frameWidth: 86, frameHeight: 62 });
    
        // Wczytywanie obrazków dla mapy
        this.load.image('tiles', 'images/map/ground.png', { image: { compression: 'none' } });
        this.load.image('tilestrees', 'images/map/treeset.png', { image: { compression: 'none' } });
        this.load.tilemapTiledJSON("map", "images/map/map1.json", undefined, Phaser.Tilemaps.TILED_JSON, { compression: 'none' });
    
        // Wczytywanie obrazków dla gnoma
        this.load.spritesheet('npcIdle', 'images/npc/gnom/gnomidle.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('npcImage', 'images/npc/gnom/gnom.png', { frameWidth: 60, frameHeight: 80 });
    
        console.log("Preload completed.");
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
    
        let layer1 = map.createLayer("mid", tileset, 0, 0).setScale(2);
        console.log("Layer 'mid' loaded");
    
        let layer2 = map.createLayer("mid-top", tileset, 0, 0).setScale(2);
        console.log("Layer 'mid-top' loaded");
    
        this.layer3 = map.createLayer("top", [tileset, tilesettrees], 0, 0).setScale(2);
        console.log("Layer 'top' loaded");
        
        this.layer3.setDepth(2);
    
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels * 2);
    
        this.player = this.physics.add.sprite(90, 1152, 'playerRight').setScale(2);
        this.player.setDepth(2);

        this.npc = this.physics.add.sprite(1024, 512, 'npcIdle').setScale(2);
        this.npc.setDepth(1);
    
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBackgroundColor('#ffffff');
    
        this.physics.world.enable(this.player);
        this.physics.world.enable(this.npc);

        this.physics.add.collider(this.npc, layer0);
        this.npc.setInteractive();

        this.npc._oldPosition = { x: 1024, y: 512 };

        this.physics.add.collider(this.player, this.npc, (player, npc) => {
            // Jeżeli wystąpi kolizja, przywróć gracza na poprzednią pozycję
            player.setX(player._oldPosition.x);
            player.setY(player._oldPosition.y);

            npc.setVelocity(0, 0);

            npc.setX(npc._oldPosition.x);
            npc.setY(npc._oldPosition.y);
        });

        this.physics.add.collider(this.player, this.layer3);

        this.input.keyboard.on('keydown-E', () => {
            // Sprawdź, czy obrazek NPC jest już widoczny
            if (this.npcImage) {
                // Usuń obrazek NPC z dołu ekranu
                this.npcImage.destroy();
                this.npcImage = null; // Ustaw zmienną na null, aby wskazywać, że obrazek jest niewidoczny
            } else {
                const interactionDistance = 170; // Dostosuj do swoich potrzeb
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);

                if (distance <= interactionDistance) {
                    // Gracz jest w odległości interakcji od NPC
                    // Dodaj obrazek NPC na dole ekranu po lewej stronie
                    this.npcImage = this.add.sprite(160, this.sys.game.config.height - 145, 'npcImage', 0);
                    this.npcImage.setScale(3); // Dostosuj do swoich potrzeb
                }
            }
        });

        this.player.body.setImmovable(false);
        this.player._oldPosition = { x: this.player.x, y: this.player.y };
    
        
        this.player.body.setSize(this.player.width - 40, this.player.height - 35, true).setOffset(20, 35);
        this.npc.body.setSize(32, 64, true);


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

        //NPC animacja

        this.anims.create({
            key: 'npcIdle',
            frames: this.anims.generateFrameNumbers('npcIdle', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.npc.anims.play('npcIdle', true);

        this.layer3.forEachTile(tile => {
            // Sprawdź, czy index kafelka nie wynosi -1 (lub dowolnej innej wartości, jeśli to, co chcesz)
            if (tile.index !== -1) {
                // Ustaw kolizję dla kafelka
                tile.setCollision(true);
                tile.setCollisionCallback(() => {
                    console.log("Kolizja z kafelkiem o indeksie:", tile.index);
                    this.player.setX(this.player._oldPosition.x);
                    this.player.setY(this.player._oldPosition.y);
                });
            }
        });
    }
    



    update() {
        const speed = 200;
    
        if (this.playerCanMove) {
            const isLeftKeyDown = this.cursors.left.isDown;
            const isRightKeyDown = this.cursors.right.isDown;
            const isUpKeyDown = this.cursors.up.isDown;
            const isDownKeyDown = this.cursors.down.isDown;
    
            // Ustaw prędkość tylko w jednym kierunku jednocześnie
            if (isLeftKeyDown) {
                this.player.setVelocityX(-speed);
                this.player.setVelocityY(0);
            } else if (isRightKeyDown) {
                this.player.setVelocityX(speed);
                this.player.setVelocityY(0);
            } else if (isUpKeyDown) {
                this.player.setVelocityY(-speed);
                this.player.setVelocityX(0);
            } else if (isDownKeyDown) {
                this.player.setVelocityY(speed);
                this.player.setVelocityX(0);
            } else {
                // Brak naciśniętych klawiszy
                this.player.setVelocity(0, 0);
            }
    
            // Animacje
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
    
            // Aktualizuj poprzednią pozycję gracza
            this.player._oldPosition = { x: this.player.x, y: this.player.y };
        } else {
            // Gracz nie może się poruszać, ustaw prędkość na zero
            this.player.setVelocity(0, 0);
        }
    
        // Sprawdź, czy obrazek NPC jest już widoczny
        if (this.npcImage) {
            // Gracz nie może się poruszać, ustaw prędkość na zero
            this.playerCanMove = false;
    
            // Ustaw pozycję obrazka NPC na stałej odległości od dołu i od prawej strony ekranu
            const npcImageX = 160; // Dostosuj do swoich potrzeb
            const npcImageY = this.cameras.main.height - 145; // Dostosuj do swoich potrzeb
            this.npcImage.setPosition(npcImageX, npcImageY);
        } else {
            // Gracz może się poruszać
            this.playerCanMove = true;
        }

        // Animacje
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
        this.npc._oldPosition = { x: 1024, y: 512 };
        
        this.player._oldPosition = { x: this.player.x, y: this.player.y };


        const isEKeyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown;

        if (isEKeyDown) {
            const interactionDistance = 170; 
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    
            if (distance <= interactionDistance) {
                console.log("Gracz wszedł w interakcję z NPC!");
            }
        }

        
    }}