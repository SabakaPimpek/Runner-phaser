import Text from '../ui/text';
import Sky from '../images/sky.png'
import Mountains from '../images/mountains.png'
import Plateau from '../images/Plateau.png'
import Ground from '../images/ground.png'
import Plants from '../images/Plant.png'
import Jump from '../images/Jump.png'
import Run from '../images/Run.png'
import Stone from '../images/stone.png'
import Swamp from '../images/swamp.png'
import Spritesheet from '../images/spritesheet.png'

import menuAudio from '../music/menu.wav'
import jumpAudio from '../music/Jump.wav'
import hurtAudio from '../music/hurt.ogg'
import coinPickupAudio from '../music/Pickup_Coin.wav'

import tile1JSON from '../tilemaps/tile1.json'
import tile2JSON from '../tilemaps/tile2.json'
import tile3JSON from '../tilemaps/tile3.json'

export default class Preload extends Phaser.Scene {
    
    constructor (game)
    {
        super('Preload');
        this.game = game;
    }
    
    preload ()
    {
        this.bg = this.add.graphics({ x: 0, y: 0});
        this.bg.fillStyle('0xF4CCA1', 1);
        this.bg.fillRect(0, 0, this.game.CONFIG.width, this.game.CONFIG.height);

        this.createLoadingBar()


        this.load.image("sky", Sky);
        this.load.image("mountains", Mountains);
        this.load.image("plateau", Plateau);
        this.load.image("ground", Ground);
        this.load.image("plants", Plants);
        this.load.image("stone", Stone);
        this.load.image("swamp", Swamp);
        // this.load.image("spritesheet", Spritesheet);
        
        this.load.audio("music_menu", menuAudio);
        this.load.audio("audio_jump", jumpAudio);
        this.load.audio("audio_hurt", hurtAudio);
        this.load.audio("audio_coin", coinPickupAudio);

        this.load.tilemapTiledJSON("tile1", tile1JSON);
        this.load.tilemapTiledJSON("tile2", tile2JSON);
        this.load.tilemapTiledJSON("tile3", tile3JSON);
        
        this.load.spritesheet("character-run", Run,
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        )

        this.load.spritesheet("character-jump", Jump,
            {
                frameWidth: 128,
                frameHeight: 128,
            }
        )

        this.load.spritesheet('spritesheet', Spritesheet,
            {
                frameWidth: 21,
                frameHeight: 21,
                margin: 3,
                spacing: 2
            }
        )

    }

    create ()
    {
        // Create sprite animations
        this.createAllAnims();

        //Go to menu
        this.time.addEvent({
            delay: 1000,
            callback: () => {this.scene.start('Menu', this.game); },
            callbackScope: this
        })
    }

    createLoadingBar()
    {

        // Title
        this.title = new Text(
            this,
            this.game.CONFIG.centerX,
            75,
            'Loading Game',
            'preload',
            0.5
        );

        // Progress text
        this.txt_progress = new Text(
            this,
            this.game.CONFIG.centerX,
            this.game.CONFIG.centerY -5,
            'Loading...',
            'preload',
            {x: 0.5, y: 1}            
        );

        // Progress bar
        // ...

            let x = 10;
            let y = this.game.CONFIG.centerY + 5;
            let w = this.game.CONFIG.width - 2*x;
            let h = 18;

            this.progress = this.add.graphics({ x: x, y: y})
            this.border = this.add.graphics({ x: x, y: y})
        // Progress callback
        this.load.on('progress', this.onProgress, this)
    }
    
    onProgress (val)
    {
        // Width of progress bar
        // ...

        let w = this.game.CONFIG.width - 2*this.progress.x;
        let h = 36;

        this.progress.clear();
        this.progress.fillStyle('0xFFFFFF', 1);
        this.progress.fillRect(0, 0, w * val, h);

        this.border.clear();
        this.border.lineStyle(4, '0x4D6592', 1);
        this.border.strokeRect(0, 0, w*val, h)

        // Percentage in progress text
        let perc = Math.round(val * 100) + '%';;
        this.txt_progress.setText(perc);

    }

    createAllAnims()
    {
        // All animations moved to character class (prefab file)
    
    }
}``