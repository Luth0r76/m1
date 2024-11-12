// Variables globales
let currentQuestion = 0;
let score = 0;
let answered = new Array(questions.length).fill(false);
let userAnswers = new Array(questions.length).fill(-1);
let currentQuestions = [...questions];

// Elementos del DOM
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const quizSection = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const shuffleButton = document.getElementById('shuffle-btn');

// Inicialización
totalQuestionsSpan.textContent = questions.length;

function showQuestion(index) {
    const question = currentQuestions[index];
    questionElement.textContent = question.question;
    optionsElement.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        
        if (answered[index]) {
            if (i === question.correct) {
                button.classList.add('correct');
            }
            if (i === userAnswers[index] && i !== question.correct) {
                button.classList.add('incorrect');
            }
            if (i === userAnswers[index]) {
                button.classList.add('selected');
            }
        } else {
            button.addEventListener('click', () => selectOption(button, i));
        }
        
        optionsElement.appendChild(button);
    });
    
    currentQuestionSpan.textContent = index + 1;
    prevButton.disabled = index === 0;
    nextButton.textContent = index === currentQuestions.length - 1 ? 'Finalizar' : 'Siguiente';
    nextButton.disabled = !answered[index] && index !== currentQuestion;
}

function selectOption(button, optionIndex) {
    const allOptions = optionsElement.children;
    Array.from(allOptions).forEach(opt => opt.classList.remove('selected'));
    button.classList.add('selected');
    
    if (!answered[currentQuestion]) {
        answered[currentQuestion] = true;
        userAnswers[currentQuestion] = optionIndex;
        
        if (optionIndex === currentQuestions[currentQuestion].correct) {
            score++;
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
            allOptions[currentQuestions[currentQuestion].correct].classList.add('correct');
        }
        
        nextButton.disabled = false;
    }
}

function showScore() {
    const detailedResults = document.getElementById('detailed-results');
    
    quizSection.style.display = 'none';
    resultsSection.style.display = 'block';

    const percentage = (score / questions.length) * 100;
    document.getElementById('total-correct').textContent = score;
    document.getElementById('total-incorrect').textContent = questions.length - score;
    document.getElementById('total-percentage').textContent = percentage.toFixed(1) + '%';

    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = `
        <h2>Resultado Final</h2>
        <p>Has acertado ${score} de ${questions.length} preguntas (${percentage.toFixed(1)}%)</p>
    `;

    detailedResults.innerHTML = '<h3>Revisión Detallada</h3>';
    
    currentQuestions.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.correct;
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        resultItem.innerHTML = `
            <div class="result-question">
                <span class="icon-result ${isCorrect ? 'icon-correct' : 'icon-incorrect'}">
                    ${isCorrect ? '✓' : '✗'}
                </span>
                ${question.question}
            </div>
            <div class="result-options">
                <p><strong>Tu respuesta:</strong> ${userAnswers[index] !== -1 ? 
                    question.options[userAnswers[index]] : 'No contestada'}</p>
                <p><strong>Respuesta correcta:</strong> ${question.options[question.correct]}</p>
            </div>
        `;
        
        detailedResults.appendChild(resultItem);
    });
}

function shuffleQuestions() {
    for (let i = currentQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentQuestions[i], currentQuestions[j]] = [currentQuestions[j], currentQuestions[i]];
    }
}

function resetQuiz(shuffle = false) {
    currentQuestion = 0;
    score = 0;
    answered = new Array(questions.length).fill(false);
    userAnswers = new Array(questions.length).fill(-1);
    
    if (shuffle) {
        shuffleQuestions();
    } else {
        currentQuestions = [...questions];
    }
    
    quizSection.style.display = 'block';
    resultsSection.style.display = 'none';
    
    showQuestion(currentQuestion);
}

// Event Listeners
prevButton.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
});

nextButton.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else if (currentQuestion === questions.length - 1) {
        const allAnswered = answered.every(ans => ans === true);
        if (allAnswered) {
            showScore();
        } else {
            const unansweredQuestions = answered.reduce((acc, ans, idx) => {
                if (!ans) acc.push(idx + 1);
                return acc;
            }, []);
            alert(`Te faltan las siguientes preguntas por responder: ${unansweredQuestions.join(', ')}`);
        }
    }
});

document.getElementById('restart-btn').addEventListener('click', () => resetQuiz(false));

shuffleButton.addEventListener('click', () => {
    if (confirm('¿Quieres mezclar las preguntas y empezar de nuevo?')) {
        resetQuiz(true);
    }
});

// Iniciar el quiz
showQuestion(currentQuestion);
