class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0)
        // mint UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xDDFFDD).setOrigin(0,0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        
        //add 3x spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceships1', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceships1', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceships1', 0, 10).setOrigin(0,0)

        this.ship01.play('fly');
        this.ship02.play('fly');
        this.ship03.play('fly');
        
        // add Stinky ship

        this.stinkyship = new Stinky(this, game.config.width + borderUISize*3, borderUISize*4 + borderPadding*2, 'stinky', 0, 40).setOrigin(0,0)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // particle system

        this.emitter = this.add.particles(0, 0, 'fire', {
            frame: ['red'],
            lifespan: 4000,
            speed: {
                min: 0, max: 50
            },
            scale: {
                start: 3,
                end: 0
            },

            emitting: false
        });

        // initialize score
        this.p1Score = 0
        // display score
        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            backgroundColor: '#B43757',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        // GAME OVER flag
        this.gameOver = false

        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or < for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)

        //timer
        this.timer = this.time.addEvent({
            delay: game.settings.gameTimer,
            paused: false
        });
        this.timetext = this.add.text(32,30)

    }

    update() {

        // update timer
        this.timetext.setText(`Time: ${this.timer.getRemainingSeconds().toFixed(1)}`);

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        this.starfield.tilePositionX -= 4

        this.p1Rocket.update()

        this.ship01.update()               // update spaceships (x4)
        this.ship02.update()
        this.ship03.update()
        this.stinkyship.update()

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
            this.party(this.ship03)   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
            this.party(this.ship02) 
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
            this.party(this.ship01) 
        }

        if (this.checkStinkyCollision(this.p1Rocket, this.stinkyship)) {
            this.p1Rocket.reset()
            this.stinkyshipExplode(this.stinkyship)
            this.stinkyparty(this.stinkyship)

        }

        if(!this.gameOver) {               
            this.p1Rocket.update()         // update rocket sprite
            this.ship01.update()           // update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
            this.stinkyship.update()
        } 
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true
        } else {
          return false
        }
    }

    checkStinkyCollision(rocket, stinkyship) {
        // simple AABB checking
        if (rocket.x < stinkyship.x + stinkyship.width && 
          rocket.x + rocket.width > stinkyship.x && 
          rocket.y < stinkyship.y + stinkyship.height &&
          rocket.height + rocket.y > stinkyship. y) {
          return true
        } else {
          return false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')           // play explode animation
        boom.on('animationcomplete', () => { // callback after ani completes
          ship.reset()                       // reset ship position
          ship.alpha = 1                     // make ship visible again
          boom.destroy()                     // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        this.sound.play('sfx-explosion')       
    }

    party(ship) {
        this.emitter.explode(40, ship.x, ship.y)
    }

    stinkyparty(stinkyship) {
        this.emitter.explode(200, this.stinkyship.x, this.stinkyship.y)
    }

    stinkyshipExplode(stinkyship) {
        // temporarily hide ship
        stinkyship.alpha = 0                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(stinkyship.x, stinkyship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')           // play explode animation
        boom.on('animationcomplete', () => { // callback after ani completes
          stinkyship.reset()                       // reset ship position
          stinkyship.alpha = 1                     // make ship visible again
          boom.destroy()                     // remove explosion sprite
        })

        // score add and text update
        this.p1Score += stinkyship.points
        this.scoreLeft.text = this.p1Score
        this.sound.play('sfx-explosion')       
    }
    
}

