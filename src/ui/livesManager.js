/**
 * @param {Phaser.Scene} scene
 * @param {number} maxLives
 */

// Tilemap IDs

const spritesheetName = "spritesheet";
const fullHeartID = 139;
const EmptyHeartID = 141;

export default class LivesManager {
    constructor(scene, maxLives = 3)
    {
        this.scene = scene;

        this._group = scene.add.group(); // Displayed hearts images in group
        this.maxLives = maxLives;
        this.currentLives = maxLives;

        this.create();
    }

    create()
    {
        const spacing = 100;
        const margin = 50;

        for(let i = 0; i < this.currentLives; i++)
        {
            const sprite = this.scene.add.sprite(this.scene.game.CONFIG.width - margin - (i * spacing), margin, spritesheetName, fullHeartID);
            sprite.setScrollFactor(0);
            sprite.setScale(4.5);
            sprite.setDepth(999999999999999);

            this.group.create(sprite);
        }
    }

    addLife()
    {

    }

    removeLife()
    {

    }

    get group()
    {
        return this._group;
    }

    set group(group)
    {
        this._group = group;
    }
}