let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();

console.log(localStorage.getItem('score'));



document.querySelector('.js-rock-button')
  .addEventListener('click', () => {
    playGame('rock');
  });

document.querySelector('.js-paper-button')
  .addEventListener('click', () => {
    playGame('paper');
  });

document.querySelector('.js-scissors-button')
  .addEventListener('click', () => {
    playGame('scissors');
  });

  /*
  Add an event listener
  if the user presses the key r => play rock
  if the user presses the key p => play paper
  if the user presses the key s => play scissors
  */

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 82) {
        playGame('rock');
    }
    if (e.keyCode === 80) {
        playGame('paper');
    }
    if (e.keyCode === 83) {
        playGame('scissors');
    }
})

const imageperchoice = (choice) => {
    let image =''
    if(choice === 'rock') {
        image = 'images/rock-emoji.png'
    }
    else if(choice === 'paper') {
        image = 'images/paper-emoji.png'
    }
    else{
        image = 'images/scissors-emoji.png'
    }
    return image;
}



function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = '';


  if (playerMove == computerMove) {
      result = 'its a tie';
      score.ties += 1;
  }
  else if (playerMove == 'rock' & computerMove == 'scissors' || playerMove == 'paper' & computerMove == 'rock' || playerMove == 'scissors' & computerMove == 'paper' ) {
      result = 'you win';
      score.wins +=1
  }
  else {
      result = 'you lose';
      score.losses += 1;
    }
    localStorage.setItem('score', JSON.stringify(score));
    updateScoreElement();

    document.querySelector('.js-result').innerHTML = result;

    document.querySelector('.js-moves').innerHTML = `You <img src="${imageperchoice(playerMove)}" class="move-icon" /> Computer <img src="${imageperchoice(computerMove)}" class="move-icon" />`;




  // calculate result
  // update the score and store it using localStorage.setItem
  // show the new score and the updated images using "document.querySelector"

}

function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();

  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  return computerMove;
}



const test = ()=>{
    console.log('this is a test');

    setTimeout(test, 1000);
}
test();