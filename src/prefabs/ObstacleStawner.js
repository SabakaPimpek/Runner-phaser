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

		this._gap = 2000; // Spawning gap between 1 object and 2.
		this._spawnX = this.scene.game.config.width; // This variable stores next object X;
		this._spawningDistance = 1000;

		this._group = this.scene.physics.add.group()
	}
	
	CheckCameraPosition(cam)
	{

		if(cam.scrollX >= this.spawnX - this.spawningDistance - 100 - this.scene.game.config.width)
		{
			this.spawn(this.spawnX);
		}
	}

	spawn(x)
	{
		const bottom = this.scene.physics.world.bounds.bottom;

		this.spawnX += this.gap;
		const randomX = this.randomizeX(x);
		
        const obst = this.group.create(randomX, bottom, this.key)

		obst.setScrollFactor(1);
        obst.setDepth(9999);
		obst.setOrigin(0,1);
		obst.setCollideWorldBounds(true);
		obst.setScale(2);
		

		return obst
	}

	randomizeX(current)
	{
		const min = current + this.gap - this.spawningDistance;
		const max = current + this.gap + this.spawningDistance;

		return Phaser.Math.Between(min, max);
	}

	
	get group()
	{
		return this._group
	}

	get gap()
	{
		return this._gap
	}

	get spawningDistance()
	{
		return this._spawningDistance
	}

	get spawnX()
	{
		return this._spawnX
	}

	set spawnX(x)
	{
		this._spawnX = x;
	}
}