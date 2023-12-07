import tile1JSON from '../tilemaps/tile1.json'

// This class loads all tilemaps from json files
// It manages coins, dangerous objects

const tilemapList = ["tile1", "tile2", "tile3"];

export default class tilemapManager {
    
    constructor(scene, scale = 1) {
        this.scene = scene;
        this.mapScale = scale;

        this.group = [];

        this.create()
    }

    create()
    {
        const firstTilemap = this.randomizeTilemap();
        const secondTilemap = this.randomizeTilemap();

        this.createTilemap(firstTilemap);
        this.createTilemap(secondTilemap);
    }

    createTilemap(tileName)
    {
        let xPos = 0;
        const lastTilemap = this.group[this.group.length-1];

        if(this.group.length > 0) xPos = lastTilemap.tilemapWidth + lastTilemap.x;

        const tilemap = this.scene.make.tilemap({ key: tileName });
        const tileset = tilemap.addTilesetImage('spritesheet', 'spritesheet');
        
        const objectsLayer = tilemap.getObjectLayer('Objects');
    
        this.createObjects(objectsLayer, xPos);
        
        let topLayer = tilemap.createLayer('Top', tileset, 0 + xPos, 0).setScale(this.mapScale);
        let botLayer = tilemap.createLayer('Bot', tileset, 0 + xPos, 0).setScale(this.mapScale); 
        const topCollider = this.scene.physics.add.collider(this.scene.character, topLayer);
        const botCollider = this.scene.physics.add.collider(this.scene.character, botLayer);
        topLayer.setCollisionByProperty({collide: true});
        botLayer.setCollisionByProperty({collide: true});
        topLayer.setDepth(1);

            botLayer.forEachTile((tile) => {
            if (tile.properties.collide) {
              
              tile.setCollision(false, false, true, false);
            }});

            topLayer.forEachTile((tile) => {
                if (tile.properties.collide) {
                  
                  tile.setCollision(false, false, true, false);
                }});

        const tilemapWidth = tilemap.widthInPixels * this.mapScale;

            this.group.push({
                x: xPos,
                tilemapWidth,
                tilemap,
                topLayer,
                botLayer,
                colliders: [
                    topCollider,
                    botCollider
                ]
            });

    }

    createObjects(objectLayer, xPos)
    {
        objectLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0, height = 0 } = objData
            
                switch (name)
                {
                    case 'character-spawn':
                        {
                            if(xPos === 0)
                            {
                                this.scene.character.setPosition(x * this.mapScale, y * this.mapScale)
                            }
                            break;
                        }
                    case 'coin' : 
                    {
                        const coin = this.scene.physics.add.sprite(xPos + x * this.mapScale, y * this.mapScale, "spritesheet", 78);
                        // coin.body.setImmovable(true);
                        coin.setScale(this.mapScale);
                        coin.body.setAllowGravity(false);
                        coin.setDepth(999);
                        coin.setSize(coin.width * 0.5, coin.height * 0.5);
                        
                        this.scene.coinGroup.add(coin);
                        break;
                    }
                    case 'spikes' :
                    {
                        const spike = this.scene.add.rectangle(xPos + x * this.mapScale, y * this.mapScale, width, height, 0x6666ff);
                        this.scene.physics.add.existing(spike);
                        spike.setScale(this.mapScale);
                        spike.setAlpha(0);
                        spike.body.setAllowGravity(false);
                        spike.setOrigin(0,0);
                        
                        this.scene.spikeGroup.add(spike);

                        break;
                    }
                }
            })
            
    }

    randomizeTilemap() {
        const number = Phaser.Math.Between(0, tilemapList.length - 1)
        return tilemapList[number];
    }

    checkCurrentTilemap() {
        const cam = this.scene.cameras.main;

        this.group.forEach((e, index)=> { // Checks every background image
            
               if(e.tilemapWidth + e.x + 50 < cam.scrollX)
               {
                   this.destroyTilemap(index);

                   const tilemapName = this.randomizeTilemap();

                   this.createTilemap(tilemapName);
               }
            }
        );
    }

    destroyTilemap(index)
    {
        const cam = this.scene.cameras.main;

        this.group[index].colliders.forEach(element => {
            element.destroy();
        });
        this.group[index].tilemap.destroy();

        this.group.splice(index, 1)

        this.scene.coinGroup.children.each((obj) => {
            if(cam.scrollX > obj.x + this.scene.game.config.width + obj.width + 1 )
            {
                obj.destroy();
            }
        })

        this.scene.spikeGroup.children.each((obj) => {
            if(cam.scrollX > obj.x + this.scene.game.config.width + obj.width + 1 )
            {
                obj.destroy();
            }
        })
    }
}