import Phaser from 'phaser';
import ObstacleSpawner from '../prefabs/ObstacleStawner';

export default class Play extends Phaser.Scene {
    
    constructor (game)
    {
        super('Play');
        this.game = game;

        this.ObstacleSpawner = undefined;
    }

    init()
    {

    }
    
    preload ()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
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
            createAligned(this, 10, 'plants', 1.25), 
        ];

        this.character = this.physics.add.sprite(200, height-130, "character-run");
        this.character.play("character-run");
        this.character.setScale(2);
        this.character.setOrigin(0,1);
        this.character.setDepth(9999);

        
        this.character.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, 2500000, height-130);
    
        this.ObstacleSpawner = new ObstacleSpawner(this, 'stone');
        const ObstacleGroup = this.ObstacleSpawner.group;

        this.physics.add.overlap(this.character, ObstacleGroup, this.characterCollision, null, this)
        
        this.character.isJumping = false;
        this.input.on('pointerup', this.characterJump, this);

        this.character.on("animationcomplete-character-jump", function(animation, frame) {
            if(this.character.isJumping) {
                this.character.isJumping = false; 
                
                this.character.play("character-run");		
            }
        }, this);
        
        
        setInterval(() => {
            const cam = this.cameras.main;
            let x = cam.scrollX + cam.width + 50;
            
            this.ObstacleSpawner.spawn(x);
        
            
        }, 3000);
        
        
        // this.cameras.main.setBounds(0, 0, width * 3, height)

        console.log(this.ObstacleSpawner.group);


    }
    
    update()
    {

        const cam = this.cameras.main;
        const speed = 3;
        cam.scrollX += speed;
        this.character.x += speed;

        this.checkCurrentBackgroundItem(this);
        this.checkCurrentGameItems();
    }

    characterJump()
    {
        if(this.character.y >= this.game.config.height - 130 && !this.character.isJumping)      
            {
                this.character.isJumping = true;

                this.character.setVelocityY(-700);

                this.character.play("character-jump");
            }

    }

    characterCollision()
    {
        this.scene.restart();
    }

    checkCurrentGameItems()
    {
        const cam = this.cameras.main;

       this.ObstacleSpawner.group.getChildren().forEach(e => {
            if(cam.scrollX > e.x + e.width*2) e.destroy();
       });
    }
  
    checkCurrentBackgroundItem(scene)
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