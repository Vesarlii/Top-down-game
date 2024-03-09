class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.npcImage = null;
        this.npcImage2=null;
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
        this.load.image('tilesapple', 'images/map/applehouse.png', { image: { compression: 'none' } });
        this.load.tilemapTiledJSON("map", "images/map/map1.json", undefined, Phaser.Tilemaps.TILED_JSON, { compression: 'none' });
    
        // Wczytywanie obrazków dla gnomow
        this.load.spritesheet('npcIdle', 'images/npc/gnom/gnomidle.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('npcImage', 'images/npc/gnom/gnom.png', { frameWidth: 60, frameHeight: 80 });
        this.load.spritesheet('npc2', 'images/npc/girls/girls.png', { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet('npcImage2', 'images/npc/girls/dzieciobraz.png', { frameWidth: 79, frameHeight: 67 });
        
        // Wczytywanie obrazków dla stworzonek
        this.load.spritesheet('rock', 'images/creatures/rock/start/rock.png', { frameWidth: 32, frameHeight: 32 });
        console.log("Preload completed.");
        this.load.image('piwnica', 'images/map/piwnica.png', { image: { compression: 'none' } });
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

        const tilesapple = map.addTilesetImage("apples", "tilesapple");
        console.log("Tileset 'trees' loaded");
    
        let layer0 = map.createLayer("0", tileset, 0, 0).setScale(2);
        console.log("Layer '0' loaded");
    
        let layer1 = map.createLayer("1", tileset, 0, 0).setScale(2);
        console.log("Layer '1' loaded");
    
        let layer2 = map.createLayer("2", tileset, 0, 0).setScale(2);
        console.log("Layer '2' loaded");
       
        let layer3 = map.createLayer("3", tileset, 0, 0).setScale(2);
        console.log("Layer '3' loaded");
    
        this.layer4 = map.createLayer("4", [tileset, tilesettrees, tilesapple], 0, 0).setScale(2);
        console.log("Layer '4' loaded");
        
        this.layer4.setDepth(2);
    
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels * 2);
    
        this.player = this.physics.add.sprite(200, 1300, 'playerRight').setScale(2);
        this.player.setDepth(2);

        this.npc = this.physics.add.sprite(1024, 512, 'npcIdle').setScale(2);
        this.npc.setDepth(1);
        this.npc2 = this.physics.add.sprite(2800, 500, 'npc2').setScale(1.5);
        this.npc2.setDepth(1);
        this.rock = this.physics.add.sprite(1524, 2200, 'rock').setScale(2);
        this.rock.setDepth(1);
    
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBackgroundColor('#ffffff');
    
        this.physics.world.enable(this.player);
        this.physics.world.enable(this.npc);
        this.physics.world.enable(this.npc2);
        this.physics.world.enable(this.rock);

        this.physics.add.collider(this.npc, layer0);
        this.npc.setInteractive();
        this.npc2.setInteractive();

        this.npc._oldPosition = { x: 1024, y: 512 };
        this.npc2._oldPosition = { x: 2800, y: 500 };
        this.rock._oldPosition = { x: 1524, y: 2200 };

        this.physics.add.collider(this.player, this.npc, (player, npc) => {
            player.setX(player._oldPosition.x);
            player.setY(player._oldPosition.y);

            npc.setVelocity(0, 0);

            npc.setX(npc._oldPosition.x);
            npc.setY(npc._oldPosition.y);
        });

        this.physics.add.collider(this.player, this.npc2, (player, npc2) => {
            player.setX(player._oldPosition.x);
            player.setY(player._oldPosition.y);

            npc2.setVelocity(0, 0);

            npc2.setX(npc2._oldPosition.x);
            npc2.setY(npc2._oldPosition.y);
        });

        this.physics.add.collider(this.player, this.rock, (player, rock) => {
            player.setX(player._oldPosition.x);
            player.setY(player._oldPosition.y);

            rock.setVelocity(0, 0);

            rock.setX(rock._oldPosition.x);
            rock.setY(rock._oldPosition.y);
        });

        this.physics.add.collider(this.player, this.layer4);

        this.piwnica = this.physics.add.image(400, 400, 'piwnica').setScale(2); // Dostosuj współrzędne i skalę
        this.piwnica.setAlpha(0);

        this.input.keyboard.on('keydown-E', () => {
  
            if (this.npcImage) {
             
                this.npcImage.destroy();
                this.npcImage = null; 
                this.playerCanMove = true; 
            } else {
                const interactionDistance = 170; 
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    
                if (distance <= interactionDistance) {

                    const npcImageX = this.cameras.main.centerX - this.cameras.main.width / 2;
                    const npcImageY = this.cameras.main.height - 145;
                    this.npcImage = this.add.sprite(npcImageX, npcImageY, 'npcImage', 0);
                    this.npcImage.setScale(3); 
                    this.npcImage.setDepth(3);
                    this.playerCanMove = false; 
                }
            }
        });

        this.input.keyboard.on('keydown-E', () => {

            if (this.npcImage2) {

                this.npcImage2.destroy();
                this.npcImage2 = null;
            } else {
                const interactionDistance = 170; 
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc2.x, this.npc2.y);

                if (distance <= interactionDistance) {
                   
                    this.npcImage2 = this.add.sprite(160, this.sys.game.config.height - 145, 'npcImage2', 0);
                    this.npcImage2.setScale(3); 
                    this.npcImage2.setDepth(3);
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

        this.anims.create({
            key: 'npc2',
            frames: this.anims.generateFrameNumbers('npc2', { start: 0, end: 9 }),
            frameRate: 7,
            repeat: -1
        });
        this.npc2.anims.play('npc2', true);

        this.anims.create({
            key: 'rock',
            frames: this.anims.generateFrameNumbers('rock', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: 0,
            yoyo: true,
        });

        this.layer4.forEachTile(tile => {
            if (tile.index !== -1) {

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
        const speed = 400;
        const piwnica = new Phaser.Math.Vector2(400, 400);
    
        let playerCanMoveToNPC1 = true;
        let playerCanMoveToNPC2 = true;
    
        if (this.npcImage) {
            playerCanMoveToNPC1 = false;
            const npcImageX = this.cameras.main.worldView.x + 60;
            const npcImageY = this.cameras.main.worldView.y + window.innerHeight - 145;
            this.npcImage.setPosition(npcImageX, npcImageY);
        } else {
            playerCanMoveToNPC1 = true;
        }
    
        if (this.npcImage2) {
            playerCanMoveToNPC2 = false;
            const npcImage2X = this.cameras.main.worldView.x + 90;
            const npcImage2Y = this.cameras.main.worldView.y + window.innerHeight - 120;
            this.npcImage2.setPosition(npcImage2X, npcImage2Y);
        } else {
            playerCanMoveToNPC2 = true;
        }
    
        const isEKeyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).isDown;
    
        if (isEKeyDown) {
            const interactionDistanceNPC1 = 170;
            const distanceNPC1 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    
            if (distanceNPC1 <= interactionDistanceNPC1) {
                console.log("Gracz wszedł w interakcję z NPC1!");
                playerCanMoveToNPC1 = false;

                
            }
    
            const interactionDistanceNPC2 = 170;
            const distanceNPC2 = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc2.x, this.npc2.y);
    
            if (distanceNPC2 <= interactionDistanceNPC2) {
                console.log("Gracz wszedł w interakcję z NPC2!");
                playerCanMoveToNPC2 = false;
            }


        }



        const distanceToTarget = Phaser.Math.Distance.Between(this.player.x, this.player.y, piwnica.x, piwnica.y);

        if (distanceToTarget <= 50) {
            console.log("Gracz osiągnął współrzędne, przejście do nowej sceny");
            this.scene.start('Scene2');
        }

        const interactionDistanceROCK = 170;
        const distanceROCK = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.rock.x, this.rock.y);

        if (distanceROCK <= interactionDistanceROCK) {
            console.log("Gracz wszedł w interakcję ze skałą!");
            this.rock.anims.play('rock', true);
        }
    
        if (playerCanMoveToNPC1 & playerCanMoveToNPC2) {
            const isLeftKeyDown = this.cursors.left.isDown;
            const isRightKeyDown = this.cursors.right.isDown;
            const isUpKeyDown = this.cursors.up.isDown;
            const isDownKeyDown = this.cursors.down.isDown;
    

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
            this.player.setVelocity(0, 0);
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
        this.npc._oldPosition = { x: 1024, y: 512 };
        this.npc2._oldPosition = { x: 2800, y: 500 };
        
        this.player._oldPosition = { x: this.player.x, y: this.player.y };



        
    }}