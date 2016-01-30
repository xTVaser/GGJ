var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset1', 'assets/tileset1.png');
    game.load.spritesheet('dude', 'assets/guyset1.png', 32, 40);
    game.load.spritesheet('enemy', 'assets/enemytileset.png', 32, 40);
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
    game.load.image('background', 'assets/tilebackground.png');
    game.load.image('feather', 'assets/feathersprite.png');
    game.load.image('book', 'assets/booksprite.png');
    game.load.image('medicinepouch', 'assets/medicinepouchsprite.png');
    game.load.image('necklace', 'assets/necklacesprite.png');
    game.load.image('voodoo', 'assets/voodoosprite.png');
    game.load.image('background', 'assets/background2.png');


}

var map;
var tileset;
var layer1;
var layer2;
var player, dood;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var deathPlane;
var neckPickup;
var feaPickup;
var vooPickup;
var medPickup;
var bookPickup;

var feather, book, medicinepouch, necklace, voodoo;
var item;
var sodaItem;
var sodaPicked;

function create() {
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    bg = game.add.tileSprite(0, 0, 10000, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tileset1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('ground');
    layer2 = map.createLayer('grass');

    //  Un-comment this on to see the collision tiles
    //player.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 450;

    player = game.add.sprite(200, 585, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 8);

    player.animations.add('left', [3, 2, 1, 0], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    dood = game.add.sprite(200, 0, 'enemy');
    game.physics.enable(dood, Phaser.Physics.ARCADE);

    dood.body.bounce.y = 0.2;
    dood.body.collideWorldBounds = true;
    dood.body.setSize(20, 32, 5, 10);

    dood.animations.add('left', [3, 2, 1, 0], 10, true);
    dood.animations.add('turn', [4], 20, true);
    dood.animations.add('right', [5, 6, 7, 8], 10, true);
    game.camera.follow(player);

    //addSprite(903,544,'necklace',necklace,20,32,5,8);
    necklace = game.add.sprite(903,544,'necklace');
    game.physics.enable(necklace, Phaser.Physics.ARCADE);
    necklace.body.collideWorldBounds = true;
    //addSprite(2200,810,'feather',feather,20,32,5,8);
    feather = game.add.sprite(2200,810,'feather');
    game.physics.enable(feather, Phaser.Physics.ARCADE);
    feather.body.collideWorldBounds = true;
    //addSprite(3850,32,'voodoo',voodoo,20,32,5,8);
    voodoo = game.add.sprite(3850,32,'voodoo');
    game.physics.enable(voodoo, Phaser.Physics.ARCADE);
    voodoo.body.collideWorldBounds = true;
    //addSprite(4875,1216,'medicinepouch',medicinepouch,20,32,5,8);
    medicinepouch = game.add.sprite(4875,1216,'medicinepouch');
    game.physics.enable(medicinepouch, Phaser.Physics.ARCADE);
    medicinepouch.body.collideWorldBounds = true;
    //addSprite(6753,672,'book',book,20,32,5,8);
    book = game.add.sprite(6753,672,'book');
    game.physics.enable(book, Phaser.Physics.ARCADE);
    book.body.collideWorldBounds = true;
}

function addSprite(x, y, sprite, variable, sizeX, sizeY, sizeX2, sizeY2) {
        variable = game.add.sprite(x, y, sprite);


        variable.body.bounce.y = 0.2;
        variable.body.collideWorldBounds = true;
        variable.body.setSize(sizeX, sizeY, sizeX2, sizeY2);
}
function update() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(dood, layer);
    game.physics.arcade.collide(necklace, layer);
    game.physics.arcade.collide(feather, layer);
    game.physics.arcade.collide(voodoo, layer);
    game.physics.arcade.collide(medicinepouch, layer);
    game.physics.arcade.collide(book, layer);

    if (game.physics.arcade.collide(player, necklace) == true)
    {
      necklace.destroy(true);
      neckPickup = true;
    }

    if (game.physics.arcade.collide(player, feather) == true)
    {
      feather.destroy(true);
      feaPickup = true;
    }

    if (game.physics.arcade.collide(player, voodoo) == true)
    {
      voodoo.destroy(true);
      vooPickup = true;
    }

    if (game.physics.arcade.collide(player, medicinepouch) == true)
    {
      medicinepouch.destroy(true);
      medPickup = true;
    }

    if (game.physics.arcade.collide(player, book) == true)
    {
      book.destroy(true);
      bookPickup = true;
    }

    player.body.velocity.x = 0;

    //Check if too low
    if (player.body.y > 1400) {
        //die
        player.x = 200;
        player.y = 120;
    }

    //Move Left
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        txt = game.add.sprite(game.camera.width -50, game.camera.height -50, 'dude');
        txt.anchor.setTo(0.5, 0.5);
        txt.fixedToCamera = true;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }

    //Move right
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }

    //Not moving
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

    //Jump
    if ((jumpButton.isDown || cursors.up.isDown) && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
     game.debug.body(player);
     game.debug.bodyInfo(player, 16, 24);
    game.debug.text(player.x, 32, 32);
    //game.debug.text(player.y, 32, 45);

}
