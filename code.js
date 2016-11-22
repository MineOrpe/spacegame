var cnvo = document.getElementById("canv");
var canv = cnvo.getContext("2d");

//-----------------------------------

var walls = [];
var sizeh = 70;
var sizew = 40;
var x = 0;
var y = 0;
var rw = 35;
var rh = 35;
var dir_y = 1;
var sx = 0;
var sy = 0;
var delay = false;
var tx = -1;
var id_moveUD = 0;
var id_moveR = 0;
var loose = false;
var won = false;

//-----------------------------------
generateWalls();
start();

function keypress(e){
    if(!loose){
        if (!delay){
            delay = true;
            tx = x;
            id_moveR = setInterval(move, 5);
            updateBall();
        }
    }
    if(loose || won){
        start();
    }
}

function clearBall(){
    canv.clearRect(x - 1, y - 1, rw + 1, rh + 1);
}
function moveDU(){
    if(!delay){
        clearBall();
        y += dir_y;
        if (y <= 0 || y + rw >= cnvo.height){
            dir_y = -dir_y;
        }
        updateBall();
    }
}
function move(){
    if (x <= Math.floor(tx / (sizew) + 1) * sizew + 1){
        clearBall();
        x += 1;
        updateBall();
    }
    else{
        delay = false;
        clearInterval(id_moveR);
        return;
    }
    var num = Math.ceil(tx / sizew) - 1;
    if (num < 0)
        num = 0;
    loose = true;
    for(var i = 0; i < walls[num].length; i++){
        if((y >= walls[num][i] * sizeh && y + rh <= walls[num][i] * sizeh + sizeh)){
            loose = false;
        }
    }
    if(loose){
        clearInterval(id_moveR);
        looser();
        return;
    }
    if(x + rw >= cnvo.width){
        clearInterval(id_moveR);
        winner();
        return;
    }
}

function clearScreen(){
    canv.clearRect(0, 0, cnvo.width, cnvo.height);
}

function winner(){
    clearScreen();
    won = true;
    clearInterval(id_moveUD);
    var grad = canv.createLinearGradient(0, 0, cnvo.width, 0);
    grad.addColorStop("0", "aqua");
    grad.addColorStop("0.5", "yellow");
    grad.addColorStop("1.0", "red");
    grad.addColorStop("0.9", "orange");
    canv.font = "50px Arial";
    canv.fillStyle = grad;
    canv.fillText("You won!", cnvo.width / 2 - 160, cnvo.height / 2);
    canv.fillText("Press any key to continue!", cnvo.width / 2 - 295, cnvo.height / 2 + 70);
}

function looser(){
    clearScreen();
    clearInterval(id_moveUD);
    canv.font = "50px Arial";
    canv.fillStyle = "red";
    canv.fillText("You loose!", cnvo.width / 2 - 160, cnvo.height / 2);
    canv.fillText("Press any key to continue!", cnvo.width / 2 - 295, cnvo.height / 2 + 70);
}

function updateBall(){
    canv.fillStyle = "red";
    canv.lineWidth = 2;
    canv.fillRect(x, y, rw, rh);
}

function rand(a, b){
    return Math.floor(Math.random() * (b - a + 1) + a);
}

function generateWalls(){
    for(var i = 1; i < cnvo.width / sizew; i++){
        var y1 = rand(0, cnvo.height / sizeh - 1);
        var y2 = rand(0, cnvo.height / sizeh - 2);
        if (Math.abs(y1 - y2) > 1)
            walls.push([y1, y2]);
        else
            walls.push([y1])
    }
}

function draw(){
    for(var i = 1; i < cnvo.width / sizew; i++){
        var nums = walls[i - 1];
        for(var j = 0; j < cnvo.height / sizeh; j++){
            var is_wall = true;
            if(nums != null){
                for (var k = 0; k < nums.length; k += 1){
                    if (j == nums[k])
                        is_wall = false;
                }
            }
            if (is_wall){
                canv.moveTo(i * sizew + sx, j * sizeh);
                canv.lineTo(i * sizew + sx, j * sizeh + sizeh);
                canv.stroke();
            }
        }
    }
    updateBall();
}


function start(){
    x = 0;
    y = 0;
    dir_y = 1;
    loose = false;
    delay = false;
    won = false;
    document.onkeydown = keypress;
    id_moveUD = setInterval(moveDU, 5);
    update();
}

function update(){
    clearScreen();
    draw();
}