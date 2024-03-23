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
        this.physics.add.collider(player, layer2);

        this.rat = this.physics.add.sprite(720, 625, 'rat').setScale(2);
        this.rat.setDepth(1);

        this.physics.world.enable(this.rat);
        this.rat._oldPosition = { x: 370, y: 325 };



    this.anims.create({
        key: 'rat',
        frames: this.anims.generateFrameNumbers('rat', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1,
    });

    this.rat.anims.play('rat', true);


map2.layers.forEach(layer => {
    for (let y = 0; y < layer.data.length; y++) {
        for (let x = 0; x < layer.data[y].length; x++) {
            const tile = layer.data[y][x];
            if (tile.index !== -1 && tile.index !== 0) {
                tile.setCollision(true);
                tile.setCollisionCallback(() => {
                    console.log("Kolizja z kafelkiem o indeksie:", tile.index);
                    player.setX(player._oldPosition.x);
                    player.setY(player._oldPosition.y);
                });
            }
        }
    }
});

// Dodanie kolizji z warstwą layer2
this.physics.add.collider(player, layer2);

    }



update(){
    const cursors = this.input.keyboard.createCursorKeys(); 

    player.update(cursors); 

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

        //player._oldPosition = { x: player.x, y: player.y };
    }
}
