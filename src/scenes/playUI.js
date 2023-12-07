import Text from '../ui/text';

export default class playUI extends Phaser.Scene {
    
    constructor (game)
    {
        super({ key: 'playUI', active: false});
        this.game = game;

    }

    init(data)
    {
        //Score data passed from 'Play' scene
        this.stats = data.stats;

        this.CONFIG = this.game.CONFIG;

        this.screenText = {};
    }

    preload ()
    {
       
    }

    create ()
    {
        this.createUI();
    }

    update ()
    {
        this.updateUI();
    }

    updateUI()
    {
        this.stats.points = parseInt(this.cameras.main.scrollX/10 + this.stats.coins * 50);
        this.screenText.points.setText("Punkty: " + this.stats.points);
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
}