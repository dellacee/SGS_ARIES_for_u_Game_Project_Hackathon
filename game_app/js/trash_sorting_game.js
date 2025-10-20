/**
 * GreenGrow: Trash Sorting Game Module
 * Catch falling trash items with correct color-coded bins
 */

const TrashSortingGame = (() => {
    // Game constants
    const GAME_DURATION = 60; // seconds
    const POINTS_CORRECT = 5;
    const POINTS_WRONG = 3;
    const ITEM_FALL_SPEED = 2;
    const ITEM_SPAWN_INTERVAL = 2000; // milliseconds
    const BIN_SPEED = 8;
    
    // Bin types with colors
    const BIN_TYPES = [
        { name: 'Recyclable', color: '#4CAF50', emoji: '♻️' },   // Green
        { name: 'Organic', color: '#8B4513', emoji: '🍂' },      // Brown
        { name: 'Residual', color: '#757575', emoji: '🗑️' },     // Grey
        { name: 'Hazardous', color: '#F44336', emoji: '☢️' }     // Red
    ];
    
    // Trash items database
    const TRASH_ITEMS = [
        // Recyclable (Green - index 0)
        { name: 'Plastic Bottle', type: 0, emoji: '🍾' },
        { name: 'Soda Can', type: 0, emoji: '🥫' },
        { name: 'Paper', type: 0, emoji: '📄' },
        { name: 'Cardboard', type: 0, emoji: '📦' },
        { name: 'Glass Bottle', type: 0, emoji: '🍶' },
        { name: 'Metal Can', type: 0, emoji: '🥫' },
        
        // Organic (Brown - index 1)
        { name: 'Apple Core', type: 1, emoji: '🍎' },
        { name: 'Banana Peel', type: 1, emoji: '🍌' },
        { name: 'Food Scraps', type: 1, emoji: '🥗' },
        { name: 'Leaves', type: 1, emoji: '🍃' },
        { name: 'Eggshells', type: 1, emoji: '🥚' },
        { name: 'Coffee Grounds', type: 1, emoji: '☕' },
        
        // Residual (Grey - index 2)
        { name: 'Broken Cup', type: 2, emoji: '☕' },
        { name: 'Styrofoam', type: 2, emoji: '📦' },
        { name: 'Diaper', type: 2, emoji: '🧷' },
        { name: 'Candy Wrapper', type: 2, emoji: '🍬' },
        { name: 'Chip Bag', type: 2, emoji: '🥔' },
        
        // Hazardous (Red - index 3)
        { name: 'Battery', type: 3, emoji: '🔋' },
        { name: 'Light Bulb', type: 3, emoji: '💡' },
        { name: 'Spray Can', type: 3, emoji: '💨' },
        { name: 'Old Phone', type: 3, emoji: '📱' },
        { name: 'Paint Can', type: 3, emoji: '🎨' }
    ];
    
    // Game state
    let canvas, ctx;
    let gameLoop;
    let spawnTimer;
    let timeLeft;
    let correctCount = 0;
    let wrongCount = 0;
    let isPlaying = false;
    let activeBinIndex = 0;
    
    // Game objects
    let fallingItems = [];
    let bins = [];
    
    // DOM elements
    let elements = {};
    
    /**
     * Trash Item class
     */
    class TrashItem {
        constructor(itemData) {
            this.data = itemData;
            this.x = Math.random() * (canvas.width - 60) + 30;
            this.y = -50;
            this.width = 50;
            this.height = 50;
            this.speed = ITEM_FALL_SPEED;
            this.caught = false;
        }
        
        update() {
            this.y += this.speed;
        }
        
        draw() {
            // Draw emoji
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.data.emoji, this.x, this.y);
            
            // Draw item name (small text)
            ctx.font = '10px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(this.data.name, this.x, this.y + 35);
        }
        
        isOffScreen() {
            return this.y > canvas.height + 50;
        }
        
        checkCollision(bin) {
            return (
                this.x > bin.x &&
                this.x < bin.x + bin.width &&
                this.y + this.height > bin.y &&
                this.y < bin.y + bin.height
            );
        }
    }
    
    /**
     * Bin class
     */
    class Bin {
        constructor(type, index) {
            this.type = type;
            this.index = index;
            this.width = 80;
            this.height = 60;
            this.x = canvas.width / 2 - this.width / 2;
            this.y = canvas.height - this.height - 10;
        }
        
        draw(isActive) {
            // Draw bin rectangle
            ctx.fillStyle = this.type.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Draw border
            ctx.strokeStyle = isActive ? '#FFD700' : '#000';
            ctx.lineWidth = isActive ? 4 : 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            // Draw emoji
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.type.emoji, this.x + this.width / 2, this.y + this.height / 2);
            
            // Draw label
            ctx.font = '12px Arial';
            ctx.fillStyle = '#FFF';
            ctx.fillText(this.type.name, this.x + this.width / 2, this.y + this.height + 15);
        }
        
        moveLeft() {
            this.x = Math.max(10, this.x - BIN_SPEED);
        }
        
        moveRight() {
            this.x = Math.min(canvas.width - this.width - 10, this.x + BIN_SPEED);
        }
    }
    
    /**
     * Initialize game elements
     */
    function initElements() {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return false;
        
        ctx = canvas.getContext('2d');
        
        elements = {
            timeLeft: document.getElementById('timeLeft'),
            correctCount: document.getElementById('correctCount'),
            wrongCount: document.getElementById('wrongCount'),
            quitSortingBtn: document.getElementById('quitSortingBtn'),
            binSelectBtns: document.querySelectorAll('.bin-select-btn')
        };
        
        // Setup event listeners
        elements.quitSortingBtn?.addEventListener('click', quitGame);
        
        // Bin selection buttons
        elements.binSelectBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => selectBin(index));
        });
        
        // Keyboard controls
        document.addEventListener('keydown', handleKeyPress);
        
        return true;
    }
    
    /**
     * Start the game
     */
    function start() {
        if (!initElements()) {
            alert('Canvas not found! Cannot start game.');
            return;
        }
        
        // Reset game state
        timeLeft = GAME_DURATION;
        correctCount = 0;
        wrongCount = 0;
        fallingItems = [];
        isPlaying = true;
        activeBinIndex = 0;
        
        // Create bins
        bins = BIN_TYPES.map((type, index) => new Bin(type, index));
        
        // Update UI
        updateStats();
        selectBin(0);
        
        // Start timers
        startTimer();
        startSpawning();
        
        // Start game loop
        gameLoop = requestAnimationFrame(update);
    }
    
    /**
     * Start countdown timer
     */
    function startTimer() {
        const timerInterval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(timerInterval);
                return;
            }
            
            timeLeft--;
            updateStats();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }
    
    /**
     * Start spawning items
     */
    function startSpawning() {
        spawnItem(); // Spawn first item immediately
        
        spawnTimer = setInterval(() => {
            if (!isPlaying) {
                clearInterval(spawnTimer);
                return;
            }
            spawnItem();
        }, ITEM_SPAWN_INTERVAL);
    }
    
    /**
     * Spawn a new trash item
     */
    function spawnItem() {
        const randomItem = TRASH_ITEMS[Math.floor(Math.random() * TRASH_ITEMS.length)];
        fallingItems.push(new TrashItem(randomItem));
    }
    
    /**
     * Select active bin
     */
    function selectBin(index) {
        activeBinIndex = index;
        
        // Update button states
        elements.binSelectBtns.forEach((btn, i) => {
            if (i === index) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    /**
     * Handle keyboard input
     */
    function handleKeyPress(e) {
        if (!isPlaying) return;
        
        const activeBin = bins[activeBinIndex];
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                activeBin.moveLeft();
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                activeBin.moveRight();
                e.preventDefault();
                break;
            case '1':
                selectBin(0);
                break;
            case '2':
                selectBin(1);
                break;
            case '3':
                selectBin(2);
                break;
            case '4':
                selectBin(3);
                break;
        }
    }
    
    /**
     * Main game update loop
     */
    function update() {
        if (!isPlaying) return;
        
        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw falling items
        for (let i = fallingItems.length - 1; i >= 0; i--) {
            const item = fallingItems[i];
            
            if (item.caught) {
                fallingItems.splice(i, 1);
                continue;
            }
            
            item.update();
            item.draw();
            
            // Check collision with active bin
            const activeBin = bins[activeBinIndex];
            if (item.checkCollision(activeBin)) {
                handleCatch(item);
                fallingItems.splice(i, 1);
                continue;
            }
            
            // Remove if off screen (missed)
            if (item.isOffScreen()) {
                fallingItems.splice(i, 1);
            }
        }
        
        // Draw all bins (inactive ones transparent)
        bins.forEach((bin, index) => {
            if (index === activeBinIndex) {
                bin.draw(true);
            } else {
                ctx.globalAlpha = 0.3;
                bin.draw(false);
                ctx.globalAlpha = 1.0;
            }
        });
        
        gameLoop = requestAnimationFrame(update);
    }
    
    /**
     * Handle catching an item
     */
    function handleCatch(item) {
        const isCorrect = item.data.type === activeBinIndex;
        
        if (isCorrect) {
            correctCount++;
            window.GameController.addPoints(POINTS_CORRECT);
            showFeedback('✓ Correct!', '#4CAF50');
        } else {
            wrongCount++;
            window.GameController.subtractPoints(POINTS_WRONG);
            showFeedback('✗ Wrong bin!', '#F44336');
        }
        
        updateStats();
    }
    
    /**
     * Show feedback on canvas
     */
    function showFeedback(text, color) {
        // This could be enhanced with a proper notification system
        // For now, we'll use the game controller's notification
        window.GameController.showNotification(text, color === '#4CAF50' ? 'success' : 'error');
    }
    
    /**
     * Update stats display
     */
    function updateStats() {
        if (elements.timeLeft) {
            elements.timeLeft.textContent = timeLeft;
        }
        if (elements.correctCount) {
            elements.correctCount.textContent = correctCount;
        }
        if (elements.wrongCount) {
            elements.wrongCount.textContent = wrongCount;
        }
    }
    
    /**
     * End the game
     */
    function endGame() {
        isPlaying = false;
        
        if (gameLoop) {
            cancelAnimationFrame(gameLoop);
        }
        
        if (spawnTimer) {
            clearInterval(spawnTimer);
        }
        
        const pointsEarned = (correctCount * POINTS_CORRECT) - (wrongCount * POINTS_WRONG);
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleKeyPress);
        
        if (window.GameController && window.GameController.showResults) {
            window.GameController.showResults('sorting', pointsEarned, {
                correct: correctCount,
                wrong: wrongCount
            });
        } else {
            // Fallback navigation
            window.location.href = `results.html?type=sorting&points=${pointsEarned}&correct=${correctCount}&wrong=${wrongCount}`;
        }
    }
    
    /**
     * Quit game early
     */
    function quitGame() {
        if (confirm('Are you sure you want to quit?')) {
            isPlaying = false;
            if (gameLoop) {
                cancelAnimationFrame(gameLoop);
            }
            if (spawnTimer) {
                clearInterval(spawnTimer);
            }
            document.removeEventListener('keydown', handleKeyPress);
            window.location.href = 'menu.html';
        }
    }
    
    // Public API
    return {
        start
    };
})();

// Make available globally
window.TrashSortingGame = TrashSortingGame;
