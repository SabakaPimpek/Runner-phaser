import tile1JSON from '../tilemaps/tile1.json'

// This class loads all tilemaps from json files
// It manages coins, dangerous objects and checkpoints created from tilemaps

export default class tilemapManager {
    
    constructor(scene, scale = 1) {
        this.scene = scene;
        this.mapScale = scale; // Tilemap scale
        this.tilemapGroup = scene.physics.add.staticGroup()
        this.coinGroup = scene.add.group();

        this.preload();
        this.create()
    }

    preload()
    {
        
    }

    create()
    {
        const tile1 = this.scene.make.tilemap({ key: 'tile1' });
        const tileset = tile1.addTilesetImage('spritesheet', 'spritesheet');
        
        const objectsLayer = tile1.getObjectLayer('Objects');
        
        objectsLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name } = objData
            
                switch (name)
                {
                    case 'character-spawn':
                        {
                            this.scene.character.x = x * this.mapScale
                            this.scene.character.y = y * this.mapScale
                            
                            break;
                        }
                    case 'coin' : 
                    {
                        const coin = this.scene.physics.add.sprite(x * this.mapScale, y * this.mapScale, "spritesheet", 78);
                        // coin.body.setImmovable(true);
                        coin.setScale(this.mapScale);
                        coin.body.setAllowGravity(false);
                        coin.setDepth(999);
                        coin.setSize(coin.width * 0.5, coin.height * 0.5)
                        
                        this.scene.coinGroup.add(coin);
                    }
                }
            })

            let top = tile1.createLayer('Top', tileset, 0, 0).setScale(this.mapScale);
            let bot = tile1.createLayer('Bot', tileset, 0, 0).setScale(this.mapScale);

            top.setDepth(1);

    }
}