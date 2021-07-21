// PSEUDO CODE =============================================
// 1. One candidate (user) vs computer (questioner)
// 2. User clicks on begin-quiz to start answering questions
// 		- The timer starts counting down
// 3. Questions are serially displayed to user
// 		-Each question has four possible answers displayed
//	 		-If user selects the correct answer, increase users score on score board
//	 		-If user selects the wrong answer, deduct 10 seconds from users time left
// 4. After the user answers a question, another question should be displayed to user
// 5. Quiz is over when the user is done answering all questions OR the timer gets to zero
// 6. User is now prompted to enter their initials to save their score
// 7. Scores of past candidates are displayed on the scoreboard whenever the highscore link is clicked

// DEPENDENCIES (DOM Elements) =============================
var quizHeadingEl = document.querySelector(".quiz-heading");
var quizBodyEl = document.querySelector(".quiz-body");
var beginQuizBtn = document.querySelector("#begin-quiz");
var timerCountdown = document.querySelector("#timer-countdown");

// DATA ====================================================
var questionsArray = [];
var highscoreArray = [];
var totalAllowedTime = 60; // Will be set to 1hr later
var questionIndex = 0;
var newQuestion = {
	questionId: "Q1",
	questionText: "What is an Array?",
	correctAnswer: "A",
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

// FUNCTIONS ===============================================
function beginQuiz(event) {
	event.preventDefault();

	// Start the countdown timer
	countdownTimer();

	// Display question
	fetchQuestion();

	// Compare answers
	var nextQuestionBtn = document.querySelector(".next-button");
	if (nextQuestionBtn) {
		nextQuestionBtn.addEventListener("click", compareAnswers);
	}
}

// Create the countdown timer
function countdownTimer() {
	var timeInterval = setInterval(function () {
		// Decrement the time by 1
		totalAllowedTime--;

		var timeValue =
			totalAllowedTime < 2
				? `${totalAllowedTime} Second`
				: `${totalAllowedTime} Seconds`;
		// Update the timer on DOM
		timerCountdown.textContent = timeValue;

		// Clear interval once timer reaches zero
		if (totalAllowedTime === 0) {
			clearInterval(timeInterval);
		}
	}, 1000);
}

// Load up questions into questions array
function loadQuestions(questionObj) {
	// Ensure a question object was supplied
	if (!questionObj) return;

	// Add new question
	questionsArray.push(questionObj);
}

// Retrieves each question and displays to user
function fetchQuestion() {
	// Ensure there are questions available in the question array
	if (!questionsArray.length) return;

	// Fecth active question from array using the global question index
	var currentQuestion = questionsArray[questionIndex];

	// Display the question
	quizHeadingEl.innerHTML = `<h3>${currentQuestion.questionText}</h3>`;

	// Create the <ul> tag
	var ulEl = document.createElement("ul");

	// Loop through and display the question options
	currentQuestion.answerOptions.forEach((answerElement) => {
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
	});
	console.log(ulEl);

	// Place the ul element
	quizBodyEl.innerHTML = "";
	quizBodyEl.appendChild(ulEl);

	// Create the next question button
	var nextQuestionBtn = document.createElement("button");
	nextQuestionBtn.setAttribute("class", "next-button");
	nextQuestionBtn.setAttribute("type", "button");

	// Build the next question button
	nextQuestionBtn.textContent = "Next Question";

	// Place the next question button
	quizBodyEl.appendChild(nextQuestionBtn);

	// Increment the question index for next question
	questionIndex++;
}

// Compare users result and update highscore
function compareAnswers(userSelection, questionId) {
	// Use the question id to fetch the question object
	var questionObject = questionsArray.find(
		(question) => question.questionId === questionId
	);

	// Capitalize both values
	var theUserSelection = userSelection.toUpperCase();
	var theCorrectAnswer = questionObject.correctAnswer.toUpperCase();

	// Compare both values
	if (theUserSelection === theCorrectAnswer) {
		// Update highscore
		updateHighscore();
	}
}

// Modify the users highscore
function updateHighscore() {
	var highscoreObj = {
		user: "",
		score: 0,
	};
	highscoreArray.push(highscoreObj);
	console.log(highscoreArray);
}

// INITIALIZATION ==========================================

// Load questions
loadQuestions(newQuestion);

// Start quiz
beginQuizBtn.addEventListener("click", beginQuiz);
