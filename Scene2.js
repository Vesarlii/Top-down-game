var player;

class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {
        console.log("Preload method in Scene2 is being called.");

        this.load.image('nowapiwnica', 'images/map/nowapiwnica.png', { image: { compression: 'none' } });
        this.load.image('itemy', 'images/map/beczki.png', { image: { compression: 'none' } });
        this.load.tilemapTiledJSON("map2", "images/map/piwnica2.json", undefined, Phaser.Tilemaps.TILED_JSON, { compression: 'none' });

        this.load.spritesheet('playerRight', 'images/spritesheets/right.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerFront', 'images/spritesheets/front.png', { frameWidth: 86, frameHeight: 62 });
        this.load.spritesheet('playerBack', 'images/spritesheets/back.png', { frameWidth: 86, frameHeight: 62 });

        this.load.spritesheet('rat', 'images/npc/rat/krolszczur.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('ratImage', 'images/npc/rat/head_rat.png', { image: { compression: 'none' } });
    }

    create() {
        console.log("Create method is being called.");
        const gameWidth = window.innerWidth;
        const gameHeight = window.innerHeight;

        const map2 = this.make.tilemap({ key: "map2", tileWidth: 16, tileHeight: 16 });
        const tileset2 = map2.addTilesetImage("nowapiwnica2", "nowapiwnica");
        console.log("Tileset 'nowapiwnica' loaded");
        const tileset3 = map2.addTilesetImage("beczki2", "itemy");
        console.log("Tileset 'itemy' loaded");

        let layer0 = map2.createLayer("0", tileset2, 0, 0).setScale(2);
        console.log("Layer '0' loaded");

        let layer2 = map2.createLayer("2", [tileset2, tileset3], 0, 0).setScale(2);
        console.log("Layer '2' loaded");

        let layer3 = map2.createLayer("3", [tileset2, tileset3], 0, 0).setScale(2);
        console.log("Layer '3' loaded");

        player = this.physics.add.existing(new Player(this, 150, 200)).setScale(2);
        this.physics.world.enable(player);

        this.rat = this.physics.add.sprite(720, 625, 'rat').setScale(2);
        this.rat.setDepth(1);
        this.physics.world.enable(this.rat);
        this.rat._oldPosition = { x: 720, y: 625 };

        this.anims.create({
            key: 'rat',
            frames: this.anims.generateFrameNumbers('rat', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1,
        });

        this.playerCanMove = true;

        this.rat.anims.play('rat', true);

        map2.layers.forEach(layer => {
            for (let y = 0; y < layer.data.length; y++) {
                for (let x = 0; x < layer.data[y].length; x++) {
                    const tile = layer.data[y][x];
                    if (tile.index !== -1 && tile.index !== 0) {
                        tile.setCollision(true);
                        tile.setCollisionCallback(() => {
                            console.log("Collision with tile index:", tile.index);
                            player.setVelocity(0);
                        });
                    }
                }
            }
        });

        
        this.physics.add.collider(player, layer2);
        this.physics.add.collider(player, layer3);
        this.rat.setInteractive();

        this.physics.add.collider(player, this.rat, (player, rat) => {
            player.setVelocity(0);
            
            rat.setVelocity(0, 0);
            
            rat.setX(rat._oldPosition.x);
            rat.setY(rat._oldPosition.y);
            player.setX(player._oldPosition.x);
            player.setY(player._oldPosition.y);
        });

        
        this.input.keyboard.on('keydown-E', () => {
            if (this.dialogBox && !this.optionChosen) {
                this.dialogBox.destroy();
                this.textNPC.destroy();
                this.option1.destroy();
                this.option2.destroy();
                this.playerCanMove = true;
        
                if (this.npcImage) {
                    this.npcImage.destroy();
                    this.npcImage = null;
                }
            } else {
                const interactionDistance = 170;
                const distance = Phaser.Math.Distance.Between(player.x, player.y, this.rat.x, this.rat.y);
        
                if (distance <= interactionDistance) {
                    if (!this.dialogBox || this.optionChosen) {
                        if (!this.npcImage) {
                            // Przesuń obrazek NPC w lewy dolny róg kamery
                            const cameraX = this.cameras.main.worldView.x + 100;
                            const cameraY = this.cameras.main.worldView.y + this.cameras.main.height - 100;
                            this.npcImage = this.add.image(cameraX + 30, cameraY - 30, 'ratImage').setScale(2).setDepth(3);
                        }
        
                        // Tworzenie czarnego tła półprzezroczystego
                        this.dialogBox = this.add.rectangle(this.cameras.main.width/2, this.cameras.main.height - 120, this.cameras.main.width - 400, 150, 0x000000, 0.7).setDepth(2);
                        
                        // Tekst NPC
                        this.textNPC = this.add.text(300, this.cameras.main.height - 170, "Cześć! Jestem królem szczurów, czego szukasz w moim królestwie?", { fontSize: '14px', fill: '#ffffff' }).setDepth(3);
                        
                        // Opcje dialogowe
                        this.option1 = this.add.text(300, this.cameras.main.height - 120, "Hałasy przeszkadzają niebieskiemu gnomowi, czy możecie zachowywać się ciszej, tu na dole?", { fontSize: '14px', fill: '#ffffff' }).setDepth(3);
                        this.option2 = this.add.text(300, this.cameras.main.height - 90, "Tylko tędy przechodzę", { fontSize: '14px', fill: '#ffffff' }).setDepth(3);
        
                        // Ustawienie interaktywności dla opcji
                        this.option1.setInteractive();
                        this.option1.on('pointerdown', () => {
                            this.textNPC.setText("Oczywiście! Za jedną kanapkę z serem tygodniowo, możemy organizować mniej huczne imprezy");
                            this.optionChosen = true;
                            this.option1.destroy();
                            this.option2.setText("Dzięki, przekażę dobre wieści niebieskiemu gnomowi!");
                        });
        
                        this.option2.setInteractive();
                        this.option2.on('pointerdown', () => {
                            this.textNPC.setText("Dobrze, szerokiej drogi!");
                            this.optionChosen = true;
                            this.option1.destroy();
                            this.option2.destroy();
                            
                        });
        
        
                        // Zatrzymanie gracza i ustawienie flagi ruchu
                        player.setVelocity(0);
                        this.playerCanMove = false;
                    }
                }
            }
        
            if (this.optionChosen) {
                this.optionChosen = false;
            }
        });
        
        
    }

    update() {
        if (this.playerCanMove) {
            const cursors = this.input.keyboard.createCursorKeys();
            player.update(cursors);
        }
    }

}

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerRight');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Inicjalizacja animacji gracza
        this.initAnimations();

        // Inicjalizacja pozycji gracza
        this.initPosition(x, y);

        this.body.setSize(this.width - 40, this.height - 35, true).setOffset(20, 35);
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

        if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
                if (this.body.velocity.x < 0) {
                    this.anims.play('right', true);
                    this.flipX = true;
                } else {
                    this.anims.play('right', true);
                    this.flipX = false;
                }
            } else {
                if (this.body.velocity.y < 0) {
                    this.anims.play('back', true);
                } else {
                    this.anims.play('front', true);
                }
            }
        } else {
            this.anims.stop(['back', 'front', 'right']);
        }

        player._oldPosition = { x: player.x, y: player.y };
    }
}
