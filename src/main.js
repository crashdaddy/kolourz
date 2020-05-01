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
    "trophyPic": "/img/trophies/bottle.png"
},
{
    "grid": 3,
    "achievement" : "Bearly Tryin'",
    "announcement": "Look who's puzzling!",
    "achievementScore" : 1,
    "trophyPic": "/img/trophies/bear.png"
},
{
    "grid": 4,
    "achievement" : "Block Party",
    "announcement": "You're building for success!",
    "achievementScore" : 1,
    "trophyPic": "/img/trophies/blocks.png"
},
{
    "grid": 5,
    "achievement" : "Kicking It",
    "announcement": "You're really on the ball!",
    "achievementScore" : 1,
    "trophyPic": "/img/trophies/ball.png"
},
{
    "grid": 6,
    "achievement" : "Free-wheelin'",
    "announcement": "The training wheels are off!",
    "achievementScore" : 1,
    "trophyPic": "/img/trophies/bicycle.png"
},
{
    "grid": 7,
    "achievement" : "Freestyle",
    "announcement": "I like your style!",
    "achievementScore" : 1,
    "trophyPic": "/img/trophies/skateboard.png"
},
{
    "grid": 8,
    "achievement" : "Cruisin'",
    "announcement": "You're really cruisin'!",
    "achievementScore" : 1,
    "trophyPic": "/img/trophies/car.png"
},
{
    "grid": 9,
    "achievement" : "You've made it",
    "announcement": "You're a real puzzle doctor!",
    "achievementScore" : 1,
    "trophyPic": "/img/trophies/diploma.png"
}
]

// check the Local Storage for saved data
let stats              =  JSON.parse(localStorage.getItem("stats")) || [];
let history            = JSON.parse(localStorage.getItem("history")) || [];
let earnedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];

// keep track of how many puzzles the player plays during this session
let gamesPlayed        = 0;

// keep track of the game's running state
let gameOver           = false;

// we're gonna keep score now!
let gameScore          = 0;
let playerScore        = 0;

// track whether user is using 'cheat mode' or if it was used at all
let cheatMode          = false;
let wasCheatModeUsed   = false;

// keep track of if a div has been
// clicked once or twice
let clickTracker       = {};

// count the moves
let movesCount         = 0;

// set default board dimensions from the
// pulldown's initial setting
let boardWidth         =$("#boardSize").val();
let boardHeight        =$("#boardSize").val();

// background coordinates for the tiles
// will be an array of objects {tile: x: y:}
let backgroundPos      = [];
// and the array for those same values all jumbled up
let shuffledArray      = [];

////////////////////////
//
//   Helper Functions
//

// this function should detect when there's a missing
// image from the API and just start over
function imgError(image) {
    console.log("missing pic");
    gameStart();
}
// generate a random number in the required range (min-max)
const getRandomInt = (min,max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// toggle the 'cheat mode' on or off when user clicks the div
const toggleCheat = () => {
    // whether they're turning it on or off they must have been using it
    wasCheatModeUsed=true;

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
    // figure up the tile width based on picture size
    let tileWidth = Math.floor((PICSIZE)/boardWidth);
    let tileHeight= Math.floor((PICSIZE)/boardHeight);

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
    // put a big picture of the image up so the user can compare it
    //$("#referencePic").attr('src',($(".tile").css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1')));

    // now mess it all up!
    shuffleBoard();
}

const updateAchievements = () => {
        // set a string for the trophy case contents
    let trophyStr = "";

    // show the player's amazing score (total)
    $("#scoreDiv").html("Score: "+ playerScore);

    // if the player has some achievement trophies
    // post them to the trophy case
    for (let i=0;i<earnedAchievements.length;i++) {
        trophyStr+= `<div style="width:100px;float:left;margin-left:5px;margin-top:5px;text-align:center;border:1px solid black;border-radius:5px;padding:5px;">
        <img src="${earnedAchievements[i].trophyPic}" style="width:50px;" title="${earnedAchievements[i].announcement}">
        <br/>
        <span style="font-size:10pt;">${earnedAchievements[i].achievement}</span>
        </div>`;
    }

    $("#trophies").html(trophyStr);
}

// fills the stats board to the right of the gameboard
const updateStats = () => {
    // if there are stats to print, print them to a table where
    // each column is a grid size and the first row will display
    // all the scores for that grid size
    if (history.length>0) {
        // show the panel
        $("#statsBoard").css('display','block');

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
            tempArray.sort((a, b) => a.moves - b.moves); // For ascending sort
            // we're only interested in the first five records
            let topFive = 5;
            // but the temp array might not be five elements long!
            if (tempArray.length<topFive) topFive = tempArray.length;
            // that's got it
            for (let k = 0;k<topFive;k++) {
                // add each record to the output
                statsStr+= `<div style="display:inline-block;width:100%;margin-bottom:10px;">
                <img src="${tempArray[k].picture}" style="max-width:90%;margin:5px 5px 2px 5px;border:1px solid black;">
                <br/>Moves: ${tempArray[k].moves} 
                <br/>Score: ${tempArray[k].score} 
                <br/>CheatMode: ${tempArray[k].cheatMode}
                </div>`;
        }
        // display the top five!
        $(`#${i}x${i}`).html(statsStr);
        }
    } else {$("#statsBoard").css('display','none');} // if there's no records, hid the panel

}


const gameStart = () => {
    // clear out the cheatMode tracker
    if(!cheatMode) wasCheatModeUsed=false;

    updateAchievements();
    updateStats();
    gamesPlayed++;
    if (stats.length>0) {
        console.log("saving...");
        stats[0].gamesPlayed=gamesPlayed;
        stats[0].playerScore=playerScore;
    } else {
        stats.push({"gamesPlayed": gamesPlayed,"score":playerScore})
    }
    localStorage.setItem("stats",JSON.stringify(stats));
    movesCount=0;
    $("#output").html(movesCount)
    backgroundPos=[];
    let randomNum = getRandomInt(0,999);
    let randomPic = `https://i.picsum.photos/id/${randomNum}/${PICSIZE}/640.jpg`;
    $("#referencePic").attr('src',randomPic);

    $("#winPanel").css('display','none');
    gameOver=false
    drawBoard();
}

const init = () => {

    if (stats.length>0) {
        playerScore = stats[0].playerScore;
        gamesPlayed = stats[0].gamesPlayed;
    } 
    gameStart();
}

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
            movesCount++;
        } else if (clickedRow<clickTracker.firstRow) {
            moveLeft(elem.id);
            movesCount++;
        } else if (clickedCol>clickTracker.firstCol){
            // or column if they clicked a tile that was higher or lower
            moveDown(elem.id);
            movesCount++;
        } else if (clickedCol<clickTracker.firstCol) {
            moveUp(elem.id);
            movesCount++;
        }

        $("#output").html(movesCount)
        // once we've done all that we can forget where we clicked
        clickTracker.firstRow=null;
        clickTracker.firstCol=null;
        clickTracker.clicked=false;

        // check for a win and
        // update the display showing how many moves
        if (gameWon()) {
            let scoreMultiplier = 1;
            if (boardWidth==2) scoreMultiplier=10;
            if (boardWidth==3) scoreMultiplier=25;
            if (boardWidth==4||boardWidth==5) scoreMultiplier=100;
            if (boardWidth==6||boardWidth==7) scoreMultiplier=200;
            if (boardWidth==8||boardWidth==9) scoreMultiplier=300;
            gameScore= (boardWidth*scoreMultiplier)-movesCount;
            playerScore+= gameScore;

            $("#winPanel").css('display','block');
            $("#winPanel").css('top','25%');
            $("#winPanel").css('left','50%');
            let htmlStr = `You Won in ${movesCount} Moves!<br>
            <span style="font-size:15pt;">Game Score: ${gameScore}  Your Total: ${playerScore}</span><br/>
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
            history.push({"board": boardDims,"moves": movesCount, "score": gameScore, "picture": $("#referencePic").attr('src'),"cheatMode": wasCheatModeUsed})
            localStorage.setItem("history",JSON.stringify(history));
            localStorage.setItem("achievements",JSON.stringify(earnedAchievements));
            $("#winPanel").html(htmlStr);
          
            gameOver = true;}
             
    }
    }
}

