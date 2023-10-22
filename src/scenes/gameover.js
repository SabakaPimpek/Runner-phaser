
class GameOver extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'GameOver', active: false});
    }

    init(data)
    {
        //Score data passed from 'Play' scene
        this.score = data.score;

        this.CONFIG = this.sys.game.config;
    }

    create()
    {
        //Background

        let x = this.CONFIG.tile;
        let w = this.CONFIG.width - 2*x;

        let h = 296;
        let y = 148;

        this.background = this.add.graphics({ x: x, y: y});
        this.background.fillStyle('0x302C2E', 1);
        this.background.fillRoundedRect(0, 0, w, h, 15);

        // Title
        this.title = new Text(
            this, x + 0.5*w, 207, 'Game Over', 'title'
        );

        this.txt_score = new Text(
            this, x + 0.5*w, y + 0.5*h, 'Wynik: ' + this.score
        )

        // Buttons

        this.createAllButtons(x, y, w, h);

    }

    createAllButtons(x, y, w, h)
    {
        // Go Menu

        this.btn_menu = this.createButton(
            x + 0.25*w, y + 0.85*h, this.clickMenu
        )

        //... Text for menu button
        
        this.lbl_menu = new Text(
            this,
            this.btn_menu.getData('centerX'),
            this.btn_menu.getData('centerY'),
            'Menu',
            'standard'
        )

        // Try Again

        this.btn_menu = this.createButton(
            x + 0.75*w, y + 0.85*h, this.clickTryAgain
        )

        //... Text for menu button
        
        this.lbl_menu = new Text(
            this,
            this.btn_menu.getData('centerX'),
            this.btn_menu.getData('centerY'),
            'Try Again',
            'standard'
        )

    }

    createButton()
    {

    }

    clickMenu()
    {

    }

    clickTryAgain()
    {
        
    }
}