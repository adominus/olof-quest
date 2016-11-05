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
var _startPoint;
var _endPoint;

function create(){
    var map = _game.add.tilemap('tile_map_01', kMAP_TILE_WIDTH, kMAP_TILE_HEIGHT, kMAP_SEGMENT_WIDTH, kMAP_SEGMENT_HEIGHT);
    
    map.addTilesetImage('tile_map_01', 'tiles_01');
    
    map.createLayer('Background');
    
    paleGrass = map.createLayer('PaleGrass');
    //paleGrass.debug =true; 
    
    var pathLayer = map.createLayer('Path');
    map.setCollisionByExclusion([], true, paleGrass);
    //map.setCollisionBetween(1, 10000, true, paleGrass);
    
    _olof = _game.add.sprite(8, 8, 'olof_sprite', 1); 
    _game.physics.enable(_olof, Phaser.Physics.ARCADE); 
    
    _olof.body.setSize(kCHAR_OLOF_WIDTH-15, kCHAR_OLOF_HEIGHT-15, 10, 10); 
    _olof.animations.add('move', [0, 1, 2, 3, 4, 5], 10, true);
    _olof.anchor.set(0.5); 
    
    _game.world.setBounds(0, 0, kGAME_BOUNDS_X, kGAME_BOUNDS_Y);
    _game.camera.follow(_olof); 

    _cursors = _game.input.keyboard.createCursorKeys();

    setupGameObjects(map); 
}

function setupGameObjects(map){
    var startingPointPlacement = map.objects['GameObjects'][0];
    _startPoint = _game.add.sprite(startingPointPlacement.x, startingPointPlacement.y);
    _game.physics.enable(_startPoint, Phaser.Physics.ARCADE);
    _startPoint.body.setSize(startingPointPlacement.width, startingPointPlacement.height); 
    _startPoint.body.moves = false;
    
    _olof.position.set(startingPointPlacement.x + (startingPointPlacement.width / 2), startingPointPlacement.y + (startingPointPlacement.height / 2));
    
    var endPointPlacement = map.objects['GameObjects'][1];
    _endPoint = _game.add.sprite(endPointPlacement.x, endPointPlacement.y); 
    _game.physics.enable(_endPoint, Phaser.Physics.ARCADE); 
    _endPoint.body.setSize(endPointPlacement.width, endPointPlacement.height); 
    _endPoint.body.moves = false; 
}

var kCHAR_OLOF_SPEED = 500;

function update(){
    _game.physics.arcade.overlap(_olof, _startPoint, function()
    {
        console.log('overlap with start point');
    });
    _game.physics.arcade.overlap(_olof, _endPoint, function()
    {
        displayEndText(); 
        console.log('overlap with end point');
    });

    if(_game.physics.arcade.collide(_olof, paleGrass)) {
        console.log("collision");
    }
    _olof.body.velocity.set(0); 
    
    if(canMove()) {
        var isMoving = false; 
        if (_cursors.left.isDown)
        {
            if(_olof.position.x > 0) {
                _olof.body.velocity.x = -kCHAR_OLOF_SPEED;
                isMoving = true;
            }
        }
        if (_cursors.right.isDown)
        {
            if (_olof.position.x < kGAME_BOUNDS_X) {
                _olof.body.velocity.x = kCHAR_OLOF_SPEED;
                isMoving = true;
            }
        }
        if (_cursors.up.isDown)
        {
            if(_olof.position.y > 0) {
                _olof.body.velocity.y = -kCHAR_OLOF_SPEED;
                isMoving = true;
            }
        }
        if (_cursors.down.isDown)
        {
            if(_olof.position.y < kGAME_BOUNDS_Y) {
                _olof.body.velocity.y = kCHAR_OLOF_SPEED;
                isMoving = true;
            }
        }
        
        if(isMoving) {
            _olof.animations.play('move', 20, false);
        }
    }
    else
    {
        _olof.animations.stop();
    }

    _game.camera.focusOnXY(_olof.x, _olof.y)
}

function canMove(){
    return !_isTextDisplaying;
}

function render(){
    // _game.debug.cameraInfo(_game.camera, 32, 32);
    // _game.debug.spriteCoords(_olof, 32, kGAME_HEIGHT - 50);
}

var _isTextDisplaying = false; 
var _textBackground; 
var _text;

function displayEndText() {
    if(_isTextDisplaying) {
        return; 
    }

    _isTextDisplaying = true; 

    var textBackgroundHeight = 150; 
    
    var textBackground = _game.add.bitmapData(kGAME_WIDTH, textBackgroundHeight);
    textBackground.ctx.beginPath();
    textBackground.ctx.rect(0, 0, kGAME_WIDTH, textBackgroundHeight);
    textBackground.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    textBackground.ctx.fill();

    var startX = _game.camera.view.x; 
    var startY = _game.camera.view.y + kGAME_HEIGHT - textBackgroundHeight; 
    var padding = 15; 
    
    var drawnObject = _game.add.sprite(startX, startY, textBackground);
    _textBackground = drawnObject;
    
    text = _game.add.text(startX + padding, startY + padding, '', { font: "18px Verdana", fill: 'rgb(255,255,255)' });
    _text = text; 

    nextLine(story, textDisplayComplete);
}

function textDisplayComplete() {
    _text.kill();
    _textBackground.kill();
    
    _isTextDisplaying = false; 
}

var story = [
    "The sky above the port was the color of television.",
]

var content = [
    "The sky above the port was the color of television.",
    "`It's not like I'm using,' Case heard someone say",
    "through the crowd around the door of the Chat.",
    "this massive drug deficiency.' It was a Sprawl",
    "The Chatsubo was a bar for professional ",
    "a week and never hear two words in Japanese.",
    "",
    "Ratz was tending bar, his prosthetic arm jerking ",
    "of glasses with draft Kirin. He saw Case and ",
    "East European steel and brown decay. Case ",
    "unlikely tan on one of Lonny Zone's whores ",
    "African whose cheekbones were ridged with ",
    "in here early, with two joeboys,' Ratz said",
    "his good hand. `Maybe some business with you, Case?'",
    "",
    "Case shrugged. The girl to his right giggled",
    "The bartender's smile widened. His ugliness",
    "affordable beauty, there was something heraldic",
    "arm whined as he reached for another mug.",
    "",
    "",
    "From Neuromancer by William Gibson"
];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 120;
var lineDelay = 400;

var kMAX_LINES = 4; 

function nextLine(linesArray, completedCallback) {

    if (lineIndex === linesArray.length)
    {
        // We're finished
        // Reset 
        
        lineIndex = 0; 
        wordIndex = 0; 
        line = [];
        
        completedCallback(); 
        return;
    }

    if(lineIndex > 0 && lineIndex % kMAX_LINES == 0) {
        text.text = "";
    }

    //  Split the current line on spaces, so one word per array element
    line = linesArray[lineIndex].split(' ');

    //  Reset the word index to zero (the first word in the line)
    wordIndex = 0;

    //  Call the 'nextWord' function once for each word in the line (line.length)
    _game.time.events.repeat(wordDelay, line.length, function(){ nextWord(linesArray, completedCallback); }, this);

    //  Advance to the next line
    lineIndex++;
}

function nextWord(linesArray, completedCallback) {

    //  Add the next word onto the text string, followed by a space
    text.text = text.text.concat(line[wordIndex] + " ");

    //  Advance the word index to the next word in the line
    wordIndex++;

    //  Last word?
    if (wordIndex === line.length)
    {
        //  Add a carriage return
        text.text = text.text.concat("\n");

        //  Get the next line after the lineDelay amount of ms has elapsed
        _game.time.events.add(lineDelay, function(){ nextLine(linesArray, completedCallback); }, this);
    }

}
