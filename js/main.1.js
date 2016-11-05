/// <reference path="./typings/phaser/phaser.d.ts" />
/// <reference path="./typings/phaser/box2d.d.ts" />
/// <reference path="./typings/phaser/p2.d.ts" />
/// <reference path="./typings/phaser/phaser_box2d.d.ts" />
/// <reference path="./typings/phaser/phaser.comments.d.ts" />
/// <reference path="./typings/phaser/pixi.d.ts" />
/// <reference path="./typings/phaser/pixi.comments.d.ts" />

var kGAME_HEIGHT = 450;
var kGAME_WIDTH = 600;
var kMAP_TILE_HEIGHT = 20;
var kMAP_TILE_WIDTH = 25;
var kMAP_SEGMENT_HEIGHT = 32;
var kMAP_SEGMENT_WIDTH = 32;
var kGAME_BOUNDS_X = kMAP_SEGMENT_WIDTH * kMAP_TILE_WIDTH; 
var kGAME_BOUNDS_Y = kMAP_SEGMENT_HEIGHT * kMAP_TILE_HEIGHT;

var kCHAR_OLOF_HEIGHT = 32; 
var kCHAR_OLOF_WIDTH = 32; 

var _game = new Phaser.Game(kGAME_WIDTH, kGAME_HEIGHT, Phaser.AUTO, '', {preload:preload, create:create, update:update, render:render}); 
var _olof; 
var _cursors; 

function preload(){
    // Tile map 01 
    _game.load.tilemap('tile_map_01', 'assets/scene_01/scene_01.json', null, Phaser.Tilemap.TILED_JSON);
    _game.load.image('tiles_01', 'assets/tiles_01.png');
    
    // Characters 
    // _game.load.tilemap('chars_map_01', 'assets/characters/chars_test.json', null, Phaser.Tilemap.TILED_JSON);
    // _game.load.image('chars_image_01', 'assets/chars_01.png');
    // _game.load.image('olof_sprite', 'assets/chars_olof.png');

    _game.load.spritesheet('olof_sprite', 'assets/chars_02.png', 32, 32);

}

var paleGrass;

function create(){
    // _game.camera.deadzone = new Phaser.Rectangle(200,380,1,1);
    _game.physics.startSystem(Phaser.Physics.ARCADE); 
    
    var map = _game.add.tilemap('tile_map_01', kMAP_TILE_WIDTH, kMAP_TILE_HEIGHT, kMAP_SEGMENT_WIDTH, kMAP_SEGMENT_HEIGHT);
    map.addTilesetImage('tile_map_01', 'tiles_01');
    map.createLayer('Background');
    paleGrass = map.createLayer('PaleGrass');
    paleGrass.debug =true; 
    var pathLayer = map.createLayer('Path');
    pathLayer.debug = true;
    map.setCollisionByExclusion([], true, paleGrass);
    //map.setCollisionBetween(1, 10000, true, pathLayer);
    
    _olof = new Phaser.Sprite(_game, 0, 0, 'olof_sprite'); 
    
    _olof.width = kCHAR_OLOF_WIDTH;
    _olof.height = kCHAR_OLOF_HEIGHT;
    _olof.anchor.set(0.5); 
    
    _olof.animations.add('move', [0, 1, 2, 3, 4, 5], 10, true);

    _game.world.add(_olof); 
    _game.camera.follow(_olof); 
    
    _game.physics.arcade.enable([_olof, paleGrass]);
    _olof.body.collideWorldBounds = true; 
    paleGrass.body.collideWorldBounds = true; 

    var startingPoint = map.objects['GameObjects'][0];
    _olof.position.set(startingPoint.x + 40 + (startingPoint.width / 2), startingPoint.y + (startingPoint.height / 2));
    
    _cursors = _game.input.keyboard.createCursorKeys();

    _game.world.setBounds(0, 0, kGAME_BOUNDS_X, kGAME_BOUNDS_Y);

    var testObj = map.createFromObjects('GameObjects', 'test', 'test');

    //var game = new Phaser.Game(kGAME_WIDTH, kGAME_HEIGHT, Phaser.AUTO, '', {preload:preload, create:create, update:update, render:render}); 
}

var kCHAR_OLOF_SPEED = 6;

function update(){
    ////if (_game.physics.arcade.collide([_olof, paleGrass])) {
        //console.log('collide!');
    //}
//
    //_game.physics.arcade.collide(_olof, paleGrass, function(){
        //console.log('collision');
    //});
    //_game.physics.arcade.overlap(_olof, paleGrass, function()
    //{
        //console.log('overlap');
    //});
    
    var isMoving = false; 
    if (_cursors.left.isDown)
    {
        if(_olof.position.x > 0) {
            _olof.position.add(-kCHAR_OLOF_SPEED, 0);
            isMoving = true;
        }
    }
    if (_cursors.right.isDown)
    {
        if (_olof.position.x < kGAME_BOUNDS_X) {
            _olof.position.add(kCHAR_OLOF_SPEED, 0);
            isMoving = true;
        }
    }
    if (_cursors.up.isDown)
    {
        if(_olof.position.y > 0) {
            _olof.position.add(0, -kCHAR_OLOF_SPEED);
            isMoving = true;
        }
    }
    if (_cursors.down.isDown)
    {
        if(_olof.position.y < kGAME_BOUNDS_Y) {
            _olof.position.add(0, kCHAR_OLOF_SPEED);
            isMoving = true;
        }
    }

    if(isMoving) {
        _olof.animations.play('move', 20, false);
    }

    _game.camera.focusOnXY(_olof.x, _olof.y)
}

function render(){
    _game.debug.cameraInfo(_game.camera, 32, 32);
    _game.debug.spriteCoords(_olof, 32, kGAME_HEIGHT - 50);
}

/*
function test() {
       game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('map');

    map.addTilesetImage('tiles');

    // map.setCollisionBetween(1, 12);

    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0xffffff, 1);
    marker.drawRect(0, 0, 32, 32);

    game.input.addMoveCallback(updateMarker, this);

    game.input.onDown.add(getTileProperties, this);

    cursors = game.input.keyboard.createCursorKeys();
 
}
//*/