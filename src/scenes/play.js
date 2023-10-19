import Phaser from 'phaser';
import ObstacleSpawner from '../prefabs/ObstacleStawner';
import Text from '../ui/text';

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
    }
    
    create()
    {
        const width = this.game.config.width;
        const height = this.game.config.height;
        
        this.add.image(width * 0.5, height * 0.5, 'sky')
            .setScrollFactor(0);


        this.backgroundItems = [
            createAligned(this, 2, 'mountains', 0.25),
            createAligned(this, 3, 'plateau', 0.5),
            createAligned(this, 7, 'ground', 1),
            createAligned(this, 15, 'plants', 1.25), 
        ];

        this.character = this.physics.add.sprite(200, height-130, "character-run");
        this.character.play("character-run");   
        this.character.setDepth(9999);
        this.character.setOrigin(0, 1)
        this.character.isJumping = false;
        
        this.createUI();
        
        this.character.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, 2500000, height-130);

        this.ObstacleSpawner = new ObstacleSpawner(this, 'stone');
        const ObstacleGroup = this.ObstacleSpawner.group;

        this.physics.add.overlap(this.character, ObstacleGroup, this.characterCollision, null, this);
        
        this.input.on('pointerup', this.characterJump, this);

        this.events.on('update', () => {
            if (this.character.body.onFloor()) {
                // Sprite jest na ziemi
                this.character.play('character-run', true);
            } else {
                // Sprite jest w powietrzu
                this.character.play('character-jump', true);
            }
        });
        
    
    }
    
    update()
    {
        const speed = 3 + this.stats.points/1000;
        const cam = this.cameras.main;
        cam.scrollX += speed;
        this.character.x += speed;

        this.checkCurrentBackgroundItem(this);
        this.checkCurrentGameItems();
        this.updateUI();
        this.ObstacleSpawner.CheckCameraPosition(cam);
        console.log(this.character.isJumping)
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
        this.scene.restart();
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