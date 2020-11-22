'use strict'

var gSafeCount;
var gisHint;
var gCountHints;



function safeclick() {

    if (gSafeCount <= 0) return
    var safeI = getRandomInt(0, gLevel.SIZE)
    var safeJ = getRandomInt(0, gLevel.SIZE)
    while (gBoard[safeI][safeJ].isMine || gBoard[safeI][safeJ].isShown) {
        var safeI = getRandomInt(0, gLevel.SIZE)
        var safeJ = getRandomInt(0, gLevel.SIZE)

    }
    var safeIntervalId = setInterval(function() {
        var elCell = getElement({ i: safeI, j: safeJ })
        elCell.classList.add('safe')
        setTimeout(function() {
            elCell.classList.remove('safe')

        }, 500)
        setTimeout(function() {

            clearInterval(safeIntervalId)
        }, 2000)

    }, 800)
    gSafeCount--
    var clicks = document.querySelector('.safe-click span')
    clicks.innerText = gSafeCount

}


function hintClick(pos) {
    if (gCountHints <= 0 || gGame.shownCount <= 0) return
    var elImg = document.querySelector('img')
    elImg.style.display = 'block'
    gisHint = true
    var locations = [];
    if (!pos) return
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue

            locations.push({ i: i, j: j })
            var elCell = getElement({ i: i, j: j })
            elCell.classList.add('pressed-cell')
            if (gBoard[i][j].isMine) renderCell({ i: i, j: j }, MINE)

        }
    }
    setTimeout(function() {
        for (i = 0; i < locations.length; i++) {
            var currCell = gBoard[locations[i].i][locations[i].j]
            var elCell = getElement(locations[i])
            if (!currCell.isShown) elCell.classList.remove('pressed-cell')
            if (currCell.isMarked) renderCell(locations[i], MARK_FLAG)
            if (currCell.minesAroundCount > 0) renderCell(locations[i], currCell.minesAroundCount)
            else {
                renderCell(locations[i], '')
            }

        }
    }, 1000)
    gCountHints--
    elImg.style.display = 'none'
    var elHint = document.querySelector('.hint span')
    elHint.classList.add('after-hint')
    setTimeout(function() {
        elHint.classList.remove('after-hint')

    }, 800)
    if (gCountHints === 2) elHint.innerHTML = '💡💡'
    if (gCountHints === 1) elHint.innerHTML = '💡'
    if (gCountHints === 0) elHint.innerHTML = '❌'
    gisHint = false
}





function records() {


    var elRecord = document.querySelector('.records span');
    var elTimer = document.querySelector('.timer span');
    var secPassed = elTimer.innerText;
    if (sessionStorage.length === 0) sessionStorage.setItem('Time', `${secPassed}`)
    if (sessionStorage.getItem('Time') > +secPassed) {
        sessionStorage.setItem('Time', `${secPassed}`)

    }
    elRecord.innerText = sessionStorage.getItem('Time', `${secPassed}`)

}