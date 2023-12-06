import Text from "../ui/text";

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'GameOver', active: false});
    }

    init(data)
    {
        //Score data passed from 'Play' scene
        this.score = data.score;

        this.CONFIG = this.game.CONFIG;
    }

    create()
    {
        //Background

        let x = this.CONFIG.tile;
        let w = this.CONFIG.width - 30*x;
        let marginX = this.CONFIG.width/2 - w/2 - this.CONFIG.tile;

        let h = this.CONFIG.height/2;
        let y = 148;

        this.background = this.add.graphics({ x: x, y: y});
        this.background.fillStyle('0x302C2E', 1);
        this.background.fillRoundedRect(marginX, 0, w - x, h, 15);

        // Title
        this.title = new Text(
            this, marginX + 0.5*w, 207, 'Game Over', 'title', 0
        );

        this.title.setOrigin(0.5, 0.5)

        this.txt_score = new Text(
            this, marginX + 0.5*w, y + 0.5*h, 'Wynik: ' + this.score, 'title', 0
        )

        this.txt_score.setOrigin(0.5, 0.5)

        // Buttons

        this.createAllButtons(marginX, y, w, h);

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
            x + 0.25*w, 
            y + 0.85*h,
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
            x + 0.75*w,
            y + 0.85*h,
            '↻',
            'standard'
        )

    }

    createButton(centerX, centerY, callback)
    {
        let w = 4.5 * this.CONFIG.tile;
        let h = 2 * this.CONFIG.tile;
        let r = 10;

        let x = centerX - 0.5*w;
        let y = centerY - 0.5*h

        let btn = this.add.graphics({ x: x, y: y })
        btn.fillStyle('0x39314B', 1);
        btn.fillRoundedRect(0, 0, w, h, r);

        let hit_area = new Phaser.Geom.Rectangle(0, 0, w, h);
        btn.setInteractive(hit_area, Phaser.Geom.Rectangle.Contains);

        btn.myDownCallback = () =>
        {
            btn.clear();
            btn.fillStyle('0x827094', 1);
            btn.fillRoundedRect(0, 0, w, h, r);
        }

        btn.myOutCallback = () =>
        {
            btn.clear();
            btn.fillStyle('0x39314B', 1);
            btn.fillRoundedRect(0, 0, w, h, r);
        }

        btn.on('pointerup', callback, this);
        btn.on('pointerdown', btn.myDownCallback, this);
        btn.on('pointerout', btn.myOutCallback, this);

        //
        return btn;
    }

    clickMenu()
    {
        this.events.emit('clickMenu');
    }

    clickTryAgain()
    {
        this.events.emit('clickTryAgain');
    }
}