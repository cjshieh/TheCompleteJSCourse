/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer;

scores = [0, 0];
roundScore = 0;
activePlayer = 0;

function setClassName(activePlayer, active) {
  if (active === 0)
    return "player-" + activePlayer + "-panel";
  else
    return "player-" + activePlayer + "-panel active";
}

function switchPlayer(activePlayer) {
  var classname = setClassName(activePlayer, 0);
  document.querySelector(".player-" + activePlayer + "-panel").className = classname;
  document.querySelector("#current-" + activePlayer).textContent = "0";
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  classname = setClassName(activePlayer, 1);
  document.querySelector(".player-" + activePlayer + "-panel").className = classname;
  document.querySelector(".dice").setAttribute("style", "display:none");
  return activePlayer;
}

function setScore(dice) {
  dice === 1 ? roundScore = 0 : roundScore += dice;
  document.getElementById("current-" + activePlayer).textContent = roundScore;
}

function changeImg(dice) {
  var image = document.querySelector(".dice");
  image.onload = function () {
    document.querySelector(".dice").setAttribute("style", "display:inline");
    if (dice === 1) {
      setTimeout(function () { activePlayer = switchPlayer(activePlayer); }, 300);
    }
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
  changeImg(dice);
  setScore(dice);
};

document.getElementById("btn-hold").onclick = function () {
  scores[activePlayer] += roundScore;
  document.querySelector("#score-" + activePlayer).textContent = scores[activePlayer];
  if (scores[activePlayer] >= 100) {
    cleanUp(activePlayer);
  } else {
    activePlayer = switchPlayer(activePlayer);
  }
  roundScore = 0;
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
};