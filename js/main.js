/*----- constants -----*/

const COLORS = {
    'null': 'white',
    '1': 'pink',
    '-1': 'skyblue'
};

/*----- state variables -----*/

let board;
let turn;
let winner;

/*----- cached elements  -----*/
// cache elements that you will be accessing more than once
const playAgainBtn = document.getElementById('play-again');
const messageEl = document.querySelector('h1');
const markerEls = [...document.querySelectorAll('#markers > div')];

/*----- event listeners -----*/

document.getElementById('markers').addEventListener('click', handleDrop);
playAgainBtn.addEventListener('click', init);

/*----- functions -----*/
// Initialize all state variables, then call render()
init();

function init() {
    //  we dont use let or const so that JS looks in the global scope
    // To visualize the mapping between the column arrays and the cells
    // on the page (DOM), rotate the board array 90 degrees counter-clockwise.
    board = [
        [null, null, null, null, null, null], // this is column 0
        [null, null, null, null, null, null], // this is column 1
        [null, null, null, null, null, null], // this is column 2
        [null, null, null, null, null, null], // this is column 3
        [null, null, null, null, null, null], // this is column 4
        [null, null, null, null, null, null], // this is column 5
        [null, null, null, null, null, null], // this is column 6
    ];
    turn = 1;
    winner = null;
    render();
}
// In response to user interaction, update all impacted state, then call render()
function handleDrop(event) {
    // Determine the colIdx for the clicked marker
    const colIdx = markerEls.indexOf(event.target);
    // Guard against the user "missing" a marker, do nothing
    if (colIdx === -1) return;
    // Shortcut variable to the column array
    const colArr = board[colIdx];
    // Determine the rowIdx (first null in the column)
    const rowIdx = colArr.indexOf(null);
    // Update the board/column state
    colArr[rowIdx] = turn;
    winner = getWinner(colIdx, rowIdx);
    turn *= -1;
    render();
}

function getWinner(colIdx, rowIdx) {
    return checkVertical(colIdx, rowIdx) || checkHorizontal(colIdx, rowIdx) ||
    checkForwardSlash(colIdx, rowIdx) || checkBackSlash(colIdx, rowIdx);
}

function checkVertical(colIdx, rowIdx) {
    const numBelow = countNumAdjacent(colIdx, rowIdx, 0, -1);
    return numBelow === 3 ? turn : null;
}

function checkHorizontal(colIdx, rowIdx) {
    const numLeft = countNumAdjacent(colIdx, rowIdx, -1, 0);
    const numRight = countNumAdjacent(colIdx, rowIdx, 1, 0);
    return (numLeft + numRight) >= 3 ? turn : null;
}

function checkForwardSlash(colIdx, rowIdx) {
    const numUpRight = countNumAdjacent(colIdx, rowIdx, 1, 1);
    const numDownLeft = countNumAdjacent(colIdx, rowIdx, -1, -1);
    return (numUpRight + numDownLeft) >= 3 ? turn : null;
}

function checkBackSlash(colIdx, rowIdx) {
    const numUpLeft = countNumAdjacent(colIdx, rowIdx, -1, 1);
    const numDownRight = countNumAdjacent(colIdx, rowIdx, 1, -1);
    return (numUpLeft + numDownRight) >= 3 ? turn : null;
}
// col/rowOffset is the value to adjust the current colIdx & rowIdx by
// after each iteration.
function countNumAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    let count = 0;
    colIdx += colOffset;
    rowIdx += rowOffset;
    while (board[colIdx] && board[colIdx][rowIdx] === turn) {
        count++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    }
    return count;
}

// Visualize all state and other info in the DOM
function render() {
    renderBoard();
    renderControls();
    renderMessage();

}

function renderBoard(){
    board.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cellVal, rowIdx) {
            // select the appropriate cell
            const cellEl = document.getElementById(`c${colIdx}r${rowIdx}`);
            cellEl.style.backgroundColor = COLORS[cellVal]; 
        });
    });
}

function renderControls() {
    // Ternary expression
    // <conditional exp> ? <truthy> : <falsy exp>;
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    // Hide/show the marker divs
    markerEls.forEach(function(markerEl, colIdx) {
        const showMarker = board[colIdx].includes(null);
        markerEl.style.visibility = showMarker && !winner ? 'visible' : 'hidden';
    });
}

function renderMessage() {
    if (winner === null) {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s turn`;
    } else if (winner === 'Tie') {
        messageEl.innerText = "It's a Tie!"
    } else {
        // We have a winner
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> WINS!`;

    }
}