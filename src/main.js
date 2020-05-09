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

// the original scale of the images we use is 640x640
const PICSIZE = 640;

// set a collection of achievements for the player to unlock
const achievements = [{
    "grid": 2,
    "achievement" : "Baby Steps",
    "announcement": "You gotta crawl before you can walk!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/bottle.png"
},
{
    "grid": 3,
    "achievement" : "Bearly Tryin'",
    "announcement": "Look who's puzzling!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/bear.png"
},
{
    "grid": 4,
    "achievement" : "Block Party",
    "announcement": "You're building for success!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/blocks.png"
},
{
    "grid": 5,
    "achievement" : "Kicking It",
    "announcement": "You're really on the ball!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/ball.png"
},
{
    "grid": 6,
    "achievement" : "Free-wheelin'",
    "announcement": "The training wheels are off!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/bicycle.png"
},
{
    "grid": 7,
    "achievement" : "Freestyle",
    "announcement": "I like your style!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/skateboard.png"
},
{
    "grid": 8,
    "achievement" : "Cruisin'",
    "announcement": "You're really cruisin'!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/car.png"
},
{
    "grid": 9,
    "achievement" : "You've made it",
    "announcement": "You're a real puzzle doctor!",
    "achievementScore" : 1,
    "trophyPic": "img/trophies/diploma.png"
}
]

// make an object to hold the game variables
class Game {
    constructor(gameScore,wasCheatModeUsed,movesCount,gameTime,board,puzzleURL) {
        this.gameScore          = gameScore;
        this.wasCheatModeUsed   = wasCheatModeUsed;
        this.movesCount         = movesCount;
        this.gameTime           =gameTime;
        this.board              =board;
        this.puzzleURL          =puzzleURL;
      }
}

let game;

// check the Local Storage for saved data
let stats              =  JSON.parse(localStorage.getItem("stats")) || [];
let history            = JSON.parse(localStorage.getItem("history")) || [];
let earnedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];

// keep track of how many puzzles the player plays during this session
let gamesPlayed        = 0;

// keep track of the game's running state
let gameOver           = false;

// the player's total from all their games
let playerScore        = 0;

// track whether user is using 'cheat mode' or if it was used at all
let cheatMode          = false;

    // set default board dimensions from the
    // pulldown's initial setting
let boardWidth         =$("#boardSize").val();
let boardHeight        =$("#boardSize").val();

// keep track of if a div has been
// clicked once or twice
let clickTracker       = {};

// background coordinates for the tiles
// will be an array of objects {tile: x: y:}
let backgroundPos      = [];
// and the array for those same values all jumbled up
let shuffledArray      = [];

////////////////////////
//
//   Helper Functions
//

// set variables for the timer
let seconds = 0, minutes = 0, hours = 0,
t; // the timer id for the clear function
// boolean for on/off
let clockRunning = false;


const add = () => {
seconds++;
if (seconds >= 100) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
 }
game.gameTime = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
$("#timer").html(game.gameTime);
timer();
}

const stopTime = () => {
    clockRunning=false;
    clearTimeout(t);
}

const timer = () => {
    clockRunning=true;
    t = setTimeout(add, 10);
}

const clearTimer = () => {
    seconds = 0;
    minutes = 0;
    hours   = 0;
    game.gameTime="00:00:00";
    $("#timer").html("00:00:00");
}

// this function should detect when there's a missing
// image from the API and just start over
function imgError(image) {
    console.log("missing pic");
    gameStart("");
}
// generate a random number in the required range (min-max)
const getRandomInt = (min,max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const openStats = () => {
    if (history.length>0) {
    $("#statsBoard").css('display','block');
    }
}

// toggle the 'cheat mode' on or off when user clicks the div
const toggleCheat = () => {
    // whether they're turning it on or off they must have been using it
    game.wasCheatModeUsed=true;

    if (!cheatMode) {
        cheatMode=true;
        $("#cheatMode").html('ON');
    } else {
        cheatMode = false;
        $("#cheatMode").html('OFF');
    }
    checkWin();
}


////////////////////////////////
//
//  functions to move the rows
//
//

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

// check to see if all the tiles are in their correct places
// also highlights correct tiles if in "cheatMode"
const checkWin = () => {
    let won = true;
    let counter= 0;
    // unhighlight all the cells
    $(".tile").css('border','1px solid black');
    // setup a counter to see how many red tiles there are (out of place)
    let redCounter=0;
    for (let i=0;i<boardWidth;i++) {
        for (let j=0;j<boardHeight;j++) {
            let boardPos = $(`#${i}-${j}`).css('background-position');
            // parse the coordinates of the tile's portion of the picture
            let strippedBoardPos = boardPos.replace(/-/g,'')
            // get the corresponding section of the correct image
            let strippedBGPos = backgroundPos[counter].pos.replace(/-/g,'');
            // compare the tile's background to what the correct background should be
            if(strippedBGPos != strippedBoardPos) {
                won = false;
                redCounter++;
                if (cheatMode) {
                    $(`#${i}-${j}`).css('border','1px solid red');
                }
            }
            counter++;
        }
    }

    // calculate percentage solved (100% - redTiles%)
    let boardTiles = boardWidth * boardHeight;
    let redPercent = redCounter/boardTiles * 100;
    let solvedPercent = 100-redPercent;
    $("#percentComplete").html(solvedPercent.toFixed(2));
    return won;
}

////////////////////////////////////
//
//  Board functions
//
//

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

    // now mess it all up!
    if (checkWin()) {
        shuffleBoard();
    } 
}

const drawBoard = () => {

    let htmlStr = "";
    // figure up the tile width based on picture size
    let tileWidth = Math.floor((PICSIZE)/boardWidth);
    let tileHeight= Math.floor((PICSIZE)/boardHeight);

    $("#gameBoard").css('width',tileWidth*boardWidth + (boardWidth)*2);
    let sidePanelsHeight = $("#gameBoard").height()-20;
    $("#cheatPic").css('height',sidePanelsHeight);
    $("#trophyBoard").css('height',sidePanelsHeight);

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

    //console.log(backgroundPos);
    // output the new tile layout to the screen
    $("#gameBoard").html(htmlStr);
    
    shuffleBoard();
}

const outputAchievements = () => {
        // set a string for the trophy case contents
    let trophyStr = "";

    // show the player's amazing score (total)
    $("#scoreDiv").html(playerScore.toLocaleString());

    // if the player has some achievement trophies
    // post them to the trophy case
    for (let i=0;i<earnedAchievements.length;i++) {
        trophyStr+= `<div class="trophy">
        <img src="${earnedAchievements[i].trophyPic}" style="width:50px;" title="${earnedAchievements[i].announcement}">
        <br/>
        <span style="font-size:10pt;">${earnedAchievements[i].achievement}</span>
        </div>`;
    }

    $("#trophies").html(trophyStr);
}

///////////////////////////////////////
//
//  pop-up window functions
//
//

// fills the stats board to the right of the gameboard
const outputStats = () => {
    // if there are stats to print, print them to a table where
    // each column is a grid size and the first row will display
    // all the scores for that grid size
    if (history.length>0) {

        // first dig through the history and get all
        // records for each board size starting with '2x2'
        // going to '9x9'
        for (let i=2;i<10;i++) {
            // make an array to store those records in
            let tempArray = [];
            let statsStr = "";
            // if the board size matches then store that record!
            for (let j=0;j<history.length;j++) {
                if (history[j].board === `${i}x${i}`) {
                    tempArray.push(history[j]);
                }
            }
        
            // sort the array of records so the best ones will be first
            tempArray.sort((a, b) => a.movesCount - b.movesCount); // For ascending sort
            // we're only interested in the first five records
            let topFive = 5;
            // but the temp array might not be five elements long!
            if (tempArray.length<topFive) topFive = tempArray.length;
            // that's got it
            for (let k = 0;k<topFive;k++) {
                // add each record to the output
                statsStr+= `<div style="display:inline-block;width:100%;margin-bottom:10px;">
                <img src="${tempArray[k].puzzleURL}" onclick="gameStart(this.src);" style="max-width:50%;margin:5px 5px 2px 5px;border:1px solid black;">
                <br/><span style="font-size:10pt;">Moves:</span> ${tempArray[k].movesCount} 
                <br/><span style="font-size:10pt;">Score:</span> ${tempArray[k].gameScore} 
                <br/><span style="font-size:10pt;">CheatMode:</span> ${tempArray[k].wasCheatModeUsed}
                <br/><span style="font-size:10pt;">Time:</span> ${tempArray[k].gameTime}
                </div>`;
        }
        // display the top five!
        $(`#${i}x${i}`).html(statsStr);
        }
    } else {hidePanels();} // if there's no records, hide the panel

}

const updateStats = () => {
        gamesPlayed++;
    if (stats.length>0) {
        stats[0].gamesPlayed=gamesPlayed;
        stats[0].score=playerScore;
    } else {
        stats.push({"gamesPlayed": gamesPlayed,"score":playerScore})
    }
    localStorage.setItem("stats",JSON.stringify(stats));
}

const showSearch = () => {
    let htmlStr = "";

    $("#searchPanel").css('display','block');

    for (let i=0;i<30;i++) {
        let randomNum = getRandomInt(0,999);
        randomPic = `https://i.picsum.photos/id/${randomNum}/${PICSIZE}/640.jpg`;
        htmlStr += `<div style="float:left;margin:5px;">
        <img src="${randomPic}" style="width:160px;" onclick="gameStart('${randomPic}')" onerror="this.src='https://picsum.photos/640/640'">
        </div>`;
    }

    $("#searchPix").html(htmlStr);
}

const showWinPanel = () => {
    $("#winPanel").css('display','block');
    $("#winPanel").css('top','25%');
    $("#winPanel").css('left','50%');
    let htmlStr = `You Won in ${game.movesCount} Moves!<br>
    <span style="font-size:15pt;">Game Score: ${game.gameScore}  Your Total: ${playerScore}</span><br/>
    <span style="font-size:10pt;">click to continue</span>`;
    let foundInHistory = false;
    if (history.length>0) {
        for (let i=0;i<history.length;i++) { 
            if (history[i].board===`${boardWidth}x${boardHeight}`)
            foundInHistory = true;
        }
    }
   
    if (!foundInHistory) {
        for (let i= 0 ;i<achievements.length;i++){
            
        if(achievements[i].grid==boardWidth) {
        htmlStr += `
        <br/><span style="font-size:24px;">You won an Achievement!</span>
        <br/>${achievements[i].announcement}<br/>
        <span style="font-size:24px;">${achievements[i].achievement}</span><br/>
        <img src="${achievements[i].trophyPic}" style="width:50px;">`;
       earnedAchievements.push(achievements[i]);
    }
    }
    }
    let boardDims = `${boardWidth}x${boardHeight}`;
    game.board=boardDims;
    history.push(game);
    localStorage.setItem("history",JSON.stringify(history));
    localStorage.setItem("achievements",JSON.stringify(earnedAchievements));
    $("#winPanel").html(htmlStr);
}

const hidePanels = () => {
   // hide the "you won" panel
   $("#winPanel").css('display','none');
   $("#statsBoard").css('display','none');
   $("#searchPanel").css('display','none');
}


const gameStart = (gamePic) => {

    // initialize the game object
    game = new Game(0,false,0,"00:00:00","","");

    // set the timer to 00:00:00
    clearTimer();
    // turn off cheatMode
    cheatMode = false;
    $("#cheatMode").html('OFF');

    // display current trophies
    outputAchievements();
    // stats will be invisible until user clicks
    // the stats icon
    outputStats();

    // does this really need explaining?
    game.movesCount=0;
    $("#output").html(game.movesCount)

    // clear out the array of image coodinates
    backgroundPos=[];

    if (gamePic==="") {
    // start with a new picture
    let randomNum = getRandomInt(0,999);
    game.puzzleURL = `https://i.picsum.photos/id/${randomNum}/${PICSIZE}/640.jpg`;
    } else game.puzzleURL = gamePic;

    // show the picture solved
    $("#referencePic").attr('src',game.puzzleURL);

    // hide any panels that are open
    hidePanels();

    // start playin!
    gameOver=false
    drawBoard();
}

const init = () => {
     // get the player's old stats if there's any to get
    if (stats.length>0) {
        playerScore = stats[0].score;
        gamesPlayed = stats[0].gamesPlayed;
    } 
    gameStart("");
}

// It all starts here!
init();

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
    game.movesCount=0
    $("#output").html(game.movesCount);

    // start over
    drawBoard();
}

const playerWon = () => {

    // turn off the timer
    stopTime();

    // get the scale for the scores
    // it's dependent on board size
    let scoreMultiplier = 1;
    if (boardWidth==2) scoreMultiplier=10;
    if (boardWidth==3) scoreMultiplier=25;
    if (boardWidth==4||boardWidth==5) scoreMultiplier=100;
    if (boardWidth==6||boardWidth==7) scoreMultiplier=200;
    if (boardWidth==8||boardWidth==9) scoreMultiplier=300;

    // calculate the score
    game.gameScore= (boardWidth*scoreMultiplier)-game.movesCount;
    if (game.gameScore<0) game.gameScore=0;

    // this is the player's 'global' score for all games
    playerScore+= game.gameScore;

    // save player data
    updateStats();

    showWinPanel();

    gameOver = true;
}


// this is the function that's called when the user clicks one of the tiles
const clicked = (elem) => {
    // unhighlight all the cells
    $(".tile").css('border','1px solid black');


    if (!gameOver) {
    // if the clock's not running, start it up
    if (!clockRunning) {
        
        timer();
    }
    // parse the tile ID for its coordinates on the board
    let tempId = elem.id.split("-");
    let clickedRow = tempId[1];
    let clickedCol = tempId[0];

    // the first time they click we're only going to highlight the selected tile
    if (!clickTracker.clicked) {
        // we store the coordinates so when they click another tile afterward
        // we'll remember what they clicked the first time
        clickTracker.firstRow = clickedRow;
        clickTracker.firstCol = clickedCol;
        // this means we're waiting for the second click
        clickTracker.clicked = true;
        // highlight the cell that's selected
        $(`#${elem.id}`).css('border','1px solid white');
        
    } else {
        // they clicked a second time which means the information has
        // already been stored in the clickTracker object for where
        // they clicked the first time

        // now we're comparing the second click to the first click
        // to see which direction they clicked in
        if(clickedRow>clickTracker.firstRow) {
            // and then moving that row
            moveRight(elem.id);
            // add to the moves counter
           game.movesCount++;
        } else if (clickedRow<clickTracker.firstRow) {
            moveLeft(elem.id);
            game.movesCount++;
        } else if (clickedCol>clickTracker.firstCol){
            // or column if they clicked a tile that was higher or lower
            moveDown(elem.id);
            game.movesCount++;
        } else if (clickedCol<clickTracker.firstCol) {
            moveUp(elem.id);
            game.movesCount++;
        }
        // update the display showing how many moves
        $("#output").html(game.movesCount)
        // once we've done all that we can forget where we clicked
        clickTracker.firstRow=null;
        clickTracker.firstCol=null;
        clickTracker.clicked=false;

        // check for a win and if they won
        // do the winning stuff        
        if (checkWin()) {
            playerWon();
           }
             
    }
    }
}

