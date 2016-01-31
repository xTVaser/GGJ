//Create new instance of Phaser game and map the critical functions to functions in this file
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

//Assets are loaded here
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
  game.load.image('orb', 'assets/orbsprite.png');
}

var map, tileset, layer1, layer2;
var player;
var jumpTimer = 0;
var shootTimer = 0;
var cursors, shootButton;
var bg;
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

var nextFire = 0;
var fireRate = 100;

//Run when game launches, initialize variables and set everything
function create() {

  //Add mapping for space key to shoot
  shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  //Set up cursor keys (Up, Down, Left, Right)
  cursors = game.input.keyboard.createCursorKeys();

  //Initialize physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //Add the background sprite to the scene
  bg = game.add.tileSprite(0, 0, 10000, 600, 'background');

  //Fix the background sprite to the camera so it doesn't move
  bg.fixedToCamera = true;

  //Add the level 1 tilemap to the scene
  map = game.add.tilemap('level1');

  //Load the tilemap image
  map.addTilesetImage('tileset1');

  //Set the ID of tiles that have collision checks
  map.setCollisionByExclusion([3, 9, 12, 13, 15, 14, 16]);

  //Create ground collision layer from tile map
  layer = map.createLayer('ground');

  //Create grass collision layer from tile map
  layer2 = map.createLayer('grass');

  //Resize the world to the ground layer
  layer.resizeWorld();

  //Add the player to the scene at x:282 y:736
  player = game.add.sprite(282, 736, 'dude');

  //Set world gravityy
  game.physics.arcade.gravity.y = 450;

  //Enable physics for the player
  game.physics.enable(player, Phaser.Physics.ARCADE);

  //Set the bounce value for the player
  player.body.bounce.y = 0.2;

  //Make sure the player collides at the world bounds so they don't fall infinitely
  player.body.collideWorldBounds = true;

  //Set size of the player's hitbox
  player.body.setSize(20, 32, 5, 8);

  //Set the camera to follow the player
  game.camera.follow(player);

  //Add animations for the player sprite
  player.animations.add('left', [3, 2, 1, 0], 10, true);
  player.animations.add('turn', [4], 20, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  //Create group to hold all the enemies
  doods = game.add.group();

  //Enable hitboxes for the enemies
  doods.enableBody = true;

  //Set arcade physics for the enemies
  doods.physicsBodyType = Phaser.Physics.ARCADE;

  //Set all enemies to collide at world bounds
  doods.setAll('checkWorldBounds', true);

  //Enemies that collide with the world bounds are deleted since they will never make it back up
  doods.setAll('outOfBoundsKill', true);

  //Create 20 enemies
  for(var i = 0; i < 20; i++) {

    //Make an enemy at a random x value dependent on the current enemy, at y:700
    var dood = doods.create(i * 400, 700, 'enemy');

    //Make sure they collide with the world bound
    dood.body.collideWorldBound=true;

    //Set a bounce value of 0.2
    dood.body.bounce.y = 0.2;

    //Add enemy animations
    dood.animations.add('left', [3, 2, 1, 0], 10, true);
    dood.animations.add('turn', [4], 20, true);
    dood.animations.add('right', [5, 6, 7, 8], 10, true);
  }

  //Insert the power-ups into the world
  necklace = game.add.sprite(903, 550, 'necklace');
  feather = game.add.sprite(2205, 832, 'feather');
  voodoo = game.add.sprite(3840, 32, 'voodoo');
  medicinepouch = game.add.sprite(4875, 1220, 'medicinepouch');
  book = game.add.sprite(6753, 680, 'book');
  cauldron = game.add.sprite(9415, 736, 'cauldron');

  //Create cauldron animation
  cauldron.animations.add('play', [0, 1], 1, true);

  //Create witch sprite
  witch = game.add.sprite()

  //Enable physics for all the items (so they don't fall through the floor)
  //Also make sure they collide with the world bounds
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

  //Create a group to hold the orbs (bullets)
  orbs = game.add.group();

  //Enable hitboxes for the bullets
  orbs.enableBody = true;

  //Set arcade physics for the bullets
  orbs.physicsBodyType = Phaser.Physics.ARCADE;

  //Create 20 orbs and set all of them to check world bounds and to kill them when they do
  orbs.createMultiple(20, 'orb');
  orbs.setAll('checkWorldBounds', true);
  orbs.setAll('outOfBoundsKill', true);
}

//This function runs every frame. Check variables and collisions in here
function update() {

  //Reset player movement so they remain at a constant speed
  player.body.velocity.x = 0;

  //Set the enemies to collide with the ground layer (so they don't fall through the ground)
  game.physics.arcade.collide(doods, layer);
  game.physics.arcade.collide(player, layer);

  //Play the cauldron and witch animations every frame
  cauldron.animations.play('play');
  witch.animations.play('play');

  //Set the power-ups to collide with the ground layer
  game.physics.arcade.collide(necklace, layer);
  game.physics.arcade.collide(feather, layer);
  game.physics.arcade.collide(voodoo, layer);
  game.physics.arcade.collide(medicinepouch, layer);
  game.physics.arcade.collide(book, layer);

  //Check if player has touched the necklace powerup
  if (game.physics.arcade.collide(player, necklace) == true) {

    //Destroy the necklace
    necklace.destroy(true);

    //Set the boolean flag so we know the player has collected this power up
    neckPickup = true;

    //Display a text message on the screen informing the player of their new power
    writeText('Necklace picked up! You can shoot orbs now! Press Spacebar to use.');
  }

  //Check if the player has touched the feather powerup
  if (game.physics.arcade.collide(player, feather) == true) {
    feather.destroy(true);
    feaPickup = true;

    writeText('Feather picked up! You can now jump higher!');
  }

  //Check if the player has gathered the voodoo doll powerup
  if (game.physics.arcade.collide(player, voodoo) == true) {
    voodoo.destroy(true);
    vooPickup = true;
    player_damage++;

    writeText('Voodoo doll picked up! You deal more damage now!');
  }

  //Check if the player has gathered the medicine pouch powerup
  if (game.physics.arcade.collide(player, medicinepouch) == true) {
    medicinepouch.destroy(true);
    medPickup = true;
    player_health++;

    writeText('Medicine Pouch picked up! Your health pool has doubled!');
  }

  //Check if the player has gathered the book powerup
  if (game.physics.arcade.collide(player, book) == true) {
    book.destroy(true);
    bookPickup = true;

    witch = game.add.sprite(9435, 705, 'witch');
    witch.scale.setTo(1.5);
    witch.animations.add('play', [0, 1], 1, true);
    witch.body.collideWorldBounds = true;

    writeText('Book picked up! The witch has been notified of your presence...');
  }

  //If the witch has collided with any orbs, subtract player_damage from her health
  if (game.physics.arcade.collide(witch, orbs) == true) {
    witch_health -= player_damage;
  }

  //If player is dead, respawn at the start position and reset their health
  if (player_health == 0) {
    player.body.x = 280;
    player.body.y = 700;
    player_health = 1;
  }

  //Check if witch is dead
  if (witch_health == 0) {

    //Destroy the witch
    witch.destroy(true);

    //Inform player they won game
    writeText("Congratulations! You Win!");
  }

  //Check for powerups
  if (neckPickup == true)
  {
    gun = true;
    player_damage = 50;
  }

  if (feaPickup == true)
  {
    game.physics.arcade.gravity.y = 300;
  }


  //Check if player fell off the map
  if (player.body.y > 900) {
    //Reset player back to starting position
    player.x = 280;
    player.y = 700;
  }

  //If left key is pressed, move left
  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
    player.animations.play('left');
  }

  //If right key is pressed, move right
  else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
    player.animations.play('right');
  }

  //Not moving
  else {
    //Stop animation
    player.animations.stop();

    //If player moving left, show left frame
    if (player.body.velocity.x < 0) {
      player.frame = 0;
    } else  if (player.body.velocity.x > 0){ //Otherwise show right frame
      player.frame = 5;
    }
  }

  //This checks if the up arrow is pressed, the player is touching the floor,
  //and you haven't already jumped recently, it jumps and resets the timer
  if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
    player.body.velocity.y = -250;
    jumpTimer = game.time.now + 750;
  }

  //Space button is pressed, player has orb powerup, hasn't fired recently
  if (neckPickup && shootButton.isDown && game.time.now > shootTimer) {

    //Reset shot timer
    shootTimer = game.time.now + 750;

    //Shoot an orb
    fire();
  }

  //Instructions for each enemy in the group
  doods.forEach(function(dood) {

    //Follow the player at speed 10
    game.physics.arcade.moveToObject(dood, player, 10);

    //Call the playerHitEnemy whenever a player hits this enemy
    game.physics.arcade.collide(player, doods, playerHitEnemy, null, this);

    //Points the enemy in the direction it is travelling
    if (dood.body.velocity.x < 0) {
      //Left animation
      dood.animations.play('left');
    } else if (dood.body.velocity.x > 0) {
      //Right animation
      dood.animations.play('right');
    }

    //Check if any bullets have hit us
    if (game.physics.arcade.collide(dood, orbs) == true) {
      dood.destroy(true);
    }
  })
}

//This is called every frame, use this to draw things not automatically drawn
function render() {
  //Writes the player sprite object information to the screen for debugging
  game.debug.bodyInfo(player, 16, 24);
}

//Called when the player fires a bullet
function fire() {
  if (game.time.now > nextFire && orbs.countDead() > 0)
  {
    //Calculates the next point in time you are allowed to shoot by adding
    //Fire rate to the current time
    nextFire = game.time.now + fireRate;

    //Grabs the next available orb from the group of orbs
    var orb = orbs.getFirstDead();

    //Sets the orb's position to the player's position
    orb.reset(player.x - 8, player.y - 8);

    //If the player is moving right, launch the orb right
    if (player.body.velocity > 0) {
      orb.body.velocity.x = 400;

    } //Otherwise, launch the orb to the left
    else if (player.body.velocity < 0){
      orb.body.velocity.x = -400;
    }
  }
}

//If the player runs into an enemy, decrease health. At first this will
//instantly kill the player as they only have 1 health point. However, after
//gathering an item they receive more health points.
function playerHitEnemy() {
  player_health--;
}

//Writes a message to the screen
function writeText(msg) {
  text = game.add.text(game.camera.width/2, game.camera.height/2, msg);
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
