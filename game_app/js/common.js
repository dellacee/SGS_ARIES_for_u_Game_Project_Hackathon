/**
 * GreenGrow: Common/Shared Functions
 * Used across all pages for state management and utilities
 */

// Global Game State (shared across pages via localStorage)
const GameState = {
    greenPoints: 0,
    treeStage: 1,
    gamesPlayed: 0,
    bestQuizScore: 0,
    bestSortingScore: 0
};

// Tree Growth Thresholds
const TREE_STAGES = [
    { stage: 1, name: 'Seed', minPoints: 0, maxPoints: 20 },
    { stage: 2, name: 'Sprout', minPoints: 21, maxPoints: 50 },
    { stage: 3, name: 'Sapling', minPoints: 51, maxPoints: 100 },
    { stage: 4, name: 'Young Tree', minPoints: 101, maxPoints: 150 },
    { stage: 5, name: 'Blossoming Tree', minPoints: 151, maxPoints: Infinity }
];

/**
 * Initialize common elements on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateTreeDisplay();
    updatePointsDisplay();
});

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
    const pointsValue = document.getElementById('pointsValue');
    if (pointsValue) {
        pointsValue.textContent = GameState.greenPoints;
        pointsValue.classList.add('pulse');
        setTimeout(() => {
            pointsValue.classList.remove('pulse');
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
    const treeStage = document.getElementById('treeStage');
    const treeStageText = document.getElementById('treeStageText');
    const nextStageText = document.getElementById('nextStageText');
    
    if (treeStage) {
        // Update tree stage class
        treeStage.className = 'tree-stage stage-' + GameState.treeStage;
    }
    
    // Update stage text
    if (treeStageText) {
        treeStageText.textContent = getCurrentStageName();
    }
    
    // Update progress bar and next stage text
    updateProgressBar();
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const nextStageText = document.getElementById('nextStageText');
    
    const currentStageInfo = TREE_STAGES.find(s => s.stage === GameState.treeStage);
    
    if (!currentStageInfo) return;
    
    let progress = 0;
    let nextStagePoints = 0;
    
    if (GameState.treeStage < 5) {
        const pointsInStage = GameState.greenPoints - currentStageInfo.minPoints;
        const stageRange = currentStageInfo.maxPoints - currentStageInfo.minPoints;
        progress = (pointsInStage / stageRange) * 100;
        nextStagePoints = currentStageInfo.maxPoints + 1 - GameState.greenPoints;
        
        if (nextStageText) {
            const nextStage = TREE_STAGES.find(s => s.stage === GameState.treeStage + 1);
            nextStageText.textContent = `${nextStagePoints} points to ${nextStage.name}`;
        }
    } else {
        progress = 100;
        if (nextStageText) {
            nextStageText.textContent = 'Fully grown! 🌸';
        }
    }
    
    if (progressFill) {
        progressFill.style.width = Math.min(progress, 100) + '%';
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
    const treeStage = document.getElementById('treeStage');
    if (treeStage) {
        treeStage.classList.add('pulse');
        setTimeout(() => {
            treeStage.classList.remove('pulse');
        }, 500);
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success/error)
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

/**
 * Navigate to results page with data
 * @param {string} gameType - Type of game played
 * @param {number} pointsEarned - Points earned in this session
 * @param {object} stats - Additional game statistics
 */
function showResults(gameType, pointsEarned, stats = {}) {
    // Save data to sessionStorage for results page
    sessionStorage.setItem('gameType', gameType);
    sessionStorage.setItem('pointsEarned', pointsEarned.toString());
    
    if (stats.score !== undefined) {
        sessionStorage.setItem('score', stats.score.toString());
        sessionStorage.setItem('total', stats.total.toString());
    }
    
    if (stats.correct !== undefined) {
        sessionStorage.setItem('correct', stats.correct.toString());
        sessionStorage.setItem('wrong', stats.wrong.toString());
    }
    
    // Navigate to results page
    window.location.href = 'results.html';
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
window.GameState = GameState;
window.GameController = {
    addPoints,
    subtractPoints,
    showResults,
    showNotification,
    getPoints: () => GameState.greenPoints,
    getTreeStage: () => GameState.treeStage,
    saveProgress,
    loadProgress
};
