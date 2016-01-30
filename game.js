var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
        preload: preload,
        create: create,
        update: update,
        render: render
});

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
        game.load.spritesheet('cauldron', 'assets/cauldronset.png', 19, 29);
        game.load.spritesheet('witch', 'assets/witchset.png', 25.5, 40);
}

var map, tileset, layer1, layer2;
var player, dood;
var facing = 'left';
var jumpTimer = 0;
var shootTimer = 0;
var cursors, shootButton;
var bg;
var deathPlane;
var neckPickup;
var feaPickup;
var vooPickup;
var medPickup;
var bookPickup;
var gunDamage;
var gun;
var player_health = 1;
var player_damage = 1;

var witch_health = 10;

var feather, book, medicinepouch, necklace, voodoo;
var cauldron;
var item;
var sodaItem;
var sodaPicked;
var text;
var feaText;
var vooText;
var medText;
var bookText;

var witch;


function create() {
        shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        cursors = game.input.keyboard.createCursorKeys();

        game.physics.startSystem(Phaser.Physics.ARCADE);

        bg = game.add.tileSprite(0, 0, 10000, 600, 'background');
        bg.fixedToCamera = true;

        map = game.add.tilemap('level1');

        map.addTilesetImage('tileset1');

        map.setCollisionByExclusion([3, 9, 12, 13, 15, 14, 16]);

        layer = map.createLayer('ground');
        layer2 = map.createLayer('grass');

        //  Un-comment this on to see the collision tiles
        //player.debug = true;

        layer.resizeWorld();

        player = game.add.sprite(282, 736, 'dude');
        game.physics.arcade.gravity.y = 450;

        game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        player.body.setSize(20, 32, 5, 8);

        game.camera.follow(player);

        player.animations.add('left', [3, 2, 1, 0], 10, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        dood = game.add.sprite(400, 736, 'enemy');
        game.physics.enable(dood, Phaser.Physics.ARCADE);

        dood.body.bounce.y = 0.2;
        dood.body.collideWorldBounds = true;
        dood.body.setSize(20, 32, 5, 10);
        dood.animations.add('left', [3, 2, 1, 0], 10, true);
        dood.animations.add('turn', [4], 20, true);
        dood.animations.add('right', [5, 6, 7, 8], 10, true);

        necklace = game.add.sprite(903, 550, 'necklace');
        feather = game.add.sprite(2205, 832, 'feather');
        voodoo = game.add.sprite(3840, 32, 'voodoo');
        medicinepouch = game.add.sprite(4875, 1220, 'medicinepouch');
        book = game.add.sprite(6753, 680, 'book');
        cauldron = game.add.sprite(9415, 736, 'cauldron');

        cauldron.animations.add('play', [0, 1], 1, true);

        witch = game.add.sprite()

        game.physics.enable(necklace, Phaser.Physics.ARCADE);
        necklace.body.collideWorldBounds = true;

        game.physics.enable(feather, Phaser.Physics.ARCADE);
        feather.body.collideWorldBounds = true;

        game.physics.enable(voodoo, Phaser.Physics.ARCADE);
        voodoo.body.collideWorldBounds = true;

        game.physics.enable(medicinepouch, Phaser.Physics.ARCADE);
        medicinepouch.body.collideWorldBounds = true;

        game.physics.enable(book, Phaser.Physics.ARCADE);
        book.body.collideWorldBounds = true;
}

function update() {

    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(dood, layer);

    cauldron.animations.play('play');
    witch.animations.play('play');

    game.physics.arcade.collide(necklace, layer);
    game.physics.arcade.collide(feather, layer);
    game.physics.arcade.collide(voodoo, layer);
    game.physics.arcade.collide(medicinepouch, layer);
    game.physics.arcade.collide(book, layer);

    if (game.physics.arcade.collide(player, necklace) == true) {
            necklace.destroy(true);
            neckPickup = true;

            text = game.add.text(game.camera.width/2, game.camera.height/2, 'Necklace picked up! You can shoot orbs now! Press Spacebar to use.');
            text.anchor.setTo(0.5, 0.5);
            text.fixedToCamera = true;
            text.font = 'Arial Black';
            text.fontSize = 14;
            text.fontWeight = 'bold';
            text.fill = '#ff00ff';

            setTimeout(function(){
              text.destroy(true);
            }, 3000);

    }

    if (game.physics.arcade.collide(player, feather) == true) {
            feather.destroy(true);
            feaPickup = true;

            text = game.add.text(game.camera.width/2, game.camera.height/2, 'Feather picked up! You can now jump higher!');
            text.anchor.setTo(0.5, 0.5);
            text.fixedToCamera = true;
            text.font = 'Arial Black';
            text.fontSize = 14;
            text.fontWeight = 'bold';
            text.fill = '#ff00ff';

            setTimeout(function(){
              text.destroy(true);
            }, 3000);
    }


    if (game.physics.arcade.collide(player, voodoo) == true) {
            voodoo.destroy(true);
            vooPickup = true;
            player_damage++;

            text = game.add.text(game.camera.width/2, game.camera.height/2, 'Voodoo doll picked up! You deal more damage now!');
            text.anchor.setTo(0.5, 0.5);
            text.fixedToCamera = true;
            text.font = 'Arial Black';
            text.fontSize = 14;
            text.fontWeight = 'bold';
            text.fill = '#ff00ff';

            setTimeout(function(){
              text.destroy(true);
            }, 3000);
    }

    if (game.physics.arcade.collide(player, medicinepouch) == true) {
            medicinepouch.destroy(true);
            medPickup = true;
            player_health++;

            text = game.add.text(game.camera.width/2, game.camera.height/2, 'Medicine Pouch picked up! Your health pool has doubled!');
            text.anchor.setTo(0.5, 0.5);
            text.fixedToCamera = true;
            text.font = 'Arial Black';
            text.fontSize = 14;
            text.fontWeight = 'bold';
            text.fill = '#ff00ff';

            setTimeout(function(){
              text.destroy(true);
            }, 3000);
    }

    if (game.physics.arcade.collide(player, book) == true) {
            book.destroy(true);
            bookPickup = true;

            witch = game.add.sprite(9435, 705, 'witch');
            witch.scale.setTo(1.5);
            witch.animations.add('play', [0, 1], 1, true);

            text = game.add.text(game.camera.width/2, game.camera.height/2, 'Book picked up! The witch has been notified of your presence...');
            text.anchor.setTo(0.5, 0.5);
            text.fixedToCamera = true;
            text.font = 'Arial Black';
            text.fontSize = 14;
            text.fontWeight = 'bold';
            text.fill = '#ff00ff';

            setTimeout(function(){
              text.destroy(true);
            }, 3000);
    }

        //If player is dead, respawn
	if (player_health == 0) {
		player.body.x = 280;
		player.body.y = 736;
		player_health = 1;

		//Move enemy back to start position
		dood.body.x = 400;
		dood.body.y = 736;
	}

            //Check enemy collision
    if (game.physics.arcade.collide(player, dood) == true) {
    	//Ayy hit player lmao
    	player_health--;
    }


    if (neckPickup == true)
    {
      gun = true;
      player_damage = 50;
    }

    if (feaPickup == true)
    {
      game.physics.arcade.gravity.y = 300;
    }

    player.body.velocity.x = 0;

        //Check if too low
        if (player.body.y > 1400) {
                //die
                player.x = 280;
                player.y = 700;
        }

        //Move Left
        if (cursors.left.isDown) {
                player.body.velocity.x = -150;


                if (facing != 'left') {
                        player.animations.play('left');
                        facing = 'left';
                }
        }

        //Move right
        else if (cursors.right.isDown) {
                player.body.velocity.x = 150;

                if (facing != 'right') {
                        player.animations.play('right');
                        facing = 'right';
                }
        }

        //Not moving
        else {
                if (facing != 'idle') {
                        player.animations.stop();

                        if (facing == 'left') {
                                player.frame = 0;
                        } else {
                                player.frame = 5;
                        }

                        facing = 'idle';
                }
        }

        //Jump
        if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
                player.body.velocity.y = -250;
                jumpTimer = game.time.now + 750;
        }

        //shoot
        if (shootButton.isDown && game.time.now > shootTimer) {
                //player.body.velocity.y = -250;
                shootTimer = game.time.now + 750;
        }

        //Enemy follow player
        game.physics.arcade.moveToObject(dood, player, 10);

        //Check enemy direction for animation purposes
        if (dood.body.velocity.x < 0) {
                //Left animation
                dood.animations.play('left');
        } else if (dood.body.velocity.x > 0) {
                //Right animation
                dood.animations.play('right');
        }
}

function render() {

        // game.debug.text(game.time.physicsElapsed, 32, 32);
        //game.debug.body(player);
        game.debug.bodyInfo(player, 16, 24);
        //game.debug.text(player.x, 32, 32);
        //game.debug.text(player.y, 32, 45);

}
