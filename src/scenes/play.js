import Phaser from 'phaser';
import ObstacleSpawner from '../prefabs/ObstacleStawner';
import Character from '../prefabs/character'
import Text from '../ui/text';
import LivesManager from '../ui/livesManager';

import tile1JSON from '../tilemaps/tile1.json'

export default class Play extends Phaser.Scene {
    
    constructor (game)
    {
        super('Play');
        this.game = game;

    }
    
    init()
    {
        this.ObstacleSpawner = undefined;
        this.screenText = {};
        this.cursors = this.input.keyboard.createCursorKeys();
        this.character;
        this.mapScale = 4.5;
        this.border = this.physics.world.bounds;

        
        this.stats = {
            points: 0,
            lives: new LivesManager(this)
        }
    }
    
    preload ()
    {
        this.load.tilemapTiledJSON("tile1", tile1JSON);
    }
    
    create()
    {
        const width = this.game.config.width;
        const height = this.game.config.height;
        
        this.add.image(width * 0.5, height * 0.5, 'sky')
        .setScrollFactor(0);
        
        this.createUI();
        
        
        
        const cam = this.cameras.main;
        cam.scrollY -= 200;
        
        //layers
        const tile1 = this.make.tilemap({ key: 'tile1' });
        const tileset = tile1.addTilesetImage('spritesheet', 'spritesheet');
        
        const objectsLayer = tile1.getObjectLayer('Objects');
        
        objectsLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name } = objData
            
            switch (name)
            {
                case 'character-spawn':
                    {
                        this.character = new Character(this, x * this.mapScale, y * this.mapScale);
                        break;
                    }
                }
            })
            
            this.physics.world.setBounds(-2000, -1000,Infinity, 2700)
            
            this.input.on('pointerdown', this.character.Jump, this);
            
            let top = tile1.createLayer('Top', tileset, 0, 0).setScale(this.mapScale);
            let bot = tile1.createLayer('Bot', tileset, 0, 0).setScale(this.mapScale);
            
            this.physics.add.collider(this.character, bot);
            bot.setCollisionByProperty({collide: true});
            
            this.physics.add.overlap(this.character, top, this.characterCollision, null, this);
            top.setDepth(1);
            
            // this.character.on('worldbounds', function() {
                //     // Dodaj tutaj swoją reakcję na kolizję z granicami świata
                //     console.log('Kolizja z granicą świata');
                // });
                
        
    }
    
    update()
    {
        const cam = this.cameras.main;
        cam.startFollow(this.character, true);
        cam.setFollowOffset(-300, 0);
        cam.setBounds(0,-195, Infinity, 500)

        if(this.character.y >= this.physics.world.bounds.bottom)
        {
            this.showGameOver();
        }
        
        this.updateUI();

        this.character.checkGround();
        
        // console.log(this.character.body);
    }

    characterCollision(character, tile) // If player sprite hits Obstacle, scene restarts
    {
        if(tile.properties.damage && this.character.isInvincible === false)
        {
            const cam = this.cameras.main;
            this.sound.add('audio_hurt').play()
            this.stats.lives.removeLife();
            this.character.setInvincible(1000);
            cam.shake(100, 0.01);
        }

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

    createUI() { // Generates Text for points
        this.screenText.points = new Text(
            this,
            20,
            20,
            'Punkty: 0',
            'title',
            0
            );

        this.screenText.points.setScrollFactor(0, 0);

        // this.lives.update();
        
        
        // this.lives.addLife();
    }

    updateUI()
    {
        this.stats.points = parseInt(this.cameras.main.scrollX/10);
        this.screenText.points.setText("Punkty: " + this.stats.points);
    }

    showGameOver()
    {
        this.scene.pause();
        this.screenText.points.setVisible(false);

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

        console.log(this);
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
        const m = scene.add.image(x, scene.game.config.height, texture)
            .setOrigin(0, 1)
            .setScrollFactor(scrollFactor)
            .setDepth(scrollFactor * 100)

        x += m.width;
        group.push(m);
    }
    return group;
}