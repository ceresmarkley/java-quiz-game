// variables to keep track of quiz state
var currentQuestionIndex = 0;
//time left value here of 60 seconds
var time = 60;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

var startScreenEl = document.getElementById('start-screen');
startScreenEl.querySelector('p').textContent = "This is a Javascript Quiz Module designed to test your Java wits! The timer is set to 60 seconds! You have 5 questions to answer! If you choose wrong you will lose time, so choose wisely!";


function startQuiz() {
    startBtn.addEventListener("click", function(event) {
        event.preventDefault();
        // hide start screen
        var startScreenEl = document.getElementById('start-screen');
        startScreenEl.setAttribute("class", "hide");

        // un-hide questions section
        var questionsEl = document.getElementById("questions");
        questionsEl.removeAttribute("class", "hide");

        // start timer
        timerId = setInterval(clockTick, 1000);
    
    getQuestion();

});
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title; //think dot notation

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over choices
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    // display on the page
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }

  // get user choice value
  var userChoice = buttonEl.value;

  // check if user guessed wrong
  if (userChoice !== questions[currentQuestionIndex].answer) {

    // penalize time
    time -= 10;

    // display new time on page
    timerEl.textContent = time;

    // flash wrong feedback on page for half a second
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.color = "red";
    setTimeout(function() {
        feedbackEl.textContent = "";
    }, 500);

    //play sound file
    var audio = new Audio("assets/sounds/incorrect.wav");
    audio.play();

  } else {

    // flash right feedback on page for half a second
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "Green";
    setTimeout(function() {
        feedbackEl.textContent = "";
    }, 500);

    //play sound file
    var audio = new Audio("assets/sounds/correct.wav");
    audio.play();

    

  }

  // move to next question
  currentQuestionIndex++;
  

  // check if we've run out of questions or if time ran out?
  if ( currentQuestionIndex === questions.length ||  time <= 0) {

    //if it did ???
    clearTimeout(timerId);
    quizEnd();

  } else {
    // if it didnt??
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  if (time <= 0);
  clearInterval(timerId);
 
  // show end screen
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class', "hide");

  // show final score
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  // hide questions section
  questionsEl.setAttribute("class", "hide")
}

function clockTick() {

    // if timer reaches 0, stop it
    if (time <= 0) {
      clearInterval(timerId);
      timerEl.setAttribute("class", "hide");
  
      // show timer is over message
      feedbackEl.textContent = "Time is over!";
      feedbackEl.style.color = "red";
  
      // disable all buttons
      choicesEl.querySelectorAll('.choice').forEach(button => button.disabled = true);
  
      // show end screen
      questionsEl.setAttribute("class", "hide")
      var endScreenEl = document.getElementById('end-screen');
      endScreenEl.removeAttribute('class', "hide");
  
      // show final score
      var finalScoreEl = document.getElementById('final-score');
      finalScoreEl.textContent = time;
    } else {
  
      // update timer display
      timerEl.textContent = time;
  
      // decrement timer
      time--;
    }
  }

  function saveHighscore() {

    // get the user's final score
    var finalScore = document.getElementById('final-score').textContent;
  
    // get value of input box
    var initials = initialsEl.value.trim();
  
    // make sure value wasn't empty
    if ( initials === "") {
      return;
    }
  
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  
    // format new score object for current user
    var newScore = {
      score: finalScore,
      initials: initials,
    };
  
    // save to localstorage
    highscores.push(newScore);
    localStorage.setItem('highscores', JSON.stringify(highscores));
  
    // sort the list by score in descending order
    highscores.sort(function(a, b) {
      return b.score - a.score;
    });
  
    // limit the list to the top 10 scores
    highscores = highscores.slice(0, 10);

    // redirect to next page
    window.location.href = '';
};


function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;

