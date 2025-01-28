// Name: Brandon Apuntar
// Mod Title: Rocket Patrol Plus
// Approximate time: 5 hours
// Mods: New Spaceship (5pts), Particle Emitter (5pts), Enemy ship animation (3pts), New menu screen (3pts),
// Countdown timer (3pts), Move while firing (1pt)

// Citations:
// samme countdown timer from:
// https://phaser.discourse.group/t/countdown-timer/2471/9
// Particle system inspiration from:
// https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\emit%20at%20pointer.js
// adapted to use with .explode 
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config)

//reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

//set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3



