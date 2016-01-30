var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset1', 'assets/tileset1.png');
    game.load.spritesheet('dude', 'assets/guyset1.png', 32, 40);
    game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
    game.load.image('background', 'assets/background2.png');

}

var map;
var tileset;
var layer1;
var layer2;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var deathPlane;

function create() {
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();

    var _container = game.add.sprite(0,0);
    var deathPlane = game.add.graphics(game.width, game.height);
    deathPlane.beginFill(0,0);
    deathPlane.x = 0;
    deathPlane.y = 0;
    deathPlane.drawRect(0,0,100,100);
    _container.width = 100;
    _container.height = 100;
    _container.addChild(deathPlane);
    game.physics.enable(_container, Phaser.Physics.ARCADE);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tileset1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('ground');
    layer2 = map.createLayer('grass');

    //  Un-comment this on to see the collision tiles
    layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 600;

    player = game.add.sprite(200, 0, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 10);

    player.animations.add('left', [3, 2, 1, 0], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);



    game.camera.follow(player);




}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(player, deathPlane);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        txt = game.add.sprite(game.camera.width -50, game.camera.height -50, 'dude');txt.anchor.setTo(0.5, 0.5);txt.fixedToCamera = true;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
