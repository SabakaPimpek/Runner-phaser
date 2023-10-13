import Text from '../ui/text'

export default class Menu extends Phaser.Scene {
    
    constructor (game)
    {
        super('Menu');
        this.game = game;
    }

    preload ()
    {
       
    }

    create ()
    {

        this.createBackground();
       // Game  title
        this.title = new Text(
            this,
            this.game.CONFIG.centerX,
            75,
            'Arkanoid',
            'title'
        )
       // Click to play
       this.text = new Text(
            this,
            this.game.CONFIG.centerX,
            this.game.CONFIG.centerY,
            'click to play',
            'standard'
       );

       // Create mouse input
        this.createMouseInput();

       // Create keyboard input
       this.createKeyboardInput();

    }

    createBackground () {
        this.bg = this.add.graphics({ x: 0, y: 0});
        this.bg.fillStyle('0xF4CCA1', 1);
        this.bg.fillRect(0, 0, this.game.CONFIG.width, this.game.CONFIG.height);

    }

    createMouseInput() {
        this.input.on('pointerup', this.goPlay, this)
    }

    createKeyboardInput() {
        function handleKeyUp (e) {
            switch(e.code) {
                case 'Enter':
                    this.goPlay();
                    break;
            }
        }

        this.input.keyboard.on('keyup', handleKeyUp, this);
    }

    goPlay()
    {
        this.scene.start('Play', this.game);
    }
}