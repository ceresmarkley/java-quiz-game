// variables to keep track of quiz state
var currentQuestionIndex = 0;
//time left value here of 60 seconds
var time = 60;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('timer');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');


function startQuiz() {
  // hide start screen
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.classList.add('hidden');

  // un-hide questions section
  var questionsEl = document.getElementById("questions");
  questionsEl.classList.remove("hidden");

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  var timerEl = document.getElementById("timer");
  timerEl.textContent = timer;

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  var titleEl = document.getElementById('title');
  titleEl.textContent = currentQuestion.question; //think dot notation

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
  if (userChoice !== currentQuestion.answer) {

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

  } else {

    // flash right feedback on page for half a second
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "red";
    setTimeout(function() {
        feedbackEl.textContent = "";
    }, 500);

  }

  // move to next question
  currentQuestionIndex++;
  

  // check if we've run out of questions or if time ran out?
  if ( currentQuestionIndex === questions.length ||  time === 0) {

    //if it did ???
    clearInterval(timerId);

    var resultsEL = document.getElementById("results");
    resultsEL.textContent = " You answered " + (questions.length - currentQuestionIndex) + "questions correctly out of " + questions.length;

  } else {
    
    // if it didnt??
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
 
  // show end screen
  var endScreenEl = document.getElementById('');
  endScreenEl.removeAttribute('class');

  // show final score
  var finalScoreEl = document.getElementById('');
  finalScoreEl.textContent = time;

  // hide questions section
}

function clockTick() {
  // update time
  // decrement the variable we are using to track time
  time -= 1;
  timerEl.textContent = time; // update out time

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // get value of input box
  localStorage.setItem("initials", JSON.stringify(initialsEl));
}

initialsEl.addEventListener("submit", function(event) {
    event.preventDefault();
    var initials = initialsEl.value.trim();

  // make sure value wasn't empty
    if ( initials === "") {
        return;
    }
 // get saved scores from localstorage, or if not any, set to empty array
    
    var highscores = JSON.parse(localStorage.getItem("")) /* what would go inside the PARSE??*/ || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = '';
});


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

