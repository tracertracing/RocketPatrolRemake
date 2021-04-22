class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('starfield', 'Assets/starfield.png');
        this.load.image('rocket', 'Assets/rocket.png');
        this.load.image('spaceship', 'Assets/spaceship.png');
        this.load.image('newShip', 'Assets/newship.png');
        this.load.spritesheet('explosion', './Assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio('sfx_explosion', './Assets/explosion38.wav');
        this.load.audio('sfx_rocket', './Assets/rocket_shot.wav');
        this.load.audio('sfx_music', './Assets/ES_Let It All Go - Rospigg.mp3');
    }

    create() {

        this.gameOver = false;

        //this.p1Score = 0;

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.starfield = this.add.tileSprite(
            0,0,640,480, 'starfield'
        ).setOrigin(0,0);

        this.p1Rocket = new Rocket(
            this,
            game.config.width / 2,
            game.config.height - borderUISize - borderPadding,
            'rocket'
        );

        this.ship1 = new Ship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship2 = new Ship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship3 = new Ship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship4 = new newShip(this, game.config.width, borderUISize * 5 + borderPadding * 5, 'newShip', 0, 100).setOrigin(0,0);
        //this.ship1 = new Ship(this, 100, 120, 'spaceship', 0, 1).setOrigin(0,0);
        //this.ship2 = new Ship(this, 200, 200, 'spaceship', 0, 1).setOrigin(0,0);
        //this.ship3 = new Ship(this, 300, 240, 'spaceship', 0, 1).setOrigin(0,0);


        // green UI background
        this.add.rectangle(
            0,
            borderUISize + borderPadding,
            game.config.width,
            borderUISize * 2,
            0x00FF00,
            ).setOrigin(0,0);

        // white borders
	    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
	    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // scoreboard
        this.p1Score = 0;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
          };

          let musicConfig = {
            mute: false,
            volume: 0.25,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
          }

          this.music = this.sound.add('sfx_music');
            this.music.play(musicConfig);

        this.scoreLeft = this.add.text(borderUISize+borderPadding, borderUISize+borderPadding*2, this.p1Score, scoreConfig);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        this.starfield.tilePositionX -= 4;
        
        if(!this.gameOver) {
            this.p1Rocket.update();
            this.ship1.update();
            this.ship2.update();
            this.ship3.update();
            this.ship4.update();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship4)) {
            this.p1Rocket.reset();
            this.destroyShip(this.ship4);
        }   
        if(this.checkCollision(this.p1Rocket, this.ship3)) {
            this.p1Rocket.reset();
            this.destroyShip(this.ship3);
        }
        if (this.checkCollision(this.p1Rocket, this.ship2)) {
            this.p1Rocket.reset();
            this.destroyShip(this.ship2);
        }
        if (this.checkCollision(this.p1Rocket, this.ship1)) {
            this.p1Rocket.reset();
            this.destroyShip(this.ship1);
        }
        
        //let r = this.p1Rocket;
       // for(let s of [this.ship1, this.ship2, this.ship3]) {
            //if(r.x < s.x + s.width &&
               //r.x + r.width > s.x &&
               //r.y < s.y + s.height &&
              // r.y + r.height > s.y) {
                   //this.r.reset();
                  // this.destroyShip(s);
              // }
       // }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    destroyShip(ship) {
        //this.sound.play('sfx_explosion');
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion');
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p1Score += ship.point;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}