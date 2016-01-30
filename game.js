var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/cutie.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/guyset2.png', 32, 48);
    game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    game.load.spritesheet('soda', 'assets/Sprite-Soda.png', 16,30 );
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
<<<<<<< HEAD
    game.load.image('background', 'assets/tilebackground.png');
    game.load.image('feather', 'assets/feathersprite.png');
    game.load.image('book', 'assets/booksprite.png');
    game.load.image('medicinepouch', 'assets/medicinepouchsprite.png');
    game.load.image('necklace', 'assets/necklacesprite.png');
    game.load.image('voodoo', 'assets/voodoosprite.png');
=======
    game.load.image('background', 'assets/background2.png');
>>>>>>> a9061ba202848bd8270540919a52439d81dfea28

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
<<<<<<< HEAD
var deathPlane;

var feather, book, medicinepouch, necklace, voodoo;
=======
var item;
var sodaItem;
var sodaPicked;
>>>>>>> a9061ba202848bd8270540919a52439d81dfea28

function create() {
jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
cursors = game.input.keyboard.createCursorKeys();
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    //  layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 0;

    player = game.add.sprite(2212, 850, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    item = game.add.sprite(330, 585, 'soda');
    game.physics.enable(item, Phaser.Physics.ARCADE);
    item.body.collideWorldBounds = true;

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [3, 2, 1, 0], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //txt = game.add.sprite(game.camera.width -50, game.camera.height -50, 'dude');txt.anchor.setTo(0.5, 0.5);txt.fixedToCamera = true;

    game.camera.follow(player);

    addSprite(903,544,'necklace',necklace,20,32,5,8);
    addSprite(2200,810,'feather',feather,20,32,5,8);
    addSprite(3850,32,'voodoo',voodoo,20,32,5,8);
    addSprite(4875,1216,'medicinepouch',medicinepouch,20,32,5,8);
    addSprite(6753,672,'book',book,20,32,5,8);

    variable = game.add.sprite(x, y, sprite);

    variable.body.collideWorldBounds = true;
    variable.body.setSize(sizeX, sizeY, sizeX2, sizeY2);
}

function addSprite(x, y, sprite, variable, sizeX, sizeY, sizeX2, sizeY2) {
        variable = game.add.sprite(x, y, sprite);

        variable.body.collideWorldBounds = true;
        variable.body.setSize(sizeX, sizeY, sizeX2, sizeY2);
}
function update() {

    var itemPickup1 = false;

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(item, layer);

    //Reset player velocity every frame
    player.body.velocity.x = 0;

    //Check if too low
    if (game.physics.arcade.collide(player, item) == true)
    {
      item.destroy(true);
      sodaPicked = true;
    }
    //Check if player is too low
    if (player.body.y > 1600) {
        //die
        player.x = 200;
        player.y = 120;
    }

    /*if (itemPickup1 == true)
    {

    }*/

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

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
