const twoPlayersBtn = document.getElementById('twoPlayersBtn');
const aiBtn = document.getElementById('aiBtn');
const modeSelection = document.getElementById('modeSelection');
const levelSelection = document.getElementById('levelSelection');
const levelBtns = document.querySelectorAll('.levelBtn');
const gameArea = document.getElementById('gameArea');
const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const gameMessage = document.getElementById('gameMessage');
const restartBtn = document.getElementById('restartBtn');
const winLine = document.getElementById('winLine');

let board = Array(9).fill('');
let currentPlayer = 'X';
let vsAI = false;
let gameOver = false;
let aiLevel = 1;

// Step 1: select mode
twoPlayersBtn.addEventListener('click', () => {
  vsAI = false;
  modeSelection.classList.add('hidden');
  showGame();
});

aiBtn.addEventListener('click', () => {
  vsAI = true;
  modeSelection.classList.add('hidden');
  levelSelection.classList.remove('hidden');
});

// Step 2: select level
levelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    aiLevel = parseInt(btn.getAttribute('data-level'));
    levelSelection.classList.add('hidden');
    showGame();
  });
});

function showGame() {
  gameArea.classList.remove('hidden');
  resetBoard();
}

function resetBoard(){
  board = Array(9).fill('');
  cells.forEach(c=>c.textContent='');
  currentPlayer = 'X';
  gameOver=false;
  gameMessage.textContent='Start the game!';
  winLine.style.width = '0';
}

// Cell click
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    
    if(board[index]==='' && !gameOver){
      if(!vsAI){
        makeMove(index, currentPlayer);
        currentPlayer = currentPlayer==='X'?'O':'X';
      } else if(currentPlayer==='X'){
        makeMove(index,'X');
        currentPlayer='O';
        if(!gameOver) setTimeout(aiTurn,400);
      }
    }
  });
});

function makeMove(index,player){
  board[index]=player;
  cells[index].textContent=player;
  checkWinner();
}

function checkWinner(){
  const winCombos=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(const combo of winCombos){
    const [a,b,c]=combo;
    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      gameMessage.textContent=`${board[a]} wins!`;
      gameOver=true;
      drawWinLine(combo);
      return;
    }
  }

  if(!board.includes('')){
    gameMessage.textContent="It's a tie!";
    gameOver=true;
    winLine.style.width='0';
  }
}

function drawWinLine(combo){
  const startCell = cells[combo[0]];
  const endCell = cells[combo[2]];

  const startX = startCell.offsetLeft + startCell.offsetWidth / 2;
  const startY = startCell.offsetTop + startCell.offsetHeight / 2;

  const endX = endCell.offsetLeft + endCell.offsetWidth / 2;
  const endY = endCell.offsetTop + endCell.offsetHeight / 2;

  const length = Math.hypot(endX - startX, endY - startY);
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

  winLine.style.width = length + 'px';
  winLine.style.transform = `rotate(${angle}deg)`;
  winLine.style.top = startY + 'px';
  winLine.style.left = startX + 'px';
}


// AI moves
function aiTurn(){
  let move;
  if(aiLevel===1) move=randomMove();
  else if(aiLevel===2) move=mediumMove();
  else move=minimaxMove();
  
  if(move!==undefined){
    makeMove(move,'O');
    currentPlayer='X';
  }
}

function randomMove(){
  const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function mediumMove(){
  const winCombos=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(const combo of winCombos){
    const [a,b,c]=combo;
    const values=[board[a],board[b],board[c]];
    if(values.filter(v=>'X'===v).length===2 && values.includes('')) return [a,b,c][values.indexOf('')];
  }
  return randomMove();
}

function minimaxMove(){
  let bestScore=-Infinity;
  let move;
  for(let i=0;i<9;i++){
    if(board[i]===''){
      board[i]='O';
      let score=minimax(board,false);
      board[i]='';
      if(score>bestScore){bestScore=score; move=i;}
    }
  }
  return move;
}

function minimax(b,isMax){
  const winner=scoreWinner(b);
  if(winner!==null) return winner;
  if(!b.includes('')) return 0;

  if(isMax){
    let best=-Infinity;
    for(let i=0;i<9;i++){
      if(b[i]===''){ b[i]='O'; let s=minimax(b,false); b[i]=''; best=Math.max(s,best);}
    }
    return best;
  } else {
    let best=Infinity;
    for(let i=0;i<9;i++){
      if(b[i]===''){ b[i]='X'; let s=minimax(b,true); b[i]=''; best=Math.min(s,best);}
    }
    return best;
  }
}

function scoreWinner(b){
  const combos=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(const combo of combos){
    const [a,b,c]=combo;
    if(b[a] && b[a]===b[b] && b[a]===b[c]){
      if(b[a]==='O') return 10;
      if(b[a]==='X') return -10;
    }
  }
  return null;
}

// Restart button
restartBtn.addEventListener('click', () => {
  board = Array(9).fill('');
  cells.forEach(c => c.textContent = '');
  gameOver = false;
  currentPlayer = 'X';
  gameMessage.textContent = 'Start the game!';
  winLine.style.width = '0';
});
