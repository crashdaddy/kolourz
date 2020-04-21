/////////////////////////////////////
//
//         Kolourz
//
//         another
//     crazyhappyfuntime
//        production!
//

//
//

// this keeps track of the mouse to tell what direction
// the user is swiping
var last_position = {};

let mouse_timer   = setInterval(function () {
    mousemove_ok = true;
}, 500);

// this is the array for our colors
const colorArray = ["red",
"yellow",
"blue",
"green",
"lavender",
"lightgreen",
"lightblue",
"orange"]

////////////////////////
//
//   Helper Functions
//

// generate a random number in the required range (min-max)
const getRandomInt = (min,max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// This is known as the "Fischer-Yates Shuffle Algorithm"
function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }


const moveRight = (rowCol) => {
    let tempId = rowCol.split("-");
    let row = tempId[0];

    let tempColor = $(`#${row}-7`).css('background-color');

    for (let i=colorArray.length;i>0;i--) {
        $(`#${row}-${i}`).css('background-color',$(`#${row}-${i-1}`).css('background-color'));
    }

    $(`#${row}-0`).css('background-color',tempColor);
}


const moveLeft = (rowCol) => {
    let tempId = rowCol.split("-");
    let row = tempId[0];

    let tempColor = $(`#${row}-0`).css('background-color');

    for (let i=0;i<colorArray.length-1;i++){
        $(`#${row}-${i}`).css('background-color',$(`#${row}-${i+1}`).css('background-color'));
    }

    $(`#${row}-7`).css('background-color',tempColor);
}

const moveUp = (rowCol) => {
    let tempId = rowCol.split("-");
    let col = tempId[1];

    let tempColor = $(`#0-${col}`).css('background-color');

    for (let i = 0; i< colorArray.length-1;i++) {
        $(`#${i}-${col}`).css('background-color',$(`#${i+1}-${col}`).css('background-color'));
    }

    $(`#7-${col}`).css('background-color',tempColor);
}

const moveDown = (rowCol) => {
    let tempId = rowCol.split("-");
    let col = tempId[1];

    let tempColor = $(`#7-${col}`).css('background-color');

    for (let i = colorArray.length-1;i>0;i--) {
        $(`#${i}-${col}`).css('background-color',$(`#${i-1}-${col}`).css('background-color'));
    }

    $(`#0-${col}`).css('background-color',tempColor);
}

const colorBoard = () => {
let tempArray = [];
    for (let i=0;i<colorArray.length;i++){
        tempArray = shuffle(colorArray);
        for (let j=0;j<tempArray.length;j++){
                       $(`#${i}-${j}`).css('background-color', colorArray[j]);
        }
    }

}

const drawBoard = () => {

    let htmlStr = "";

    for (let i=0;i<8;i++){
        for (j=0;j<8;j++) {
        htmlStr += `<div id = "${i}-${j}" class="tile">&nbsp;</div>`;
        }
    }

    document.getElementById("gameBoard").innerHTML=htmlStr;
    colorBoard();
}

drawBoard();

$('.tile').mousedown($.throttle(350,true,function(e1){
   e1.preventDefault();
    
    $('.tile').on('mousemove', $.throttle(350,true,function (event) {
        event.preventDefault();
        if (mousemove_ok) {
            mousemove_ok = false;
        if (event.buttons==1){
            let targetCell = event.target.id;
        if (typeof(last_position.x) != 'undefined') {
            var deltaX = last_position.x - event.offsetX,
                deltaY = last_position.y - event.offsetY;
            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
                //left
                moveLeft(targetCell);
                targetCell="";
            } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
                //right
                moveRight(targetCell);
                targetCell="";
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
                //up
                moveUp(targetCell);
                targetCell="";
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
                //down
                moveDown(targetCell);
                targetCell="";                
            }
          
        }
        last_position = {
            x : event.offsetX,
            y : event.offsetY
        };
        }
    }
    }));
    
}));     

//   $('.tile').mouseup(function(){
//     $(this).unbind("mousemove");
//     $(this).unbind("mousedown");
// });      