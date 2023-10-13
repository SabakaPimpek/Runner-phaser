export default class Boot extends Phaser.Scene {
    
    constructor (game)
    {
        super('Boot');
        this.game = game;

    }

    init ()
    {

    }

    preload ()
    {
        // Bitmap font for PrealoadScene...
        // ... path
        // this.load.setPath('assets/fonts');
        // // ...files
        // this.load.bitmapFont('ClickPixel', 'click_0.png', 'click.xml')
    }

    create ()
    {
        this.scene.start('Preload', this.game);
    }
}