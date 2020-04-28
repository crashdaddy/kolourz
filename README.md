# kolourz

This is the rough-draft of a puzzle game I'm making. It was called Kolourz, because it was originally just a random pattern of colored tiles the user had to organize, but kind of evolved into a slidey puzzle game made out of pictures. Kind of like a 2-D Rubik's Cube Puzzle game. I'm thinking of calling it "Puzzly"

Update: 4/28/20

  Added a tracker to follow whether cheat mode was used at all during the game. It was just tracking if it
  was used during the last move, so they could use cheat mode the whole way through, then turn it off
  for the last few moves. 

Update: 4/27/20

  Fixed that pesky problem where it was putting a white border around the bottom of the
  tiles on the lower board sizes. 
   
    I was calculating the tile width based on the boardWidth (657) - 2*board size (to accommodate for
    cell borders), but then I changed it to calculate tile size based on the image size (640) divided by the
    board width (8, 2, 6, etc). That solved it!


Update: 4/25/20

  -- corrected the shuffle function 
        -- it was just randomly shuffling the array in memory and then plotting
        the tiles to that array, but that made it possible to start the game
        in unsolveable permutations

        -- new routine plots the image directly to the tiles, then uses a set of 
        random moves to scramble the tiles with the same functions the user uses
        to solve it

  -- added algorithm to determine if a player won

  -- added cheat mode to highlight tiles in the wrong spots (in red)

  -- added new image without needing to refresh

  TODO:

  -- error trap when the picsum API provides a link to a missing image

    DONE. Made imgError function that starts the game over if the image is missing

  -- save/load game state

  -- add timer

  -- save/load scores by boardSize

    DONE -- added history to localStorage, displays on panel to the right of gameboard
