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
var totalAllowedTime = 60; // Will be set to 1hr later

// FUNCTIONS ===============================================
function beginQuiz(event) {
	event.preventDefault();

	// Start the countdown timer
	countdownTimer();

	quizHeadingEl.innerHTML = "<h3>Q1: What is JavaScript?</h3>";
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

// INITIALIZATION ==========================================
beginQuizBtn.addEventListener("click", beginQuiz);
