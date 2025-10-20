/**
 * GreenGrow: Journey of the Green Seed
 * Main Game Controller (DEPRECATED - Use common.js instead)
 * 
 * Note: This file is kept for backward compatibility.
 * The game now uses a multi-page architecture with common.js
 * for shared functionality across pages.
 */

// Redirect to common.js functionality
console.warn('main.js is deprecated. Please use common.js for shared functionality.');

// For backward compatibility, import common.js if it exists
if (typeof window.GameState === 'undefined') {
    console.error('common.js not loaded. Game may not function properly.');
}

/**
 * Cache all DOM elements
 */
function initializeElements() {
    elements = {
        // Screens
        welcomeScreen: document.getElementById('welcomeScreen'),
        gameContainer: document.getElementById('gameContainer'),
        menuScreen: document.getElementById('menuScreen'),
        quizScreen: document.getElementById('quizScreen'),
        sortingScreen: document.getElementById('sortingScreen'),
        resultsScreen: document.getElementById('resultsScreen'),
        
        // Buttons
        startBtn: document.getElementById('startBtn'),
        homeBtn: document.getElementById('homeBtn'),
        playQuizBtn: document.getElementById('playQuizBtn'),
        playSortingBtn: document.getElementById('playSortingBtn'),
        howToPlayBtn: document.getElementById('howToPlayBtn'),
        backToMenuBtn: document.getElementById('backToMenuBtn'),
        
        // Tree & Points
        treeStage: document.getElementById('treeStage'),
        treeStageText: document.getElementById('treeStageText'),
        nextStageText: document.getElementById('nextStageText'),
        pointsValue: document.getElementById('pointsValue'),
        progressFill: document.getElementById('progressFill'),
        
        // Modal
        howToPlayModal: document.getElementById('howToPlayModal'),
        modalClose: document.querySelector('.modal-close'),
        modalBtn: document.querySelector('.modal-btn'),
        
        // Notification
        notification: document.getElementById('notification'),
        notificationText: document.getElementById('notificationText'),
        
        // Screen title
        currentScreenTitle: document.getElementById('currentScreenTitle')
    };
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Navigation buttons
    elements.startBtn?.addEventListener('click', () => {
        showScreen('menu');
    });
    
    elements.homeBtn?.addEventListener('click', () => {
        showScreen('menu');
    });
    
    elements.playQuizBtn?.addEventListener('click', () => {
        showScreen('quiz');
        if (window.QuizGame) {
            window.QuizGame.start();
        }
    });
    
    elements.playSortingBtn?.addEventListener('click', () => {
        showScreen('sorting');
        if (window.TrashSortingGame) {
            window.TrashSortingGame.start();
        }
    });
    
    elements.howToPlayBtn?.addEventListener('click', () => {
        showModal();
    });
    
    elements.backToMenuBtn?.addEventListener('click', () => {
        showScreen('menu');
    });
    
    // Modal controls
    elements.modalClose?.addEventListener('click', hideModal);
    elements.modalBtn?.addEventListener('click', hideModal);
    
    // Click outside modal to close
    elements.howToPlayModal?.addEventListener('click', (e) => {
        if (e.target === elements.howToPlayModal) {
            hideModal();
        }
    });
}

/**
 * Show a specific screen and hide others
 * @param {string} screenName - Name of the screen to show
 */
function showScreen(screenName) {
    // Hide welcome screen
    if (elements.welcomeScreen) {
        elements.welcomeScreen.classList.remove('active');
    }
    
    // Show game container if not on welcome screen
    if (elements.gameContainer) {
        elements.gameContainer.style.display = screenName === 'welcome' ? 'none' : 'block';
    }
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen[data-screen]');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    const targetScreen = document.querySelector(`[data-screen="${screenName}"]`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Update screen title
    const titles = {
        menu: 'GreenGrow',
        quiz: 'Environmental Quiz',
        sorting: 'Trash Sorting Game',
        results: 'Results'
    };
    
    if (elements.currentScreenTitle) {
        elements.currentScreenTitle.textContent = titles[screenName] || 'GreenGrow';
    }
    
    GameState.currentScreen = screenName;
}

/**
 * Show modal
 */
function showModal() {
    if (elements.howToPlayModal) {
        elements.howToPlayModal.classList.remove('hidden');
    }
}

/**
 * Hide modal
 */
function hideModal() {
    if (elements.howToPlayModal) {
        elements.howToPlayModal.classList.add('hidden');
    }
}

/**
 * Add points to the player's total
 * @param {number} points - Points to add
 */
function addPoints(points) {
    const oldStage = GameState.treeStage;
    GameState.greenPoints += points;
    
    // Don't go below 0
    if (GameState.greenPoints < 0) {
        GameState.greenPoints = 0;
    }
    
    updatePointsDisplay();
    updateTreeStage();
    
    // Check if tree grew
    if (GameState.treeStage > oldStage) {
        showNotification(`🌳 Your tree grew to ${getCurrentStageName()}!`, 'success');
        playGrowthAnimation();
    }
    
    saveProgress();
}

/**
 * Subtract points from the player's total
 * @param {number} points - Points to subtract
 */
function subtractPoints(points) {
    addPoints(-points);
}

/**
 * Update the points display
 */
function updatePointsDisplay() {
    if (elements.pointsValue) {
        elements.pointsValue.textContent = GameState.greenPoints;
        elements.pointsValue.classList.add('pulse');
        setTimeout(() => {
            elements.pointsValue.classList.remove('pulse');
        }, 500);
    }
}

/**
 * Update tree stage based on current points
 */
function updateTreeStage() {
    for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
        const stage = TREE_STAGES[i];
        if (GameState.greenPoints >= stage.minPoints) {
            GameState.treeStage = stage.stage;
            break;
        }
    }
    updateTreeDisplay();
}

/**
 * Update the tree visual display
 */
function updateTreeDisplay() {
    if (elements.treeStage) {
        // Update tree stage class
        elements.treeStage.className = 'tree-stage stage-' + GameState.treeStage;
    }
    
    // Update stage text
    if (elements.treeStageText) {
        elements.treeStageText.textContent = getCurrentStageName();
    }
    
    // Update progress bar and next stage text
    updateProgressBar();
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    const currentStageInfo = TREE_STAGES.find(s => s.stage === GameState.treeStage);
    
    if (!currentStageInfo) return;
    
    let progress = 0;
    let nextStagePoints = 0;
    
    if (GameState.treeStage < 5) {
        const pointsInStage = GameState.greenPoints - currentStageInfo.minPoints;
        const stageRange = currentStageInfo.maxPoints - currentStageInfo.minPoints;
        progress = (pointsInStage / stageRange) * 100;
        nextStagePoints = currentStageInfo.maxPoints + 1 - GameState.greenPoints;
        
        if (elements.nextStageText) {
            const nextStage = TREE_STAGES.find(s => s.stage === GameState.treeStage + 1);
            elements.nextStageText.textContent = `${nextStagePoints} points to ${nextStage.name}`;
        }
    } else {
        progress = 100;
        if (elements.nextStageText) {
            elements.nextStageText.textContent = 'Fully grown! 🌸';
        }
    }
    
    if (elements.progressFill) {
        elements.progressFill.style.width = Math.min(progress, 100) + '%';
    }
}

/**
 * Get current stage name
 * @returns {string} Current stage name
 */
function getCurrentStageName() {
    const stage = TREE_STAGES.find(s => s.stage === GameState.treeStage);
    return stage ? stage.name : 'Seed';
}

/**
 * Play growth animation
 */
function playGrowthAnimation() {
    if (elements.treeStage) {
        elements.treeStage.classList.add('pulse');
        setTimeout(() => {
            elements.treeStage.classList.remove('pulse');
        }, 500);
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success/error)
 */
function showNotification(message, type = 'success') {
    if (!elements.notification || !elements.notificationText) return;
    
    elements.notificationText.textContent = message;
    elements.notification.className = `notification ${type}`;
    elements.notification.classList.remove('hidden');
    
    setTimeout(() => {
        elements.notification.classList.add('hidden');
    }, 3000);
}

/**
 * Show results screen
 * @param {string} gameType - Type of game played
 * @param {number} pointsEarned - Points earned in this session
 * @param {object} stats - Additional game statistics
 */
function showResults(gameType, pointsEarned, stats = {}) {
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsMessage = document.getElementById('resultsMessage');
    const pointsEarnedEl = document.getElementById('pointsEarned');
    const totalPointsEl = document.getElementById('totalPoints');
    
    if (resultsTitle) {
        resultsTitle.textContent = gameType === 'quiz' ? 'Quiz Complete!' : 'Sorting Complete!';
    }
    
    if (resultsMessage) {
        let message = '';
        if (gameType === 'quiz' && stats.score) {
            message = `You answered ${stats.score} out of ${stats.total} questions correctly!`;
        } else if (gameType === 'sorting' && stats.correct !== undefined) {
            message = `You sorted ${stats.correct} items correctly and ${stats.wrong} incorrectly!`;
        }
        resultsMessage.textContent = message;
    }
    
    if (pointsEarnedEl) {
        pointsEarnedEl.textContent = pointsEarned > 0 ? '+' + pointsEarned : pointsEarned;
    }
    
    if (totalPointsEl) {
        totalPointsEl.textContent = GameState.greenPoints;
    }
    
    showScreen('results');
}

/**
 * Save game progress to localStorage
 */
function saveProgress() {
    try {
        const saveData = {
            greenPoints: GameState.greenPoints,
            treeStage: GameState.treeStage,
            gamesPlayed: GameState.gamesPlayed,
            bestQuizScore: GameState.bestQuizScore,
            bestSortingScore: GameState.bestSortingScore,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('greenGrowProgress', JSON.stringify(saveData));
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
}

/**
 * Load game progress from localStorage
 */
function loadProgress() {
    try {
        const savedData = localStorage.getItem('greenGrowProgress');
        if (savedData) {
            const data = JSON.parse(savedData);
            GameState.greenPoints = data.greenPoints || 0;
            GameState.treeStage = data.treeStage || 1;
            GameState.gamesPlayed = data.gamesPlayed || 0;
            GameState.bestQuizScore = data.bestQuizScore || 0;
            GameState.bestSortingScore = data.bestSortingScore || 0;
        }
    } catch (e) {
        console.error('Failed to load progress:', e);
    }
}

/**
 * Reset game progress
 */
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress?')) {
        GameState.greenPoints = 0;
        GameState.treeStage = 1;
        GameState.gamesPlayed = 0;
        GameState.bestQuizScore = 0;
        GameState.bestSortingScore = 0;
        
        localStorage.removeItem('greenGrowProgress');
        
        updatePointsDisplay();
        updateTreeDisplay();
        showNotification('Progress reset!', 'success');
    }
}

// Export functions for use in other scripts
window.GameController = {
    addPoints,
    subtractPoints,
    showScreen,
    showResults,
    showNotification,
    getPoints: () => GameState.greenPoints,
    getTreeStage: () => GameState.treeStage
};
