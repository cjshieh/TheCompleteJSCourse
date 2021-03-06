/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
/* YOUR 3 CHALLENGES
 * Change the game with three rules:
 *
 * 1. A player loses ENTIRE score when he rolls two 6 in a row. After that, it't the next player's turn
 * 2. Add an input field to the HTML where players can set the winning score , so that they can change the predefined score of 100.
 * 3. Add another dice to the game, so that there are two dices now.  They player loses his current score when one of them is a 1.
 */

var scores, roundScore, activePlayer;

scores = [0, 0];
roundScore = 0;
activePlayer = 0;
previousDice = 0;
finalScore = 0;

function switchPlayer() {
  document.querySelector(".player-" + activePlayer + "-panel").classList.remove('active');
  document.querySelector("#current-" + activePlayer).textContent = "0";
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  document.querySelector(".player-" + activePlayer + "-panel").classList.add('active');
  document.querySelector(".dice").setAttribute("style", "display:none");
}

function setScore(dice) {
  if (previousDice === 6 && dice === 6) {
    scores[activePlayer] = 0;
    document.querySelector("#score-" + activePlayer).textContent = scores[activePlayer];
  } else {
    dice === 1 ? roundScore = 0 : roundScore += dice;
    document.getElementById("current-" + activePlayer).textContent = roundScore;
  }
}

function changeImg(dice) {
  var image = document.querySelector(".dice");
  image.onload = function () {
    document.querySelector(".dice").setAttribute("style", "display:inline");
    if (dice === 1 || (previousDice === 6 && dice === 6)) {
      setTimeout(function () { switchPlayer(); }, 300);
    }
    previousDice = dice;
  }
  image.src = "dice-" + dice + ".png";
}

function cleanUp(activePlayer) {
  var buttons = document.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id === "btn-new")
      continue;
    buttons[i].disabled = true;
  }
  var winPlayer = document.querySelector(".player-" + activePlayer + "-panel");
  winPlayer.className = "player-" + activePlayer + "-panel winner";
  winPlayer.firstElementChild.textContent = "WINNER!";
}

function reset(classname, setValue) {
  var elements = document.querySelectorAll(classname);
  if (setValue === "Player") {
    for (var i = 0; i < elements.length; i++) {
      elements[i].textContent = setValue + " " + (i + 1);
    }
  } else {
    for (var i = 0; i < elements.length; i++) {
      elements[i].textContent = setValue;
    }
  }
}

document.getElementById("btn-roll").onclick = function () {
  roundeScore = parseInt(document.querySelector("#current-" + activePlayer).textContent);
  var dice = Math.floor(Math.random() * 6) + 1;
  setScore(dice);
  changeImg(dice);
  // setScore(dice);
};

document.getElementById("btn-hold").onclick = function () {
  finalScore = document.getElementById("final-score").value;
  finalScore == "" ? finalScore = 100 : finalScore;
  scores[activePlayer] += roundScore;
  document.querySelector("#score-" + activePlayer).textContent = scores[activePlayer];
  if (scores[activePlayer] >= finalScore) {
    cleanUp(activePlayer);
  } else {
    switchPlayer();
  }
  roundScore = 0;
  document.getElementById("final-score").readOnly = true;
};

document.getElementById("btn-new").onclick = function () {
  document.querySelector(".player-0-panel").className = "player-0-panel active";
  document.querySelector(".player-1-panel").className = "player-1-panel";
  reset(".player-name", "Player");
  reset(".player-score", 0);
  reset(".player-current-score", 0);
  var buttons = document.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
  document.querySelector(".dice").setAttribute("style", "display:none;");
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  document.getElementById("final-score").readOnly = false;
};
