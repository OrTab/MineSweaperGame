/////////////////////////////////////////////////////////////

// Timer function with 3 digits after the dot

var gTimerIntervalId;

function timer() {
    var currTime = Date.now();
    var elStopWatch = document.querySelector('.timer');
    gTimerIntervalId = setInterval(function() {
        var timePassed = Date.now() - currTime;
        elStopWatch.innerText = (timePassed / 1000);
    }, 100)
    return elStopWatch;
}

/////////////////////////////////////////////////////////////


// Get random integer, min is inclusive, max is not inclusive

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}



/////////////////////////////////////////////////////////////


// Get a matrix with a blank string in each cell

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        mat[i] = [];
        for (var j = 0; j < COLS; j++) {
            mat[i][j] = [];
        }
    }
    return mat
}


/////////////////////////////////////////////////////////////

// Render cell with class

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

/////////////////////////////////////////////////////////////


function getClass(location) {
    var cellClass = `.cell${location.i}-${location.j}`
    return cellClass;
}
////////////////////////////////////////////////////////////////


function getElement(location) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    return elCell;
}