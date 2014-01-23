window.onload = init();

function init(){

    createjs.MotionGuidePlugin.install();

    var stage = new createjs.Stage("canvas");
    
    /*
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0,0,10);
    circle.x = 10;
    circle.y = stage.canvas.height - 10;
    circle.radius = 10;
    */
    //stage.addChild(circle);
    
    var x = stage.canvas.width - 50;
    var y = stage.canvas.height - 50;
    var enemy = new createjs.Shape();
    enemy.graphics.beginFill("white").drawRect(0, 0, 50, 50);
    enemy.x = x;
    enemy.y = y;
    enemy.width = 50;
    //stage.addChild(enemy);
    
    
    /*Images Initialization*/
    var imgMonsterARun = new Image();
    imgMonsterARun.src = "../img/monsterARun.png";
    var imgMonsterAIdle = new Image();
    imgMonsterAIdle.src = "../img/monsterAIdle.png";
    var explosion = new Image();
    explosion.src = "../img/explosion.png";
    
    /*Player Walking*/
    var spriteSheet = new createjs.SpriteSheet({
        images: [imgMonsterARun],
        frames: {width: 64, height: 64, regX: 32, regY: 32},
        animations: {
            walk: [0, 9, "walk", 0.5]
        }
    });
    bmpAnimation = new createjs.Sprite(spriteSheet);
    
    bmpAnimation.name = "PlayerMoving";
    bmpAnimation.direction = 90;
    
    /*Player Idle*/
    var spriteSheetIdle = new createjs.SpriteSheet({
        images: [imgMonsterAIdle],
        frames: { width: 64, height: 64, regX: 32, regY: 32 }, 
        animations: {
            idle: [0, 10, "idle", 0.5]
        }
    });

    bmpAnimationIdle = new createjs.Sprite(spriteSheetIdle);

    bmpAnimationIdle.name = "PlayerIdle";
    bmpAnimationIdle.x = stage.canvas.width / 2;
    bmpAnimationIdle.y = stage.canvas.height - 32;
    
    stage.addChild(bmpAnimationIdle);
    bmpAnimationIdle.gotoAndPlay("idle");
    
    /*Bomb*/
    var bomb = new createjs.Shape();
    bomb.graphics.beginFill("black").drawCircle(0,0,10);
    bomb.x = Math.floor((Math.random()*1080)+1);
    bomb.y = 0;
    bomb.radius = 10;
    stage.addChild(bomb);
    
    /*Explosion*/
    var explosionSheet = new createjs.SpriteSheet({
        images: [explosion],
        frames: { width: 256, height: 256},
        loop: false,
        animations: {
            exploding: [0, 48, false]
        }
    });
    
    bmpExplosion = new createjs.Sprite(explosionSheet);
    //bmpExplosion.x = 500;
    //bmpExplosion.y = stage.canvas.height - 100;
    
    //stage.addChild(bmpExplosion);
    //bmpExplosion.gotoAndPlay("exploding");
    
    stage.update(); //clears the canvas and runs through all children and redraws them to screen
    animation(enemy, bomb, stage);
}

function animation(enemy, bomb, stage){

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(30);
    
    walking_right = false;
    walking_left = false;
    idle = true;
    jumping = false;
    jumping_right = false;
    kumping_left = false;
    speed = 200;
    
    var exp_X;
    var exp_Y;
    
    
    setInterval(function(){
        speed += 50;
    }, 6000);
   
    
    $(document).keydown(function(evt) {    
    
        //left = 37
        
        if(evt.keyCode == 37 && walking_left == false) {
            walking_left = true;
            if(idle){
                idle = false;
                bmpAnimation.x = bmpAnimationIdle.x;
                bmpAnimation.y = bmpAnimationIdle.y;
                stage.removeChild(bmpAnimationIdle);
                stage.addChild(bmpAnimation);
                bmpAnimation.gotoAndPlay("walk");
            }
            
            if(walking_right){
                walking_right = false;
                walking_left = true;
            }
        }
        
        //right = 39
        
        if(evt.keyCode == 39 && walking_right == false) {
            walking_right = true;
            if(idle){
                idle = false;
                bmpAnimation.x = bmpAnimationIdle.x;
                bmpAnimation.y = bmpAnimationIdle.y;
                stage.removeChild(bmpAnimationIdle);
                stage.addChild(bmpAnimation);
                bmpAnimation.gotoAndPlay("walk");
            }
            
            if(walking_left){
                walking_left = false;
                walking_right = true;
            }
        }
        
        //pause = 32
        
        if (evt.keyCode == 32 && !idle && !jumping) {
            idle = true;
            walking_left = false;
            walking_right = false;
            bmpAnimationIdle.x = bmpAnimation.x;
            bmpAnimationIdle.y = bmpAnimation.y;
            stage.removeChild(bmpAnimation);
            stage.addChild(bmpAnimationIdle);
        }
        
        //jump = 38
        
        if(evt.keyCode == 38 && !jumping && !idle){
            
            jumping = true;
            
            if(walking_right){               
                currX = bmpAnimation.x;
                currY = bmpAnimation.y;
                landingX = currX + 180;
                landingY = currY;
                
                P1x = currX + 50;
                P1y = currY - 100;
                
                P2x = currX + 100;
                P2y = currY - 100;
                
                createjs.Tween.get(bmpAnimation).to({guide:{ path:[currX,currY, P1x,P1y,P2x,P2y, P2x,P2y,landingX,landingY] }},400).call(jumpDone);
                
                function jumpDone(){
                    bmpAnimation.y = currY;
                    jumping = false;
                }
            }
            
            if(walking_left){               
                currX = bmpAnimation.x;
                currY = bmpAnimation.y;
                landingX = currX - 180;
                landingY = currY;
                
                P1x = currX - 50;
                P1y = currY - 100;
                
                P2x = currX - 100;
                P2y = currY - 100;
                
                createjs.Tween.get(bmpAnimation).to({guide:{ path:[currX,currY, P1x,P1y,P2x,P2y, P2x,P2y,landingX,landingY] }},400).call(jumpDone);
                
                function jumpDone(){
                    bmpAnimation.y = currY;
                    jumping = false;
                }
            }
        }
    });
    
    function play_explosion(x){
        bmpExplosion.x = exp_X - 128;
        bmpExplosion.y = stage.canvas.height - 128;
        stage.addChild(bmpExplosion);
        bmpExplosion.gotoAndPlay("exploding");
    }
    
    function tick(event){
        
        bomb.y += event.delta/1000*speed;
        
        if(bomb.y > stage.canvas.height){
            exp_X = bomb.x;
            exp_Y = bomb.Y;
            stage.removeChild(bomb);
            bomb.x = Math.floor((Math.random()*1080)+1);
            bomb.y = 0;
            stage.addChild(bomb);
            play_explosion(bmpExplosion.x);
        }
        
        if(walking_right && !idle){
            bmpAnimation.scaleX = -1;
            bmpAnimation.x += event.delta/1000*200;
        }
        
        if(walking_left && !idle){
            bmpAnimation.scaleX = 1;
            bmpAnimation.x -= event.delta/1000*200;
        }
        
        if(bmpAnimation.x < 0 && !idle){
            bmpAnimation.x = 0;
        }
        
        if(bmpAnimation.x > stage.canvas.width && !idle){
            bmpAnimation.x = stage.canvas.width;
        }
    
        stage.update();
    }
}

/*
function animation(enemy, circle, stage){

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(30);
    
    var toggle_space = 0;
    var jumping = false;
    var currX;
    var currY;
    var landingX;
    var landingY;
    var P1x, P2x, P1y, P2y;
    var hit = 0;
    var speed = 150;
    
    setInterval(function(){
        speed += 50;
    }, 6000);
    
    function tick(event){
        
        if(circle.x > stage.canvas.width) { 
            circle.x = 0;
            circle.y = 470;
        }
        if(enemy.x < 100) { 
            enemy.x = stage.canvas.width - 100;
        }
        
        // Hit testing the screen width, otherwise our sprite would disappear
        if (bmpAnimation.x >= stage.canvas.width - 16) {
            // We've reached the right side of our screen
            // We need to walk left now to go back to our initial position
            bmpAnimation.direction = -90;
        }
    
        if (bmpAnimation.x < 16) {
            // We've reached the left side of our screen
            // We need to walk right now
            bmpAnimation.direction = 90;
            stage.removeChild(bmpAnimation);
            bmpAnimationIdle.gotoAndPlay("idle");
            stage.addChild(bmpAnimationIdle);
        }
    
        // Moving the sprite based on the direction & the speed
        if (bmpAnimation.direction == 90) {
            bmpAnimation.scaleX = -1;
            //bmpAnimation.x += bmpAnimation.vX;
            bmpAnimation.x += event.delta/1000*200;
        }
        else {
            bmpAnimation.scaleX = 1;
            bmpAnimation.x -= event.delta/1000*200;
        }
        
        checkHit();
        
        stage.update();
        
        /*Auto move*/
        //circle.x += event.delta/1000*speed;
        //enemy.x -= event.delta/1000*200;
/*        
        $(document).keydown(function(evt) {
            if(evt.keyCode == 87) {
            
                if(!jumping){
                    
                    jumping = true;
                    
                    currX = circle.x;
                    currY = circle.y;
                    landingX = currX + 180;
                    landingY = currY;
                    
                    P1x = currX + 50;
                    P1y = currY - 100;
                    
                    P2x = currX + 100;
                    P2y = currY - 100;
                    
                    createjs.Tween.get(circle).to({guide:{ path:[currX,currY, P1x,P1y,P2x,P2y, P2x,P2y,landingX,landingY] }},400).call(jumpDone);
                    
                    function jumpDone(){
                        circle.y = 470;
                        jumping = false;
                    }
                }
            }
        });
        
        $('#time').html("total time: "+createjs.Ticker.getTime());
        $('#x').html("circle x: "+circle.x);
        $('#y').html("circle y: "+circle.y);
    }
    
    function checkHit(){
        
        if((circle.x > enemy.x && circle.x < enemy.x+50)&&(circle.y>enemy.y&&circle.y<enemy.y+50)){
            hit++;
            var remaining = 30 - hit;
            $('#life').html("life remaining: " + remaining);
        }
    }
}
*/

/*

if (evt.keyCode == 32) {
                
    if(toggle_space == 0){
        toggle_space = 1;
    }else{
        toggle_space = 0; 
    }
    
    if(toggle_space == 1){
        createjs.Ticker.setPaused(true);
    }else{
        createjs.Ticker.setPaused(false);
    }
*/