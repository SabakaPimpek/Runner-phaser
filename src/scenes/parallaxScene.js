import Phaser from 'phaser';

export default class parallaxScene extends Phaser.Scene {
    
    constructor (game)
    {
        super('parallax-scene');
        this.game = game;
    }

    init()
    {
      
    }
    
    preload ()
    {
       
    }
    
    create()
    {
        const width = this.game.config.width;
        const height = this.game.config.height;

        this.add.image(width * 0.5, height * 0.5, 'sky')
        // this.add.image(0, 0, 'mountains').setOrigin(0, 0);
    }
    
    update()
    {
    

    }

  
}