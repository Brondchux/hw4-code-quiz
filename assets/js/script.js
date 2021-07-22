// PSEUDO CODE =============================================
// 1. One candidate (user) vs computer (questioner)
// 2. User clicks on begin-quiz to start answering questions
// 		- The timer starts counting down
// 3. Questions are serially displayed to user
// 		-Each question has four possible answers displayed
//	 		-If user selects the correct answer, increase users score on score board
//	 		-If user selects the wrong answer, deduct 10 seconds from users time left
// 4. After the user answers a question, another question should be displayed to user
// 5. Quiz is over when the user is done attempting all questions OR the timer gets to zero
// 6. User is now prompted to enter their initials to save their score
// 7. Scores of past candidates are displayed on the scoreboard whenever the highscore link is clicked
// 8. If user already played the game before, only update their highscore if their newest score is higher

// DEPENDENCIES (DOM Elements) =============================
var quizHeadingEl = document.querySelector(".quiz-heading");
var quizBodyEl = document.querySelector(".quiz-body");
var beginQuizBtn = document.querySelector("#begin-quiz");
var highscoreBoard = document.querySelector("#highscore-board");
var timerCountdown = document.querySelector("#timer-countdown");
var displayHighscore = document.querySelector("#display-highscore");

// DATA ====================================================
var questionsArray = [];
var highscoreArray = [];
var totalQuestions = 0;
var attemptedQuestions = 0;
var totalAllowedTime = 10; // Will be set to 1hr later
var userCurrentScore = 0;
var questionIndex = 0;
var newQuestion = {
	questionId: "Q1",
	questionText: "What is an Array?",
	correctAnswer: "B",
	answerOptions: [
		{
			optionText: "A gathering of books",
			optionLabel: "A",
		},
		{
			optionText: "A collection of elements",
			optionLabel: "B",
		},
		{
			optionText: "A mobile structure",
			optionLabel: "C",
		},
	],
};
var newQuestion2 = {
	questionId: "Q2",
	questionText: "What data type is this: 'Apple' ?",
	correctAnswer: "C",
	answerOptions: [
		{
			optionText: "Sting",
			optionLabel: "A",
		},
		{
			optionText: "Skring",
			optionLabel: "B",
		},
		{
			optionText: "String",
			optionLabel: "C",
		},
	],
};
var newQuestion3 = {
	questionId: "Q3",
	questionText: "What is the result of 20 % 3 ?",
	correctAnswer: "B",
	answerOptions: [
		{
			optionText: "1",
			optionLabel: "A",
		},
		{
			optionText: "2",
			optionLabel: "B",
		},
		{
			optionText: "3",
			optionLabel: "C",
		},
		{
			optionText: "4",
			optionLabel: "D",
		},
	],
};

// FUNCTIONS ===============================================
function beginQuiz(event) {
	event.preventDefault();

	// Start the countdown timer
	countdownTimer();

	// Display question
	displayNextQuestion();
}

// Create the countdown timer
function countdownTimer() {
	var timeInterval = setInterval(function () {
		var timeValue =
			totalAllowedTime < 2
				? `${totalAllowedTime} Second`
				: `${totalAllowedTime} Seconds`;
		// Update the timer on DOM
		timerCountdown.textContent = timeValue;

		// Check if quiz is done
		quizOver();

		// Clear interval once timer reaches zero
		if (totalAllowedTime === 0) {
			clearInterval(timeInterval);
		}

		// Decrement the time by 1
		totalAllowedTime--;
	}, 1000);
}

// Load up questions into questions array
function loadQuestions(questionObj) {
	// Ensure a question object was supplied
	if (!questionObj) return;

	// Add new question
	questionsArray.push(questionObj);

	// Update our global total questions variable
	totalQuestions = questionsArray.length;
}

// Retrieves each question and displays to user
function fetchQuestion(theQuestionIndex) {
	// Ensure there are questions available in the question array
	if (!questionsArray.length) return;

	// Fecth active question from array using the global question index
	var currentQuestion = questionsArray[theQuestionIndex];

	// Display the question
	quizHeadingEl.innerHTML = `<h3>${currentQuestion.questionText}</h3>`;

	// Create the <ul> tag
	var ulEl = document.createElement("ul");

	// Loop through and display the question options
	for (var i = 0; i < currentQuestion.answerOptions.length; i++) {
		// Each answer element object
		var answerElement = currentQuestion.answerOptions[i];

		// Create the li tag
		var liEl = document.createElement("li");

		// Create the label tag
		var labelEl = document.createElement("label");
		labelEl.setAttribute("for", answerElement.optionLabel);

		// Build the label tag
		labelEl.innerHTML = `${answerElement.optionText}`;

		// Create the input [radio] tag
		var radioEl = document.createElement("input");
		radioEl.setAttribute("type", "radio");
		radioEl.setAttribute("id", answerElement.optionLabel);
		radioEl.setAttribute("name", currentQuestion.questionId);
		radioEl.setAttribute("value", answerElement.optionLabel);
		radioEl.setAttribute("data-selected", answerElement.optionLabel);

		// Build the li element
		liEl.appendChild(radioEl);
		liEl.appendChild(labelEl);

		// Build the ul element
		ulEl.appendChild(liEl);
	}

	// Place the ul element
	quizBodyEl.innerHTML = "";
	quizBodyEl.appendChild(ulEl);

	// Create the next question button
	var nextQuestionBtn = document.createElement("button");
	nextQuestionBtn.setAttribute("class", "fancy-button");
	nextQuestionBtn.setAttribute("id", "next-button");
	nextQuestionBtn.setAttribute("type", "button");

	// Build the next question button
	nextQuestionBtn.textContent = "Next Question";

	// Place the next question button
	quizBodyEl.appendChild(nextQuestionBtn);

	// Add the function to trigger when clicked
	nextQuestionBtn.addEventListener("click", compareAnswers);
}

// Compare users result and update highscore
function compareAnswers() {
	// Declare both values
	var userSelection = null;
	var questionId = null;

	// Loop through all radio input tags to get users selection and our questionId
	var inputElements = document.getElementsByTagName("input");

	for (var i = 0; i < inputElements.length; i++) {
		// update the users selection and question id
		if (inputElements[i].checked) {
			userSelection = inputElements[i].value.toUpperCase();
			questionId = inputElements[i].name.toUpperCase();
		}
	}

	// Ensure we now have values for our variables
	if (!userSelection && !questionId) return;

	// Use the question id to fetch the question object
	var questionObject = questionsArray.find(
		(question) => question.questionId === questionId
	);
	var theCorrectAnswer = questionObject.correctAnswer.toUpperCase();

	// Update highscore
	updateHighscore(userSelection, theCorrectAnswer);

	// Increment the attempted questions
	attemptedQuestions++;
}

// Modify the users highscore
function updateHighscore(theUserAnswer, theCorrectAnswer) {
	// Increment user score
	if (theUserAnswer === theCorrectAnswer) {
		userCurrentScore++;
	}

	// Deduct 10 seconds from user remaining time
	else {
		totalAllowedTime = totalAllowedTime > 9 ? totalAllowedTime - 10 : 0;
	}

	// Update the highscore on DOM
	highscoreBoard.textContent = userCurrentScore;

	// Display next question to user
	displayNextQuestion();
}

// Display the next question to user by increamenting the question index
function displayNextQuestion() {
	// Re-run the fecth question function if our index exists within the question array
	if (questionIndex < questionsArray.length) {
		// re-Call the fetch question function
		console.log(`running fetchQuestion(${questionIndex})`);
		fetchQuestion(questionIndex);
	}

	// Increment the question index for next question
	questionIndex++;
}

// Runs when the user answers all questions or time is over
function quizOver() {
	// Check if timer is over or user attempted all questions already
	if (totalAllowedTime === 0 || attemptedQuestions === totalQuestions) {
		// Display you're done message
		quizHeadingEl.innerHTML = `<h3>You're done!</h3>`;

		// Create a <div> tag for flex design
		var userTextDiv = document.createElement("div");
		userTextDiv.setAttribute("class", "user-initials");

		// Create the <label> tag
		var userTextLabel = document.createElement("label");
		userTextLabel.setAttribute("for", "userInitials");
		// Build the user text label
		userTextLabel.textContent = "Enter your initials to save your score!";

		// Create the <input> tag
		var userTextInput = document.createElement("input");
		userTextInput.setAttribute("type", "text");
		userTextInput.setAttribute("id", "userInitials");
		userTextInput.setAttribute("placeholder", "Initials here");

		// Create the save initials button
		var saveInitialsBtn = document.createElement("button");
		saveInitialsBtn.setAttribute("class", "fancy-button");
		saveInitialsBtn.setAttribute("id", "save-button");
		saveInitialsBtn.setAttribute("type", "button");

		// Build the next question button
		saveInitialsBtn.textContent = "Save Score";

		// Place the tags on to the DOM
		userTextDiv.appendChild(userTextLabel);
		userTextDiv.appendChild(userTextInput);
		quizBodyEl.innerHTML = "";
		quizBodyEl.appendChild(userTextDiv);
		quizBodyEl.appendChild(saveInitialsBtn);

		// Add the function to trigger when clicked
		saveInitialsBtn.addEventListener("click", storeUserInitials);

		// Display a replay button
		createPlayAgainBtn("Play Again");
	}
}

// Receive and store users initials
function storeUserInitials() {
	// Retrieve the input value
	var userInitials = document
		.querySelector("#userInitials")
		.value.toLowerCase();

	// Create user (candidate / player) object
	var userScoreObject = {
		initials: userInitials,
		score: userCurrentScore,
	};

	// Fetch our list of previous players and append this incoming new player object unto the array
	var currentScoresArray = fetchHighscores() ? fetchHighscores() : [];
	var incomingScoresArray = [userScoreObject];
	var combinedScoresArray = [...currentScoresArray, ...incomingScoresArray];

	// If our player already played before, just update their highest score
	if (currentScoresArray.length) {
		var returningPlayerObj = currentScoresArray.find(
			(scoreObject) => scoreObject.initials.toLowerCase() === userInitials
		);
		// Only update the highscore if the players newest score is greater than their last score
		if (returningPlayerObj && userCurrentScore > returningPlayerObj.score) {
			var updatedScoresArray = currentScoresArray.filter(
				(scoreObject) => scoreObject.initials.toLowerCase() !== userInitials
			);

			// Combine the updated score array and the incoming score array
			combinedScoresArray = [...updatedScoresArray, ...incomingScoresArray];
		}
	}

	// Store local storage
	storeHighscores(combinedScoresArray);

	// Reset the input initials field
	document.querySelector("#userInitials").value = "";

	// Display the highscore board
	showHighscoreBoard();
}

// Save our highscores to local storage
function storeHighscores(newScoresArray) {
	// Ensure the high scores array was provided else quit running this function
	if (!newScoresArray) return;

	// Store highscores in localstorage
	localStorage.setItem("highscores", JSON.stringify(newScoresArray));
}

// Fetch our highscores from local storage
function fetchHighscores() {
	return JSON.parse(localStorage.getItem("highscores"));
}

// Refresh page to play agian (hack method)
function refreshPage() {
	return location.reload();
}

// Show high score board
function showHighscoreBoard() {
	// Fetch the highscores from local storage
	var fetchedHighscores = fetchHighscores();
	if (!fetchHighscores) return;

	// Display score board heading
	quizHeadingEl.innerHTML = `<h2>Highscore Board</h2>`;

	// Create the <ul> tag
	var ulEl = document.createElement("ul");
	ulEl.setAttribute("class", "highscore-ul");

	// Loop through and display each user object from the highscores array in descending order
	for (var i = fetchedHighscores.length - 1; i > 0; i--) {
		// Each user object
		var fetchedUserScore = fetchedHighscores[i];

		// Create the li tag
		var liEl = document.createElement("li");
		liEl.setAttribute("class", "highscore-li");

		// Create the div tag
		var divEl = document.createElement("div");
		divEl.setAttribute("class", "highscore-div");

		// Create the initials p tag
		var pInitialsEl = document.createElement("p");
		pInitialsEl.setAttribute("class", "highscore-initials");

		// Create the score p tag
		var pScoreEl = document.createElement("p");
		pScoreEl.setAttribute("class", "highscore-score");

		// Build the tags
		pInitialsEl.innerHTML = `${
			i + 1
		}. ${fetchedUserScore.initials.toUpperCase()}`;
		pScoreEl.innerHTML = `${fetchedUserScore.score}`;

		// Place tags on DOM
		divEl.appendChild(pInitialsEl);
		divEl.appendChild(pScoreEl);
		liEl.appendChild(divEl);
		ulEl.appendChild(liEl);
	}

	// Place the ul elements on DOM
	quizBodyEl.innerHTML = "";
	quizBodyEl.appendChild(ulEl);

	// Display start game button
	createPlayAgainBtn("Start Game");
}

function createPlayAgainBtn(buttonText) {
	// Create the play again button
	var playAgainBtn = document.createElement("button");
	playAgainBtn.setAttribute("class", "fancy-button");
	playAgainBtn.setAttribute("id", "replay-button");
	playAgainBtn.setAttribute("type", "button");

	// Build the play again button
	playAgainBtn.textContent = buttonText;

	// Place the tags on to the DOM
	quizBodyEl.appendChild(playAgainBtn);

	// Add the function to trigger when clicked
	playAgainBtn.addEventListener("click", refreshPage);
}

// INITIALIZATION ==========================================

// Load questions
loadQuestions(newQuestion);
loadQuestions(newQuestion2);
loadQuestions(newQuestion3);

// Start quiz
beginQuizBtn.addEventListener("click", beginQuiz);

// Display highscore
displayHighscore.addEventListener("click", showHighscoreBoard);
