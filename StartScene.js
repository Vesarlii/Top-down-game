class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        
        this.add.text(50, 50, 'Sterowanie:', { fontSize: '24px', fill: '#fff' });
        this.add.text(50, 100, 'Strzałki - Poruszanie się', { fontSize: '18px', fill: '#fff' });
        this.add.text(50, 150, 'E - Interakcja', { fontSize: '18px', fill: '#fff' });

        
        const startButton = this.add.text(window.innerWidth / 2, window.innerHeight - 100, 'Start', { fontSize: '24px', fill: '#fff', backgroundColor: '#00f' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Scene1'));

        
        Phaser.Display.Align.In.Center(startButton, this.add.zone(window.innerWidth / 2, window.innerHeight - 100, window.innerWidth, 200));
    }
}