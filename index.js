//let currentQuestion = 1;

//popup start ui
//data reside quizdata.js
function initializeQuiz() {
    $('div.start-screen').html(QUIZSTATE.startScreen);
}

//remove opening screen and incrment question counter
//display first question for user
function startQuiz() {
    $('.btn-start').on('click', function (event) {
        $('div.start-screen').remove();
        $('.question-number').text(QUIZSTATE.getQuestionNumber());
        renderQuestions();
    });
}

function renderQuestions() {
    //rent question and answer text to the screen
    $('.quiz').html(renderQuestionAndAnswerText());
    //when the user clicks the answer
    //display dialog with correct or wrong answer display
    $('.quiz-answer').click(function () {
        let answerStatus = checkAnswer($(this).val());

        //set dialog text for correct or incorrect answer
        setDialogText(answerStatus);

        QUIZSTATE.setQuestionNumber();
        $('.question-number').text(QUIZSTATE.getQuestionNumber());

        QUIZSTATE.setCorrectCount(answerStatus);
        $('.question-score').text(QUIZSTATE.getCorrectCount());

        //load correct graphic for correct or incorrect answer
        $('#dialog').append(loadDialogGraphics(answerStatus)).append($(this).html());

        //dialog that displays correct and incorrect and navigates to the next step in the workflow.
        $("#dialog").dialog({
            resizable: false,
            height: 600,
            width: 600,
            position: {
                my: "center",
                at: "center",
                of: '.quiz-answer'
            },
            buttons: {
                "Next Question": function () {
                    $(this).dialog("close");

                    if (QUIZSTATE.getQuestionNumber() < QUIZ.length) {
                        //display next question
                        renderQuestions();
                    } else {
                        //user has gone through all questions
                        //display results page
                        createResultPage();
                    }
                }
            }
        });
    });
}

function renderQuestionAndAnswerText() {
    //write the current question and answers to the UI.
    let currentQuestion = QUIZSTATE.getQuestionNumber();
    $('.quiz').html(`
    <form>
        <div class="quiz-question">
            <h2>${QUIZ[currentQuestion].question}</h2>
        </div>
        <div class="quiz-answers">
            <input type="button" value="${QUIZ[currentQuestion].answers[0]}" class="quiz-answer" required>
            <input type="button" value="${QUIZ[currentQuestion].answers[1]}" class="quiz-answer" required>
            <input type="button" value="${QUIZ[currentQuestion].answers[2]}" class="quiz-answer" required>
            <input type="button" value="${QUIZ[currentQuestion].answers[3]}" class="quiz-answer" required>    
        </div>
    </form>
  `);
}

//load appropriate graphic based on correct or incorrect answer.
function loadDialogGraphics(answerStatus) {
    if (answerStatus === true) {
        return `<div class='centerImage'><img src="${QUIZSTATE.correctAnswerImage}"/></div>`;
    } else {
        return `<div class='centerImage'><img src="${QUIZSTATE.incorrectAnswerImage}"/></div>`;
    }
}


//display final score
function createResultPage() {
    $('.quiz').html(
        `<form>
        <span><h2>Your final SCORE is: </h2>
        <span class='final-score red-text'>${(QUIZSTATE.getCorrectCount() / QUIZSTATE.getQuestionNumber()) * 100}%</span>
        <div>
            <button class='start-over'>Restart Quiz</button>
        </div>
    </form>
  `);
}

function startOver() {
    $('.start-over').click(function (event) {
        $('main-screen').html(QUIZSTATE.startOver);
    });
}

function checkAnswer(value) {
    return (value === QUIZ[QUIZSTATE.getQuestionNumber()].correctAnswer ? true : false);
}

//dialog text based on correct or incorrect answer
function setDialogText(answer) {
    let dialogText = '';
    if (answer === true) {
        dialogText = 'Correct Answer!';
    } else {
        dialogText = [`Sorry, that was incorrect.  The correct answer is: "<span class='red-text'>${QUIZ[QUIZSTATE.getQuestionNumber()].correctAnswer}</span>"<br/>`];
    }

    $('.quiz-answer').html(`
        <div id="dialog" title="Basic dialog">
            <p>${dialogText}</p>
        </div>`);

}

//initate and start the quiz
function initiateQuiz() {
    initializeQuiz();
    startQuiz();
}

$(initiateQuiz);