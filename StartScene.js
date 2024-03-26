
    class StartScene extends Phaser.Scene {
        constructor() {
            super({ key: 'StartScene' });
        }
    
        preload() {
            // Przyciski Start
            this.load.image('startButton', 'images/start/start.png');
            this.load.image('startButton2', 'images/start/start2.png');
            this.load.image('groundStart', 'images/start/ground_start.png');
            this.load.image('gory', 'images/start/tlo.png');
    
        }
    
        create() {
            // Tło
            const background = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x92e6f7).setOrigin(0);
    
            const gory = this.add.image(0, window.innerHeight + 260, 'gory').setOrigin(0, 1);
            //const goryCopy = this.add.image(window.innerWidth, window.innerHeight + 260, 'gory').setOrigin(0, 1);
            const goryCopy = this.add.image(gory.width, window.innerHeight + 260, 'gory').setOrigin(0, 1);
    
            // Dodaj obrazy tła groundStart
            const groundStart1 = this.add.image(0, window.innerHeight, 'groundStart').setOrigin(0, 1);
            const groundStart2 = this.add.image(groundStart1.width, window.innerHeight, 'groundStart').setOrigin(0, 1);
    
            // Szerokość obrazu tła
            const groundWidth = groundStart1.width;
            const goryWidth = gory.width;
    
            // Ruch obrazu tła groundStart
            this.tweens.add({
                targets: [groundStart1, groundStart2],
                x: '-=' + groundWidth,
                duration: 30000,
                repeat: -1, 
                onRepeat: function () {
                    if (groundStart1.x + groundWidth <= 0) {
                        groundStart1.x = groundStart2.x + groundWidth;
                    } else if (groundStart2.x + groundWidth <= 0) {
                        groundStart2.x = groundStart1.x + groundWidth;
                    }
                }
            });
    
            // Ruch obrazu tła "gory"
            this.tweens.add({
                targets: [gory, goryCopy],
                x: '-=' + goryWidth, 
                duration: 60000, 
                repeat: -1, 
                onRepeat: function () {
                    if (gory.x + goryWidth <= 0) {
                        gory.x = goryCopy.x + goryWidth;
                    } else if (goryCopy.x + goryWidth <= 0) {
                        goryCopy.x = gory.x + goryWidth;
                    }
                }
            });
    
            // Ustawienie pozycji "gory" za "groundStart"
            gory.setDepth(0);
            goryCopy.setDepth(0); 
    
            // Przycisk startu
            const startButton = this.add.image(window.innerWidth / 2, window.innerHeight - 100, 'startButton')
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.scene.start('Scene1'))
                .on('pointerover', () => {
                    startButton.setTexture('startButton2');
                })
                .on('pointerout', () => {
                    startButton.setTexture('startButton');
                });
    
            startButton.setOrigin(0.5);
    
            // Dodaj tekst
            this.add.text(50, 50, 'Sterowanie:', { fontSize: '24px', fill: '#000', fontWeight: 'bold' });
            this.add.text(50, 100, 'Strzałki - Poruszanie się', { fontSize: '18px', fill: '#000' });
            this.add.text(50, 150, 'E - Interakcja', { fontSize: '18px', fill: '#000' });
        }
    }