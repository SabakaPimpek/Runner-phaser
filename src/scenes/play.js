import Phaser from 'phaser';
import ObstacleSpawner from '../prefabs/ObstacleStawner';
import Character from '../prefabs/character'
import LivesManager from '../ui/livesManager';
import tilemapManager from '../prefabs/tilemapManager';

export default class Play extends Phaser.Scene {
    
    constructor (game)
    {
        super('Play');
        this.game = game;

    }
    
    init()
    {
        this.ObstacleSpawner = undefined;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.character = new Character(this, 200, 0);
        this.border = this.physics.world.bounds;
        this.coinGroup = this.add.group();
        this.spikeGroup = this.add.group();

        this.tilemapManager = new tilemapManager(this, 4.5);
        
        this.stats = {
            points: 0,
            coins: 0,
            lives: new LivesManager(this)
        }
    }

    
    preload ()
    {
       
    }
    
    create()
    {
        const width = this.game.config.width;
        const height = this.game.config.height;
        
        this.add.image(width * 0.5, height * 0.5, 'sky')
        .setScrollFactor(0)
        .setScale(1.05)
        .setDepth(-999);
        
        // this.physics.add.collider(this.character, this.tilemapGroup)
    
        const cam = this.cameras.main;
        cam.scrollY -= 200;
                
        this.input.on('pointerdown', this.character.Jump, this);
        this.physics.world.setBounds(-2000, -1000,Infinity, 2700);

        this.physics.add.overlap(this.character, this.coinGroup, this.coinCollect, null, this);
        this.physics.add.overlap(this.character, this.spikeGroup, this.characterCollision, null, this);

        this.scene.launch('playUI', { stats:  this.stats})
    }
    
    update()
    {
        const cam = this.cameras.main;
        cam.startFollow(this.character, true);
        cam.setFollowOffset(-300, 0);
        cam.setBounds(0,-195, Infinity, 500)

        if(this.character.y >= this.physics.world.bounds.bottom - 600)
        {
            const cam = this.cameras.main;
            this.sound.add('audio_hurt').play()
            this.stats.lives.removeLife();
            this.character.setInvincible(1500);
            cam.shake(100, 0.01);
            this.character.setY(0);
        }
        
        this.character.checkGround();

        this.tilemapManager.checkCurrentTilemap();
    }

// Methods ------------------------------------------------------------------------------------------------------

    characterCollision(character, tile) // If player sprite hits Obstacle, scene restarts
    {
       if(!character.isInvincible)
       {
            const cam = this.cameras.main;
            this.sound.add('audio_hurt').play()
            this.stats.lives.removeLife();
            character.setInvincible();
            cam.shake(100, 0.01);
       }
    }

    coinCollect(character, coin)
    {
        coin.destroy();
        this.stats.coins++;
        const musicConfig = {
            volume: 0.2
       }
        this.sound.add('audio_coin').play(musicConfig)
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

    showGameOver()
    {
        this.scene.pause();

        this.scene.get('playUI');

        this.scene.launch('GameOver', { score:  this.stats.points})

        let panel = this.scene.get('GameOver');

        panel.events.on('clickMenu', this.handleGoMenu, this);
        panel.events.on('clickTryAgain', this.handleTryAgain, this);
    }

    closeGameOver()
    {
        this.scene.stop('GameOver');
    }

    handleGoMenu()
    {
        this.closeGameOver();
        this.goMenu();
    }

    handleTryAgain()
    {
        this.closeGameOver();
        this.restartGame();
    }

    // Scenes -------------------------------------

    goMenu()
    {
        this.scene.start('Menu');
        this.game.sound.stopAll();
    }

    restartGame()
    {
        this.scene.restart();
    }
}

// Background image creator

/**
 * @param {Phaser.Scene} scene
 * @param {number} count
 * @param {string} texture
 * @param {number} scrollFactor
 */

const createAligned = (scene, count, texture, scrollFactor) => {
    let x = 0;
    let group = [];
    for (let i = 0; i < count; ++i)
    {
        const m = scene.add.image(x, scene.game.config.height + 200, texture)
            .setOrigin(0, 1)
            .setScrollFactor(scrollFactor)
            .setDepth(scrollFactor - 100)

        x += m.width;
        group.push(m);
    }
    return group;
}