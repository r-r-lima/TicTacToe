Main = function () {
	
var self = this;

//current game moves
var boardMoves = new Array(0,0,0,0,0,0,0,0,0);
  
//winning moves
var winMoves = {
    1: {p1: 0, p2: 1, p3: 2},
    2: {p1: 3, p2: 4, p3: 5},
    3: {p1: 6, p2: 7, p3: 8},
    4: {p1: 0, p2: 3, p3: 6},
    5: {p1: 1, p2: 4, p3: 7},
    6: {p1: 2, p2: 5, p3: 8},
    7: {p1: 0, p2: 4, p3: 8},
	8: {p1: 2, p2: 4, p3: 6}
  }	
	
//settings
var settings = {
	numberSquares: 9,
	minPlaysCheck: 5,
	secsPl1: 30,
	secsPl2: 30,
	milisecsPl1: 0,
	milisecsPl2: 0
}

//statistics
var stats = {
	currentPlayer: 1,
	numPlays: 1,
	winner: -1
}	

//timers
var timerPl1;
var timerPl2;
	

//Handle move (clicking on square)
clickSq = function(sqNum) {
	
	//check if game already ended
	if(gameOver()){
		alert("The game has already ended! Press 'New Game'...");
		return;
	}
	
	//check availability
	if (squareEmpty(sqNum)) {
		
		//mark move & square according to current player
		boardMoves[sqNum] = stats.currentPlayer;
		getEl("sq"+sqNum).className = currentPlayerClass();
		
		//check winning move
		checkMove(stats.currentPlayer);
		
		//switch (or start) player(s) timer(s)
		handleTimer(stats.currentPlayer);
		
		//next player
		stats.currentPlayer = (stats.currentPlayer == 1) ? 2 : 1;
		stats.numPlays++;
	}
	else {
		alert("Square already used. Please choose another one.");	
	}
}

/************ Countdown timer functions ***************/

var handleTimer = function(player) {
	if(player == 1){
		stopTimer(1);
		startTimer(2);
	} else {
		stopTimer(2);
		startTimer(1);
	}
}

var startTimer = function(player) {
	timer = (player == 1) ? timerPl1 : timerPl2;
	if (timer > 0) { //prep timer for re-use
		clearTimeout(timer);
		timer = 0;
	} 
	/* (player == 1) ? doTimer_pl1() : doTimer_pl2(); */
	doTimer(player);
}

var stopTimer = function(player) {
	timer = (player == 1) ? timerPl1 : timerPl2;
	if(timer != 0) { //first call, timer still stopped
		clearTimeout(timer);
		timer = 0;
	}
}

doTimer = function(player) {
	if(gameOver()) {
		return;
	}
	var seconds = (player == 1) ? 'secsPl1' : 'secsPl2';
	var milis = (player == 1) ? 'milisecsPl1' : 'milisecsPl2';
	timer = (player == 1) ? timerPl1 : timerPl2;
	if(settings[seconds] == 0 && settings[milis] == 0) {
		stats.winner = player;
		alert("Time's over. Player "+player+" wins!");
		return;
	}
	if (settings[milis] <= 0){
		 settings[milis] = 9;
		 settings[seconds] -= 1;
	 }
	 else {
		 settings[milis] -= 1;
	}
	 getEl("t"+player).innerHTML = parseFloat(settings[seconds] + "." + settings[milis]);
	 timer = setTimeout("doTimer("+player+")", 100);
}

/******************************************************************************************/

//check if current move is a winning (or draw) one for 'player'
var checkMove = function(player) {
	//check if reached minimum moves for winning case
	if(stats.numPlays < settings.minPlaysCheck) {
		return;
	}
	
	var count = 0;
	var square = "";
	//search for winning move
	for (var move in winMoves){
		for (var i=1; i <= 3; i++){
			square = boardMoves[winMoves[move]["p"+i]];
			if(square == player) {
				count++;
			}
		}
		//if winning move found
		if (count == 3){
			stats.winner = player;
			alert("Game over! Winner: Player"+stats.winner);
			return;
		}
		count = 0;
	}
	//if draw
	if(stats.numPlays == settings.numberSquares){
	stats.winner = 0;
	alert("Game over. It's a Draw!");
	}    
}

//check if game is over
var gameOver = function() {
	return (stats.winner > -1 || stats.numPlays > settings.numberSquares);
}

//check if square in position 'pos' is empty
var squareEmpty = function(pos){
	return (boardMoves[pos]==0);
}

//get HTML element
getEl = function(id){
	return document.getElementById(id);
}

//return current player CSS class 
var currentPlayerClass = function() {
	return (stats.currentPlayer == 1) ? "sq_buttonO" : "sq_buttonX";
}

}