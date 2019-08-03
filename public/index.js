/*
The beforeunload event is fired when the window, the document and its resources are about to be unloaded. 
The document is still visible and the event is still cancelable at this point.
*/
window.addEventListener("beforeunload", function (e) {
  alert("Call");
  // Cancel the event as stated by the standard.
  e.preventDefault();
  // Chrome requires returnValue to be set.
  e.returnValue = "";
});

window.addEventListener("load", () => {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
  ];

  const endgame = document.querySelector(".endgame");
  const text = document.querySelector(".text");
  const restart = document
    .querySelector("#restart");
  //   .addEventListener("click", playAgain);

  var count = 0;

  var player1 = [];
  var player2 = [];

  const gameboard = () => Array.from(document.querySelectorAll(".col"));

  gameboard().forEach(col => col.addEventListener("click", printValue));

  var socket = io.connect("http://ed139135.ngrok.io");
  socket.on("print", (Id) => {
    console.log(Id.Id);
    if (Id.Id == -1) {
      playAgain();
    } else {
      if (count % 2 == 0) {
        document.getElementById(parseInt(Id.Id)).innerText = "X";
        player1.push(parseInt(parseInt(Id.Id)));
        document.getElementById(parseInt(Id.Id)).removeEventListener("click", printValue);
      } else {
        document.getElementById(parseInt(Id.Id)).innerText = "O";
        player2.push(parseInt(Id.Id));
        document.getElementById(parseInt(Id.Id)).removeEventListener("click", printValue);
      }
    }
    console.log(player1, player2);
    count++;
    winLogic();
  });

  function printValue(e) {
    var did = e.target.id;

    socket.emit("id", {
      Id: did
    });
  }

  function winLogic() {
    for (let i = 0; i < winningCombos.length; i++) {
      if (winningCombos[i].every(val => player1.includes(val))) {
        console.log("player1 wins");
        gameboard().forEach(col =>
          col.removeEventListener("click", printValue)
        );
        var comboMatched = winningCombos[i];
        console.log(comboMatched);
        for (let j = 0; j < 3; j++) {
          document.getElementById(comboMatched[j]).style.background = "green";
        }
        endgame.style.display = "block";
        text.innerText = "Player1 WINS";
      } else if (winningCombos[i].every(val => player2.includes(val))) {
        console.log("player2 wins");
        gameboard().forEach(col =>
          col.removeEventListener("click", printValue)
        );
        var comboMatched = winningCombos[i];
        console.log(comboMatched);
        for (let j = 0; j < 3; j++) {
          document.getElementById(comboMatched[j]).style.background = "green";
        }
        endgame.style.display = "block";
        text.innerText = "Player2 WINS";
      }
    }
  }

  function playAgain() {
    gameboard().forEach(col => (col.innerText = ""));
    gameboard().forEach(col => col.addEventListener("click", printValue));
    endgame.style.display = "none";
    player1 = [];
    player2 = [];
    gameboard().forEach(col => (col.style.background = "white"));
    count = 0;
  }

  restart.onclick = function () {
    socket.emit('id', {
      Id: -1
    })
  };

});

/* to check if one array is subset of another array
PlayerTwo.every(val => PlayerOne.includes(val)); */