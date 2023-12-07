import Phaser from 'phaser';
import './style.css';
import Boot from './scenes/boot'
import Preload from './scenes/preload'
import Menu from './ui/menu'
import Play from './scenes/play'
import GameOver from './scenes/gameover';
import playUI from './scenes/playUI';

export default class App {

    constructor() {
        this.VERSION = '0.0.2';
        this.IS_DEV = true;
    }

    start() {
            // SCENES
            let scenes = [];
        
            scenes.push(Boot);
            scenes.push(Preload);
            scenes.push(Menu);
            scenes.push(Play);
            scenes.push(GameOver);
            scenes.push(playUI);
            
            
            
            // GAME CONFIG
        const config = {
            type           : Phaser.AUTO,
            parent         : 'phaser-app',
            title          : 'Arkanoid',
            width          : 1920,
            height         : 1080,
            scene          : scenes,
            backgroundColor: 0x000000,
            pixelArt       : true,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 1200 },
                    // debug: true
                }
            },
            scale: {
                // mode: Phaser.Scale.LINEAR
                // autoCenter: Phaser.Scale.CENTER_BOTH
            }
        }

        // CREATE GAME APP

        let game = new Phaser.Game(config);
        game.scene.start('Boot', game);

        // GLOBAL VARIABLES

        game.IS_DEV = this.IS_DEV;
        game.VERSION = this.VERSION;

        game.CONFIG = {
            width   : config.width,
            height  : config.height,
            centerX : Math.round(0.5 * config.width),
            centerY : Math.round(0.5 * config.height),
            tile    : 32,
            map_offset: 4
        }
    
    // SOUND
    }
}