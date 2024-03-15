//import Player from 'Player.js';

class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {
        console.log("Preload method in Scene2 is being called.");

        this.load.image('plytki', 'images/map/plytki.png', { image: { compression: 'none' } });
        this.load.tilemapTiledJSON("map2", "images/map/piwnica.json", undefined, Phaser.Tilemaps.TILED_JSON, { compression: 'none' });


        this.load.spritesheet('rat', 'images/npc/rat/krolszczur.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        console.log("Create method is being called.");
        const gameWidth = window.innerWidth;
        const gameHeight = window.innerHeight;



        const map2 = this.make.tilemap({ key: "map2", tileWidth: 16, tileHeight: 16 });
        const tileset2 = map2.addTilesetImage("plytki", "plytki");
        console.log("Tileset 'plytki' loaded");

        let layer0 = map2.createLayer("0", tileset2, 0, 0).setScale(2);
        console.log("Layer '0' loaded");
    
        let layer1 = map2.createLayer("1", tileset2, 0, 0).setScale(2);
        console.log("Layer '1' loaded");
    
        let layer2 = map2.createLayer("2", tileset2, 0, 0).setScale(2);
        console.log("Layer '2' loaded");

        //this.player = new Player(this, 200, 200);

        this.rat = this.physics.add.sprite(370, 325, 'rat').setScale(2);
        this.rat.setDepth(1);

        this.physics.world.enable(this.rat);
        this.rat._oldPosition = { x: 370, y: 325 };

    //     this.physics.add.collider(this.player, this.rat, (player, rat) => {
    //         player.setX(player._oldPosition.x);
    //         player.setY(player._oldPosition.y);

    //         rat.setVelocity(0, 0);

    //         rat.setX(rat._oldPosition.x);
    //         rat.setY(rat._oldPosition.y);
    //     });


    this.anims.create({
        key: 'rat',
        frames: this.anims.generateFrameNumbers('rat', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1,
    });

    this.rat.anims.play('rat', true);
    }


update(){
    //this.player.update(this.input.keyboard.createCursorKeys());

}
}
