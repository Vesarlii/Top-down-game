const config = {
    debug: true,
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
    scene: [StartScene, Scene1],

    // Konfiguracja kamery
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE
    },
    render: {
        pixelArt: true,
        roundPixels: true
    },
    autoFocus: true,
    parent: 'game-container'
};

const game = new Phaser.Game(config);