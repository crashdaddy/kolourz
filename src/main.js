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

// divide the selected image into sections and place them
// randomly on the board
const shuffleBoardPic = () => {
    // the backgroundPos array holds the positions of the
    // background sprite for each div
    // we had to reassign it like this because if you
    // just do tempArray = backgroundPos then the shuffle
    // algorithm would still permute the backgroundPos
    // array. We want it to stay in order for testing to see
    // if all the pieces are in the right place when the user wins                
    let tempArray = []
    backgroundPos.forEach(arrayObj => {
        tempArray.push(arrayObj);
    });

    // so we made a copy the hard way and we'll shuffle that
    let shuffledArray = shuffle(tempArray);

    // then cycle through it and assign the new shuffled values
    // to each tile
    let counter=0;
        for (let i=0;i<boardHeight;i++){
            for (let j=0;j<boardWidth;j++){
                $(`#${i}-${j}`).css('background-position',shuffledArray[counter].pos);
                counter++;
            }
        }
}

const drawBoard = () => {

    let htmlStr = "";

    // figure up the tile width based on selected board size
    let tileWidth = (Math.round($(`#gameBoard`).width()/boardWidth))-boardWidth;
    let tileHeight= (Math.round($(`#gameBoard`).height()/boardHeight))-boardHeight;
    
    // this doesn't seem to work, that's why it's repeated as inline
    // css in a couple of lines down
    $(".tile").css({'width': `${tileWidth}px`,'height': `${tileHeight}px`});
    
    // cycle through the tiles
    for (let i=0;i<boardWidth;i++){
        for (j=0;j<boardHeight;j++) {
        // set each background and give it a click handler
        htmlStr += `<div id = "${i}-${j}" class="tile" onclick="clicked(this)"
                style="background-position: -${j*tileWidth}px -${i*tileHeight}px;width:${tileWidth}px;height:${tileHeight}px;">&nbsp;</div>`;
            // add it to the array so we know what sections of the image
            // are mapped to each tile when they're in the right order
            backgroundPos.push({"tile":`${i}-${j}`,"pos": `-${j*tileWidth}px -${i*tileHeight}px`});
        }
    }   
    
    // output the new tile layout to the screen
    $("#gameBoard").html(htmlStr);
    // put a big picture of the image up so the user can compare it
    $("#referencePic").attr('src',($(".tile").css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1')));

    // now mess it all up!
    shuffleBoardPic();
}

drawBoard();

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


// this is the function that's called when the user clicks one of the tiles
const clicked = (elem) => {
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
        
        // once we've done all that we can forget where we clicked
        secondClick.firstRow=null;
        secondClick.firstCol=null;
        secondClick.clicked=false;

        // update the display showing how many moves
        $("#output").html(movesCount);
        // unhighlight all the cells
        $(".tile").css('border','1px solid black');
    }
}
