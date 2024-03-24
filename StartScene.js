class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Ładuje obrazki przycisków startu
        this.load.image('startButton', 'images/start/start.png');
        this.load.image('startButton2', 'images/start/start2.png');
    }

    create() {
        // Tworzy tło
        this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x92e6f7).setOrigin(0);

        // Dodaje przycisk startu
        const startButton = this.add.image(window.innerWidth / 2, window.innerHeight - 100, 'startButton')
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Scene1'))
            .on('pointerover', () => {
                startButton.setTexture('startButton2'); // Zmienia obraz przycisku na startButton2
            })
            .on('pointerout', () => {
                startButton.setTexture('startButton'); // Powrót do pierwotnego obrazu przycisku
            });

        startButton.setOrigin(0.5);
        
        // Dodaje tekst
        this.add.text(50, 50, 'Sterowanie:', { fontSize: '24px', fill: '#000', fontWeight: 'bold' });
        this.add.text(50, 100, 'Strzałki - Poruszanie się', { fontSize: '18px', fill: '#000' });
        this.add.text(50, 150, 'E - Interakcja', { fontSize: '18px', fill: '#000' });
    }
}