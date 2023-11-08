import Phaser from 'phaser'

export default class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, "character-run");
  
      this.scene = scene;
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.isInvincible = false;
    //   this.setCollideWorldBounds(true);
        
      this.setUp();
      this.createAnimations();
      this.createEvents();
    }
    
    setUp()
    {
      this.setDepth(9999);
      this.setOrigin(0.75, 0.75);
      this.setSize(64, 128, true);
      this.setVelocityX(300);
    }

    createAnimations()
    {
        this.anims.create({
            key: 'character-run',
            frames: this.anims.generateFrameNumbers('character-run', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'character-jump',
            frames: this.anims.generateFrameNumbers('character-jump', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
    }

    createEvents()
    {
        this.scene.events.on('update', () => {
            if (this.body.onFloor()) {
                // Sprite jest na ziemi
                this.play('character-run', true);
            } else {
                // Sprite jest w powietrzu
                this.play('character-jump', true);
            }
        });
    }

    Jump()
    {
         if(this.character.body.onFloor())      
            {
                this.character.setVelocityY(-800);
                const musicConfig = {
                     volume: 0.2
                }
         
                this.sound.add('audio_jump').play(musicConfig);  
            }
    }

    setInvincible(time = 500) // in milliseconds
    {
        if(this.isInvincible === false)
        {
            this.isInvincible = true;
            this.scene.time.addEvent({
                delay : time,
                callback: this.removeInvincible,
                callbackScope: this
            })            
        }
    }

    removeInvincible()
    {
        this.isInvincible = false;
    }

  }