import Phaser from 'phaser';
import ObstacleSpawner from '../prefabs/ObstacleStawner';
import Text from '../ui/text';

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

        this.stats = {
            points: 0
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
        
        
        this.backgroundItems = [
            // createAligned(this, 2, 'mountains', 0.25),
            // createAligned(this, 3, 'plateau', 0.5),
            // createAligned(this, 7, 'ground', 1),
            // createAligned(this, 15, 'plants', 1.25), 
        ];
        
        this.character = this.physics.add.sprite(200, 50, "character-run");
        this.character.play("character-run");   
        this.character.setDepth(9999);
        this.character.setOrigin(0, 1)
        this.character.isJumping = false;
        
        this.createUI();
        
        // this.character.setCollideWorldBounds(true);
        // this.physics.world.setBounds(0, 0, 2500000, this);
        
        this.ObstacleSpawner = new ObstacleSpawner(this, 'stone');
        const ObstacleGroup = this.ObstacleSpawner.group;
        
        this.physics.add.overlap(this.character, ObstacleGroup, this.characterCollision, null, this);
        
        this.input.on('pointerdown', this.characterJump, this);
        
        this.events.on('update', () => {
            if (this.character.body.onFloor()) {
                // Sprite jest na ziemi
                this.character.play('character-run', true);
            } else {
                // Sprite jest w powietrzu
                this.character.play('character-jump', true);
            }
        });

        //layers
        const tile1 = this.make.tilemap({ key: 'tile1' });
        const tileset = tile1.addTilesetImage('spritesheet', 'spritesheet');

        let top = tile1.createLayer('Top', tileset, 0, 200).setScale(4.5);
        let bot = tile1.createLayer('Bot', tileset, 0, 200).setScale(4.5);

        this.physics.add.collider(this.character, bot);

        bot.setCollisionByProperty({collide: true});



        // bot.setCollisionByExclusion([-1]);
        // this.physics.add.collider(this.player, bot);

        
        top.setDepth(1);



        // const matchingTiles = map.filterTiles(tile => tile.index === 1);

        // const gos = matchingTiles.map(tile => {
        //     const block = new Brick(this, tile.pixelX + 50 , tile.pixelY + 100, 'brick');
        //     return block;
        // });

    }
    
    update()
    {
        const speed = 2;
        const cam = this.cameras.main;
        cam.scrollX += speed;
        this.character.x += speed;

        this.checkCurrentBackgroundItem(this);
        this.checkCurrentGameItems();
        this.updateUI();
        this.ObstacleSpawner.CheckCameraPosition(cam);
    }

    characterJump()
    {
        if(this.character.body.onFloor())      
            {
                this.character.setVelocityY(-800);
            }

    }

    characterCollision() // If player sprite hits Obstacle, scene restarts
    {
        this.character.anims.stop();
        this.character.setCollideWorldBounds(false);

        this.time.addEvent({
            delay : 100,
            callback: this.showGameOver,
            callbackScope: this
        })
    }

    checkCurrentGameItems() // If item (obstacles, coins etc.) will go outside of left screen side it dissapears.
    {
        const cam = this.cameras.main;

       this.ObstacleSpawner.group.getChildren().forEach(e => {
            if(cam.scrollX > e.x + e.width*2) e.destroy();
       });
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