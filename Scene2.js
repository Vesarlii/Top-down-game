class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {
        console.log("Preload method in Scene2 is being called.");

        this.load.image('plytki', 'images/map/plytki.png', { image: { compression: 'none' } });
        this.load.tilemapTiledJSON("map2", "images/map/piwnica.json", undefined, Phaser.Tilemaps.TILED_JSON, { compression: 'none' });
    }

    create() {
        console.log("Create method is being called.");
        const gameWidth = window.innerWidth;
        const gameHeight = window.innerHeight;



        const map2 = this.make.tilemap({ key: "map2", tileWidth: 16, tileHeight: 16 });
        const tileset2 = map2.addTilesetImage("plytki", "plytki");
        console.log("Tileset 'plytki' loaded");

        let layer0 = map2.createLayer("0", tileset2, 0, 0).setScale(4);
        console.log("Layer '0' loaded");
    
        let layer1 = map2.createLayer("1", tileset2, 0, 0).setScale(4);
        console.log("Layer '1' loaded");
    
        let layer2 = map2.createLayer("2", tileset2, 0, 0).setScale(4);
        console.log("Layer '2' loaded");
    }
}