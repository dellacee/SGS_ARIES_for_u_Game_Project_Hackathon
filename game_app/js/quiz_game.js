/**
 * GreenGrow: Quiz Game Module
 * Environmental and SDG questions
 */

const QuizGame = (() => {
    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let selectedAnswer = null;
    
    const TOTAL_QUESTIONS = 10;
    const POINTS_PER_CORRECT = 10;
    
    // Question database - Environmental & SDG focused
    const questionBank = [
        {
            question: "Which UN Sustainable Development Goal focuses on Climate Action?",
            answers: ["SDG 11", "SDG 13", "SDG 15", "SDG 7"],
            correct: 1,
            explanation: "SDG 13 is Climate Action, which aims to take urgent action to combat climate change and its impacts."
        },
        {
            question: "What percentage of plastic waste is actually recycled globally?",
            answers: ["Less than 10%", "About 25%", "About 50%", "More than 75%"],
            correct: 0,
            explanation: "Sadly, less than 10% of all plastic ever produced has been recycled. Most ends up in landfills or the environment."
        },
        {
            question: "Which bin should you use for food scraps and vegetable peels?",
            answers: ["Green (Recyclable)", "Brown (Organic)", "Grey (Residual)", "Red (Hazardous)"],
            correct: 1,
            explanation: "Food scraps and organic waste go in the Brown bin for composting, where they can be turned into nutrient-rich soil."
        },
        {
            question: "What does SDG 12 focus on?",
            answers: ["Clean Water", "Responsible Consumption and Production", "Quality Education", "Zero Hunger"],
            correct: 1,
            explanation: "SDG 12 promotes sustainable consumption and production patterns to reduce waste and environmental impact."
        },
        {
            question: "How long does it take for a plastic bottle to decompose in nature?",
            answers: ["1-5 years", "10-20 years", "50-100 years", "450+ years"],
            correct: 3,
            explanation: "Plastic bottles can take over 450 years to decompose, which is why recycling them is so important!"
        },
        {
            question: "Which of these items belongs in the RED hazardous waste bin?",
            answers: ["Banana peel", "Old batteries", "Plastic bottle", "Newspaper"],
            correct: 1,
            explanation: "Batteries contain toxic chemicals and should go in the Red hazardous waste bin for safe disposal."
        },
        {
            question: "What is the main cause of global warming?",
            answers: ["Volcanic eruptions", "Solar radiation changes", "Greenhouse gas emissions", "Ocean currents"],
            correct: 2,
            explanation: "Human activities that produce greenhouse gases (like CO2) are the primary cause of current global warming."
        },
        {
            question: "Which material can be recycled indefinitely without losing quality?",
            answers: ["Paper", "Plastic", "Glass", "Wood"],
            correct: 2,
            explanation: "Glass can be recycled endlessly without any loss in quality or purity, making it a truly sustainable material!"
        },
        {
            question: "SDG 15 focuses on protecting life on land. What percentage of Earth's land is currently forest?",
            answers: ["About 10%", "About 20%", "About 31%", "About 50%"],
            correct: 2,
            explanation: "Approximately 31% of Earth's land is covered by forests, but deforestation is reducing this rapidly."
        },
        {
            question: "What happens to organic waste when it's composted?",
            answers: ["It turns into toxic sludge", "It becomes nutrient-rich soil", "It releases harmful gases", "It becomes plastic"],
            correct: 1,
            explanation: "Composting transforms organic waste into nutrient-rich soil that can help plants grow, completing the natural cycle!"
        },
        {
            question: "Which type of energy is renewable and doesn't produce greenhouse gases?",
            answers: ["Coal", "Natural gas", "Solar power", "Nuclear"],
            correct: 2,
            explanation: "Solar power is renewable and produces no greenhouse gases during operation, making it a clean energy source."
        },
        {
            question: "Where should you dispose of an old smartphone?",
            answers: ["Green bin", "Grey bin", "Red hazardous bin", "Brown bin"],
            correct: 2,
            explanation: "Electronics contain hazardous materials and valuable metals, so they should go in the Red bin or e-waste recycling."
        },
        {
            question: "What is biodiversity?",
            answers: ["The variety of life on Earth", "A type of fuel", "A recycling method", "A climate pattern"],
            correct: 0,
            explanation: "Biodiversity refers to the variety of all living organisms on Earth, which is essential for healthy ecosystems."
        },
        {
            question: "How much of the Earth's water is fresh water?",
            answers: ["Less than 3%", "About 25%", "About 50%", "About 75%"],
            correct: 0,
            explanation: "Only about 2.5% of Earth's water is fresh water, and much of that is frozen in glaciers and ice caps!"
        },
        {
            question: "Which action helps reduce your carbon footprint the most?",
            answers: ["Using reusable bags", "Eating less meat", "Turning off lights", "Recycling paper"],
            correct: 1,
            explanation: "Reducing meat consumption significantly lowers carbon emissions, as animal agriculture is a major source of greenhouse gases."
        },
        {
            question: "What should you do with aluminum cans?",
            answers: ["Throw in Grey bin", "Put in Brown bin", "Recycle in Green bin", "Put in Red bin"],
            correct: 2,
            explanation: "Aluminum cans are highly recyclable and should go in the Green recycling bin. Recycling aluminum saves 95% of the energy needed to make new aluminum!"
        },
        {
            question: "What does 'carbon neutral' mean?",
            answers: ["Producing no waste", "Balancing carbon emissions with carbon removal", "Using no electricity", "Planting trees only"],
            correct: 1,
            explanation: "Carbon neutral means balancing the carbon dioxide released with an equivalent amount removed from the atmosphere."
        },
        {
            question: "Which of these is NOT a greenhouse gas?",
            answers: ["Carbon dioxide (CO2)", "Methane (CH4)", "Oxygen (O2)", "Nitrous oxide (N2O)"],
            correct: 2,
            explanation: "Oxygen is not a greenhouse gas. CO2, methane, and nitrous oxide trap heat in the atmosphere."
        },
        {
            question: "What is the benefit of composting?",
            answers: ["Creates pollution", "Reduces landfill waste and enriches soil", "Attracts pests", "Wastes time"],
            correct: 1,
            explanation: "Composting reduces waste sent to landfills and creates nutrient-rich soil for gardens and agriculture!"
        },
        {
            question: "By 2030, what does SDG 13 aim to achieve?",
            answers: ["Build more factories", "Strengthen climate change resilience", "Increase carbon emissions", "Stop recycling"],
            correct: 1,
            explanation: "SDG 13 aims to strengthen resilience and adaptive capacity to climate-related hazards by 2030."
        },
        {
            question: "Which everyday item takes the longest to decompose?",
            answers: ["Paper bag (1 month)", "Aluminum can (200 years)", "Styrofoam cup (500+ years)", "Banana peel (2 weeks)"],
            correct: 2,
            explanation: "Styrofoam can take over 500 years to decompose and doesn't biodegrade easily, which is why avoiding it is important!"
        },
        {
            question: "What should you do with leftover paint?",
            answers: ["Pour down the drain", "Throw in regular trash", "Take to hazardous waste facility", "Bury in backyard"],
            correct: 2,
            explanation: "Paint contains hazardous chemicals and should be taken to a proper hazardous waste disposal facility."
        }
    ];
    
    // DOM elements
    let elements = {};
    
    /**
     * Initialize quiz elements
     */
    function initElements() {
        elements = {
            questionNumber: document.getElementById('questionNumber'),
            questionText: document.getElementById('questionText'),
            answersContainer: document.getElementById('answersContainer'),
            answerButtons: document.querySelectorAll('.answer-btn'),
            quizFeedback: document.getElementById('quizFeedback'),
            feedbackText: document.getElementById('feedbackText'),
            nextQuestionBtn: document.getElementById('nextQuestionBtn'),
            quitQuizBtn: document.getElementById('quitQuizBtn')
        };
        
        // Setup event listeners
        elements.answerButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => selectAnswer(index));
        });
        
        elements.nextQuestionBtn?.addEventListener('click', nextQuestion);
        elements.quitQuizBtn?.addEventListener('click', quitQuiz);
    }
    
    /**
     * Start a new quiz
     */
    function start() {
        initElements();
        currentQuestionIndex = 0;
        score = 0;
        
        // Select random questions
        questions = getRandomQuestions(TOTAL_QUESTIONS);
        
        // Hide feedback initially
        if (elements.quizFeedback) {
            elements.quizFeedback.classList.add('hidden');
        }
        
        showQuestion();
    }
    
    /**
     * Get random questions from the bank
     */
    function getRandomQuestions(count) {
        const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
    
    /**
     * Display current question
     */
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
            return;
        }
        
        const question = questions[currentQuestionIndex];
        selectedAnswer = null;
        
        // Update question number
        if (elements.questionNumber) {
            elements.questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${TOTAL_QUESTIONS}`;
        }
        
        // Update question text
        if (elements.questionText) {
            elements.questionText.textContent = question.question;
        }
        
        // Update answer buttons
        elements.answerButtons.forEach((btn, index) => {
            btn.textContent = question.answers[index];
            btn.classList.remove('selected', 'correct', 'incorrect');
            btn.disabled = false;
        });
        
        // Hide feedback
        if (elements.quizFeedback) {
            elements.quizFeedback.classList.add('hidden');
        }
    }
    
    /**
     * Handle answer selection
     */
    function selectAnswer(answerIndex) {
        if (selectedAnswer !== null) return; // Already answered
        
        selectedAnswer = answerIndex;
        const question = questions[currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;
        
        // Disable all buttons
        elements.answerButtons.forEach(btn => btn.disabled = true);
        
        // Highlight correct and selected answers
        elements.answerButtons[question.correct].classList.add('correct');
        
        if (!isCorrect) {
            elements.answerButtons[answerIndex].classList.add('incorrect');
        } else {
            score++;
            window.GameController.addPoints(POINTS_PER_CORRECT);
        }
        
        // Show feedback
        showFeedback(isCorrect, question.explanation);
    }
    
    /**
     * Show feedback message
     */
    function showFeedback(isCorrect, explanation) {
        if (!elements.quizFeedback || !elements.feedbackText) return;
        
        const emoji = isCorrect ? '✅' : '❌';
        const result = isCorrect ? 'Correct!' : 'Not quite right.';
        
        elements.feedbackText.innerHTML = `
            <strong>${emoji} ${result}</strong><br>
            ${explanation}
        `;
        
        elements.quizFeedback.classList.remove('hidden', 'incorrect');
        if (!isCorrect) {
            elements.quizFeedback.classList.add('incorrect');
        }
    }
    
    /**
     * Move to next question
     */
    function nextQuestion() {
        currentQuestionIndex++;
        showQuestion();
    }
    
    /**
     * End the quiz and show results
     */
    function endQuiz() {
        const pointsEarned = score * POINTS_PER_CORRECT;
        
        if (window.GameController && window.GameController.showResults) {
            window.GameController.showResults('quiz', pointsEarned, {
                score: score,
                total: TOTAL_QUESTIONS
            });
        } else {
            // Fallback navigation
            window.location.href = `results.html?type=quiz&points=${pointsEarned}&score=${score}&total=${TOTAL_QUESTIONS}`;
        }
    }
    
    /**
     * Quit quiz early
     */
    function quitQuiz() {
        if (confirm('Are you sure you want to quit? Your progress will be saved.')) {
            window.location.href = 'menu.html';
        }
    }
    
    // Public API
    return {
        start
    };
})();

// Make available globally
window.QuizGame = QuizGame;
