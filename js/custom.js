window.onload = init();

function init(){

    createjs.MotionGuidePlugin.install();

    var stage = new createjs.Stage("canvas");
    var circle = new createjs.Shape();
    
    circle.graphics.beginFill("red").drawCircle(0,0,10);
    circle.x = 0;
    circle.y = 470;
    circle.radius = 10;
    stage.addChild(circle);
    
    var x = stage.canvas.width - 50;
    var y = stage.canvas.height - 50;
    var enemy = new createjs.Shape();
    enemy.graphics.beginFill("white").drawRect(0, 0, 50, 50);
    enemy.x = x;
    enemy.y = y;
    enemy.width = 50;
    stage.addChild(enemy);
    
    stage.update(); //clears the canvas and runs through all children and redraws them to screen
    animation(enemy, circle, stage);
}

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
        console.log(speed);
    }, 6000);
    
    function tick(event){
    
        stage.update();
        
        if(circle.x > stage.canvas.width) { 
            circle.x = 0;
            circle.y = 470;
        }
        if(enemy.x < 100) { 
            enemy.x = stage.canvas.width - 100;
        }
        
        checkHit();
        
        circle.x += event.delta/1000*speed;
        enemy.x -= event.delta/1000*200;
        
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