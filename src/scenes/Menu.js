class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('stinky', './assets/stinky.png')
        this.load.image('starfield', './assets/starfield.png')
        this.load.image('fire', './assets/fire.png')

        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })

        //spaceships spritesheet
        this.load.spritesheet('spaceships1', './assets/spaceships1.png', {
          frameWidth: 64,
          frameHeight: 32,
          startFrame: 0,
          endframe: 2
        })

        //load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-shot', './assets/sfx-shot.wav')
    }

    create() {
        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        })

        //spaceship animation config
        this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('spaceships1', { start: 0, end: 2, first: 0}),
          frameRate: 30,
          repeat: -1
        })

        let menuConfig = {
            fontFamily: 'Arial',
            fontSize: '30px',
            backgroundColor: '#B43757',
            color: '#F6FAF7',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        let otherConfig = {
          fontFamily: 'Arial',
          fontSize: '20px',
          backgroundColor: '#98FCBC',
          color: '#000000',
          align: 'right',
          padding: {
          top: 5,
          bottom: 5,
          },
          fixedWidth: 0
      }

        // new menu
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL+', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, 'Use (<-) (->) arrows to move & (F) to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#00FF00'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, '(<-) Easy | MODE | Expert (->)', otherConfig).setOrigin(0.5)
        
        //menu spaceships
        this.add.image(100, 100, 'spaceships1')
        this.add.image(150, 400, 'spaceships1')
        this.add.image(400, 70, 'spaceships1')
        this.add.image(300, 390, 'stinky')
        this.add.image(450, 380, 'spaceships1')



        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            stinkyshipSpeed: 5,
            gameTimer: 60000    
          }
          this.sound.play('sfx-select')
          this.scene.start('playScene')    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            stinkyshipSpeed: 7,
            gameTimer: 45000    
          }
          this.sound.play('sfx-select')
          this.scene.start('playScene')    
        }
    }

}