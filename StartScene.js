class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        
        this.load.image('startButton', 'images/start/start.png');
    }

    create() {
        const startButton = this.add.image(window.innerWidth / 2, window.innerHeight - 100, 'startButton')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Scene1'))
            .on('pointerover', () => {
                startButton.setAlpha(0.8); 
            })
            .on('pointerout', () => {
                startButton.setAlpha(1); 
            });

        
        startButton.setOrigin(0.5);
        
        this.add.text(50, 50, 'Sterowanie:', { fontSize: '24px', fill: '#fff' });
        this.add.text(50, 100, 'Strzałki - Poruszanie się', { fontSize: '18px', fill: '#fff' });
        this.add.text(50, 150, 'E - Interakcja', { fontSize: '18px', fill: '#fff' });
    }
}