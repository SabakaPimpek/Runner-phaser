import Phaser from 'phaser'

export default class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "character-run");
        
        this.scene = scene;
     
        this.jumpCount = 0
        this.JumpMaxCount = 2;
        this.isInvincible = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        
        this.setUp();
        this.createAnimations();
        // this.createEvents();

    }
    
    setUp()
    {
      this.setDepth(9999);
      this.setOrigin(1,1);
      this.setBounce(0);
      this.setSize(56, 128, this);
      this.setAccelerationX(300);
      this.setMaxVelocity(300, 900)
    //   this.setVelocity
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

    checkGround()
    {
        // this.setVelocityX(300);

        if (this.body.onFloor() && this.body.velocity.y === 0) {
            // Sprite jest na ziemi
            this.play('character-run', true);
            this.jumpCount = 0;
        } else {
            // Sprite jest w powietrzu
            this.play('character-jump', true);
        }
    }

    removeEvents()
    {
        this.scene.events.off('update');
    }

    Jump() // This function is called in Play scene and needs to use this.character
    {

         if(this.character.jumpCount < this.character.JumpMaxCount)      
         {
                this.character.jumpCount++;
                this.character.setVelocityY(-700);
                const musicConfig = {
                     volume: 0.2
                }
         
                this.sound.add('audio_jump').play(musicConfig);  
            }
    }

    setInvincible(time = 1000) // in milliseconds
    {
        if(this.isInvincible === false)
        {
            this.isInvincible = true;
            this.scene.time.addEvent({
                delay : time,
                callback: this.removeInvincible,
                callbackScope: this
                
            })

            this.scene.tweens.add({
                targets: this,
                alpha: 0.3,
                ease: 'Cubic.easeOut',  
                duration: time / 8,
                repeat: 3,
                yoyo: true
              })
        }
    }

    removeInvincible()
    {
        this.isInvincible = false;
    }

    // setPosition()

  }