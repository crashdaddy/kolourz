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

// keep track of the game's running state
let gameOver = false;

// track whether user is using 'cheat mode'
let cheatMode = false;

// keep track of if a div has been
// clicked once or twice
let secondClick = {};

// count the moves
let movesCount = 0;

// set default board dimensions
let boardWidth=$("#boardSize").val();
let boardHeight=$("#boardSize").val();

// this is the array for our colors
const colorArray = ["red",
"yellow",
"blue",
"green",
"lavender",
"lightgreen",
"lightblue",
"orange"]

// background coordinates for the tiles
// will be an array of objects {tile: x: y:}
let backgroundPos = [];
// and the array for those same values all jumbled up
let shuffledArray = [];

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
    let returnArray = array;
    var m = returnArray.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = returnArray[m];
      returnArray[m] = returnArray[i];
      returnArray[i] = t;
    }
    
    return returnArray;
  }

// toggle the 'cheat mode' on or off when user clicks the div
const toggleCheat = () => {

    if (!cheatMode) {
        cheatMode=true;
        $("#cheatMode").html('Cheat Mode: ON');
    } else {
        cheatMode = false;
        $("#cheatMode").html('Cheat Mode: OFF');
    }
    gameWon()
}

// move the selected row to the right
const moveRight = (rowCol) => {
    let tempId = rowCol.split("-");
    let row = tempId[0];

    // store the information from the last div
    let tempColor = $(`#${row}-${boardWidth-1}`).css('background-color');
    let tempPOS = $(`#${row}-${boardWidth-1}`).css('background-position');

    // move each div's values to the div on the right of it
    for (let i=boardWidth;i>0;i--) {
        $(`#${row}-${i}`).css('background-color',$(`#${row}-${i-1}`).css('background-color'));
        $(`#${row}-${i}`).css('background-position',$(`#${row}-${i-1}`).css('background-position'));
    }

    // move the stored last div's values into the first div
    $(`#${row}-0`).css('background-color',tempColor);
    $(`#${row}-0`).css('background-position',tempPOS);

}


const moveLeft = (rowCol) => {
    let tempId = rowCol.split("-");
    let row = tempId[0];

    let tempColor = $(`#${row}-0`).css('background-color');
    let tempPOS = $(`#${row}-0`).css('background-position');

    for (let i=0;i<boardWidth-1;i++){
        $(`#${row}-${i}`).css('background-color',$(`#${row}-${i+1}`).css('background-color'));
        $(`#${row}-${i}`).css('background-position',$(`#${row}-${i+1}`).css('background-position'));
    }

    $(`#${row}-${boardWidth-1}`).css('background-color',tempColor);
    $(`#${row}-${boardWidth-1}`).css('background-position',tempPOS);
}

const moveUp = (rowCol) => {
    let tempId = rowCol.split("-");
    let col = tempId[1];

    let tempColor = $(`#0-${col}`).css('background-color');
    let tempPOS = $(`#0-${col}`).css('background-position');

    for (let i = 0; i< boardWidth-1;i++) {
        $(`#${i}-${col}`).css('background-color',$(`#${i+1}-${col}`).css('background-color'));
        $(`#${i}-${col}`).css('background-position',$(`#${i+1}-${col}`).css('background-position'));
    }

    $(`#${boardWidth-1}-${col}`).css('background-color',tempColor);
    $(`#${boardWidth-1}-${col}`).css('background-position',tempPOS);
}

const moveDown = (rowCol) => {
    let tempId = rowCol.split("-");
    let col = tempId[1];

    let tempColor = $(`#${boardWidth-1}-${col}`).css('background-color');
    let tempPOS   = $(`#${boardWidth-1}-${col}`).css('background-position');

    for (let i = boardWidth-1;i>0;i--) {
        $(`#${i}-${col}`).css('background-color',$(`#${i-1}-${col}`).css('background-color'));
        $(`#${i}-${col}`).css('background-position',$(`#${i-1}-${col}`).css('background-position'));
    }

    $(`#0-${col}`).css('background-color',tempColor);
    $(`#0-${col}`).css('background-position',tempPOS);
}


// this function is only there from when it was just 
// colored tiles, but I'm keeping it in case we 
// want to make that a mode
const colorBoard = () => {
let tempArray = [];
    for (let i=0;i<boardHeight;i++){
        tempArray = shuffle(colorArray);
        for (let j=0;j<boardWidth;j++){
                       $(`#${i}-${j}`).css('background-color', colorArray[j]);
        }
    }
}

// this function performs a random set of permutations on the
// gameboard to shuffle the picture around

const shuffleBoard = () => {

    // we're going to perform 30 random moves
    for (let i = 0;i<30;i++) {
        // first pick a tile to start from
        let randomX = getRandomInt(0,boardWidth-1);
        let randomY = getRandomInt(0,boardHeight-1);
        // construct its ID
        let randomCell = `${randomX}-${randomY}`;
        // pick a random direction
        let randomDirection = getRandomInt(0,3);
        // perform the move
        switch (randomDirection) {
            case 0: {
                moveLeft(randomCell);
            }
            break;
            case 1: {
                moveRight(randomCell);
            }
            break;
            case 2: {
                moveUp(randomCell);
            }
            break;
            case 3: {
                moveDown(randomCell);
            }
            break;
        }
    }
}

const drawBoard = () => {

    let htmlStr = "";
    // figure up the tile width based on selected board size
    let tileWidth = (Math.floor(($(`#gameBoard`).width()-2*boardWidth)/boardWidth));
    let tileHeight= (Math.floor(($(`#gameBoard`).height()-2*boardHeight)/boardHeight));

    let srcPic = $("#referencePic").attr('src');

    // setup a counter to track the original starting position of each object
    // in the array: div with id = "1-1" would be 1, "0-1" would be 0...all
    // the way to div id "8-8" = 63;
    let numberPosition = 0
    
    // cycle through the tiles
    for (let i=0;i<boardWidth;i++){
        for (j=0;j<boardHeight;j++) {
        // set each background and give it a click handler
        htmlStr += `<div id = "${i}-${j}" class="tile" onclick="clicked(this)"
                style="background:url(${srcPic}) no-repeat;background-position: -${j*tileWidth}px -${i*tileHeight}px;width:${tileWidth}px;height:${tileHeight}px;">&nbsp;</div>`;
            // add it to the array so we know what sections of the image
            // are mapped to each tile when they're in the right order
            backgroundPos.push({"tile":`${i}-${j}`,"pos": `-${j*tileWidth}px -${i*tileHeight}px`, "numberPosition": numberPosition });
            numberPosition++;
        }
    }   

    console.log(backgroundPos);
    // output the new tile layout to the screen
    $("#gameBoard").html(htmlStr);
    // put a big picture of the image up so the user can compare it
    //$("#referencePic").attr('src',($(".tile").css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1')));

    // now mess it all up!
    shuffleBoard();
}


const gameStart = () => {
    movesCount=0;
    $("#output").html(movesCount)
    backgroundPos=[];
    let randomNum = getRandomInt(0,999);
    let randomPic = "url('https://i.picsum.photos/id/"+randomNum+"/640/640.jpg') no-repeat";
    $("#referencePic").attr('src','https://i.picsum.photos/id/'+randomNum+'/640/640.jpg');

    $("#winPanel").css('display','none');
    gameOver=false
    drawBoard();
}

gameStart();

// called when the user changes the "board size" pulldown
// to a different setting
const changeSize = () => {
    // start with a fresh array
    backgroundPos = [];
    // get the new board size
    let newSize = $("#boardSize").val();
    boardHeight= parseInt(newSize);
    boardWidth = parseInt(newSize);
    // reset the move counter
    movesCount=0
    $("#output").html(movesCount);

    // start over
    drawBoard();
}

const gameWon = () => {
    let won = true;
    let counter= 0;

       // unhighlight all the cells
       $(".tile").css('border','1px solid black');

    for (let i=0;i<boardWidth;i++) {
        for (let j=0;j<boardHeight;j++) {
            let boardPos = $(`#${i}-${j}`).css('background-position');
            let strippedBoardPos = boardPos.replace(/-/g,'')

            let strippedBGPos = backgroundPos[counter].pos.replace(/-/g,'');
            if(strippedBGPos != strippedBoardPos) {
                won = false;
                
                if (cheatMode) $(`#${i}-${j}`).css('border','1px solid red');
                
            }
            counter++;
        }
    }

    return won;
}



// this is the function that's called when the user clicks one of the tiles
const clicked = (elem) => {
    // unhighlight all the cells
    $(".tile").css('border','1px solid black');


    if (!gameOver) {
    // parse the tile ID for its coordinates on the board
    let tempId = elem.id.split("-");
    let clickedRow = tempId[1];
    let clickedCol = tempId[0];

    // the first time they click we're only going to highlight the selected tile
    if (!secondClick.clicked) {
        // we store the coordinates so when they click another tile afterward
        // we'll remember what they clicked the first time
        secondClick.firstRow = clickedRow;
        secondClick.firstCol = clickedCol;
        // this means we're waiting for the second click
        secondClick.clicked = true;
        // highlight the cell that's selected
        $(`#${elem.id}`).css('border','1px solid white');
        
    } else {
        // they clicked a second time which means the information has
        // already been stored in the secondClick object for where
        // they clicked the first time

        // now we're comparing the second click to the first click
        // to see which direction they clicked in
        if(clickedRow>secondClick.firstRow) {
            // and then moving that row
            moveRight(elem.id);
            // add to the moves counter
            movesCount++;
        } else if (clickedRow<secondClick.firstRow) {
            moveLeft(elem.id);
            movesCount++;
        } else if (clickedCol>secondClick.firstCol){
            // or column if they clicked a tile that was higher or lower
            moveDown(elem.id);
            movesCount++;
        } else if (clickedCol<secondClick.firstCol) {
            moveUp(elem.id);
            movesCount++;
        }

        $("#output").html(movesCount)
        // once we've done all that we can forget where we clicked
        secondClick.firstRow=null;
        secondClick.firstCol=null;
        secondClick.clicked=false;

        // check for a win and
        // update the display showing how many moves
        if (gameWon()) {
            $("#winPanel").css('display','block');
            $("#winPanel").css('top','25%');
            $("#winPanel").css('left','50%');
            $("#winPanel").html(`You Won in ${movesCount} moves!<br>
            <span style="font-size:10pt;">click to continue</span>`);
            gameOver = true;}
             
    }
    }
}
