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
            'Runner Game',
            'title'
        )
       // Click to play
       this.text = new Text(
            this,
            this.game.CONFIG.centerX,
            this.game.CONFIG.centerY,
            'Kliknij, aby rozpocząć',
            'standard'
       );

       this.title.setScrollFactor(0);
       this.title.setDepth(999999);
       this.text.setScrollFactor(0);
       this.text.setDepth(99999);

        this.createMusic();
       // Create mouse input
        this.createMouseInput();

       // Create keyboard input
       this.createKeyboardInput();

    }

    update()
    {
        const cam = this.cameras.main;
        cam.scrollX += 1;

        this.checkCurrentBackgroundItem(this);
    }

    createBackground () {
        this.backgroundItems = [
            this.createAligned(this, 4, "swamp", 1)
        ];
    }

    
    createAligned = (scene, count, texture, scrollFactor) => {
        let x = 0;
        let group = [];
        for (let i = 0; i < count; ++i)
        {
            const m = scene.add.image(x, 0, texture)
                .setOrigin(0,0)
                .setScrollFactor(scrollFactor)
                .setDepth(0)

            x += m.width;
            group.push(m);
        }
        return group;
    }

    createMusic()
    {
        this.sound.stopAll();
        this.music = this.sound.add("music_menu");

        const musicConfig = {
             loop: true
        }
 
        this.music.play(musicConfig); 
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

    checkCurrentBackgroundItem(scene) /* If background item (ground, mountains)
    is outside of the screen it dissapears and new same background item is created. */
    {
        const cam = this.cameras.main;

        this.backgroundItems.forEach(e => { // Checks every background image
            const first = e[0];
            
            if(cam.scrollX >= first.x + first.width) { // Adds new background image if first is outside of the screen
                const last = e[e.length-1];
                e.splice(0, 1);
                const m = scene.add.image(last.x + last.width, scene.game.config.height, first.texture.key)
                .setOrigin(0, 1)
                .setScrollFactor(first.scrollFactorX)
                .setDepth(first.depth)

                e.push(m);

            }
        });

    }

    goPlay()
    {
        this.scene.start('Play', this.game);
    }

    
}