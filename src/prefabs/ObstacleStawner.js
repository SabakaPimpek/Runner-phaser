import Phaser from 'phaser'

export default class ObstacleSpawner
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene, obstacleKey = 'stone')
	{
		this.scene = scene
		this.key = obstacleKey

		this._group = this.scene.physics.add.group()
	}

	get group()
	{
		return this._group
	}

	spawn(x)
	{
		const bottom = this.scene.physics.world.bounds.bottom;
		
        const obst = this.group.create(x, bottom, this.key)
		obst.setScrollFactor(1);
        obst.setDepth(9999);
		obst.setOrigin(0,1);
		obst.setCollideWorldBounds(true);
		obst.setScale(2);
		
		return obst
	}
}