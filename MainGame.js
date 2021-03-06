'use strict'
const MINE = '💣';
const MARK_FLAG = '🚩'



var gBoard;
var gEmptyLocations
var gMines;



var gLevel = {
    SIZE: 4,
    MINES: 2,
    NUMBEROFCELLS: 16,
    NUMBEROFFLAGS: 0,

}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0,
    lives: 3
}



function init() {
    gBoard = builtBoard()
    renderBoard(gBoard)
    setDetailsForStart()
    gGame.isOn = true

}



function builtBoard() {
    var board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };

            board[i][j] = cell;
        }

    }

    return board
}



function renderBoard(board) {

    var strHTML = ``;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell cell${i}-${j}`;
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})" 
            oncontextmenu="cellMarked(${i},${j})"></td>`

        }
        strHTML += `</tr>`
    }
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


function setMinesNegsCount(pos) {
    var countOfNegs = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            if (gBoard[i][j].isMine) countOfNegs++
        }
    }

    return countOfNegs;
}




function cellClicked(elCell, i, j) {

    var currCell = gBoard[i][j]
    var location = { i: i, j: j };
    if (gisHint) {
        hintClick(location)
        return
    }
    if (!gGame.isOn || currCell.isMarked || currCell.isShown) return
    gGame.shownCount++
        var numberOfMineNegs = setMinesNegsCount(location);

    elCell.classList.add('pressed-cell')

    if (gGame.shownCount === 1) {
        gGame.secPassed = timer()
        addRandomMines(i, j)
    }

    if (currCell.isMine) {
        reduceLives(elCell)
        renderCell(location, MINE)
        setTimeout(function() {
            if (!gGame.isOn) return
            renderCell(location, '')
            elCell.classList.remove('pressed-cell')
        }, 800)
        gGame.shownCount--
            return

    }

    if (numberOfMineNegs >= 1) {
        setColorsForNums(numberOfMineNegs, elCell)

        // Model Update
        currCell.isShown = true
        currCell.minesAroundCount = numberOfMineNegs
            // Dom Update
        renderCell(location, numberOfMineNegs)

    }
    if (numberOfMineNegs === 0) {
        // Update the Model
        currCell.isShown = true
        currCell.minesAroundCount = numberOfMineNegs

        // Update The Dom
        renderCell(location, '')

        shownExpand(location)
    }


    if (gGame.markedCount + gGame.shownCount === gLevel.NUMBEROFCELLS) checkGameOver(true)
}


function shownExpand(pos) {

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue

            if (gBoard[i][j].isMine) break
            var elCell = getElement({ i: i, j: j })
            cellClicked(elCell, i, j)
        }
    }
}







function cellMarked(i, j) {
    var currCell = gBoard[i][j]
    var location = { i: i, j: j };

    if (!gGame.isOn || currCell.isShown) return


    if (!currCell.isMarked && gLevel.NUMBEROFFLAGS > 0) {
        //Update the Model
        currCell.isMarked = true
            //Update the Dom
        renderCell(location, MARK_FLAG)
        gGame.markedCount++
            gLevel.NUMBEROFFLAGS--

    } else if (currCell.isMarked && gLevel.NUMBEROFFLAGS >= 0) {
        //Update the Model
        currCell.isMarked = false
            //Update the Dom
        renderCell(location, '')
        gLevel.NUMBEROFFLAGS++
            gGame.markedCount--

    }
    var elFlagsNum = document.querySelector('.flags span')
    elFlagsNum.innerText = gLevel.NUMBEROFFLAGS
    if (gGame.markedCount + gGame.shownCount === gLevel.NUMBEROFCELLS) checkGameOver(true)

}



function chooseLevel(elBtn) {
    var levelNum = elBtn.getAttribute('data-level');
    gLevel.SIZE = +levelNum;
    if (gLevel.SIZE === 4) {
        gLevel.MINES = 2
        gLevel.NUMBEROFCELLS = 16
        gLevel.NUMBEROFFLAGS = 2

    }
    if (gLevel.SIZE === 8) {
        gLevel.MINES = 12
        gLevel.NUMBEROFCELLS = 64
        gLevel.NUMBEROFFLAGS = 12

    }
    if (gLevel.SIZE === 12) {
        gLevel.MINES = 30
        gLevel.NUMBEROFCELLS = 144
        gLevel.NUMBEROFFLAGS = 30
    }
    init()

}



function reduceLives() {
    gGame.lives--
        if (gGame.lives === 0) {
            explodMines()
            checkGameOver(false)
        }
    var elLives = document.querySelector('.lives')
    elLives.classList.add('lives-lose')
    setTimeout(function() {
        elLives.classList.remove('lives-lose')

    }, 800)
    var numOfLives = document.querySelector('.lives span')
    if (gGame.lives === 3) numOfLives.innerText = '❤️ ❤️ ❤️'
    if (gGame.lives === 2) numOfLives.innerText = '❤️ ❤️'
    if (gGame.lives === 1) numOfLives.innerText = '❤️'
    if (gGame.lives === 0) numOfLives.innerText = '💔'

}


function explodMines() {
    var location;
    for (var i = 0; i < gMines.length; i++) {
        location = gMines[i]
        renderCell(location, MINE)

    }

}


function checkGameOver(isVictory) {
    var elSmiley = document.querySelector('.smiley');
    var smileyHtml = (isVictory) ? ' 😎' : '🤯';
    elSmiley.innerText = smileyHtml
    clearInterval(gTimerIntervalId)
    if (isVictory) records()
    gGame.isOn = false
}




function addRandomMines(firstI, firstJ) {
    gMines = []
    for (var i = 0; i < gLevel.MINES; i++) {

        var idxI = getRandomInt(0, gLevel.SIZE)
        var idxJ = getRandomInt(0, gLevel.SIZE)
        while (gBoard[idxI][idxJ].isMine || idxI === firstI && idxJ === firstJ) {
            var idxI = getRandomInt(0, gLevel.SIZE)
            var idxJ = getRandomInt(0, gLevel.SIZE)

        }
        gMines.push({ i: idxI, j: idxJ })
        gBoard[idxI][idxJ].isMine = true

    }
}


function setDetailsForStart() {
    gGame.lives = 3
    var elLives = document.querySelector('.lives')
    elLives.classList.remove('lives-lose')
    var numOfLives = document.querySelector('.lives span')
    numOfLives.innerText = '❤️ ❤️ ❤️'
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = '🙂'
    clearInterval(gTimerIntervalId)
    var elStopWatch = document.querySelector('.timer span');
    elStopWatch.innerText = '0.0'
    gGame.shownCount = 0
    gGame.markedCount = 0
    gLevel.NUMBEROFFLAGS = gLevel.MINES
    var elFlagsNum = document.querySelector('.flags span')
    elFlagsNum.innerText = gLevel.NUMBEROFFLAGS
    var clicks = document.querySelector('.safe-click span')
    gSafeCount = 3
    clicks.innerText = gSafeCount
    document.querySelector('.hint span').innerText = '💡💡💡'
    gCountHints = 3
    var elRecord = document.querySelector('.records span');
    elRecord.innerText = sessionStorage.getItem('Time')
}