/**
 * GreenGrow: Trash Sorting Game Module - REDESIGNED
 * Pixel Art Style Drag & Drop Game
 */

const TrashSortingGame = (() => {
    // Game constants
    const GAME_DURATION = 60;
    const POINTS_CORRECT = 10;
    const POINTS_WRONG = 5;
    const PASS_SCORE = 50;
    const ITEM_FALL_SPEED = 2.5;
    const ITEM_SPAWN_INTERVAL = 2000; // 2 seconds between items - faster spawn
    const BIN_MOVE_SPEED = 8;
    
    // Bin types
    const BIN_TYPES = [
        { 
            name: 'Recyclable',
            color: '#4CAF50', 
            emoji: '♻️',
            knowledge: '♻️ Recyclable waste helps save resources and protect the environment!'
        },
        { 
            name: 'Organic',
            color: '#8B4513', 
            emoji: '🍂',
            knowledge: '🌱 Organic waste can be composted to fertilize plants!'
        },
        { 
            name: 'Residual',
            color: '#757575', 
            emoji: '🗑️',
            knowledge: '🗑️ Residual waste is hard to decompose. Minimize it!'
        },
        { 
            name: 'Hazardous',
            color: '#F44336', 
            emoji: '☢️',
            knowledge: '⚠️ Hazardous waste is very toxic! Must be disposed properly!'
        }
    ];
    
    // Trash items
    const TRASH_ITEMS = [
        // Recyclable (0)
        { name: 'Plastic Bottle', type: 0, emoji: '🍾' },
        { name: 'Can', type: 0, emoji: '🥫' },
        { name: 'Paper', type: 0, emoji: '📄' },
        { name: 'Cardboard Box', type: 0, emoji: '📦' },
        { name: 'Glass Bottle', type: 0, emoji: '🍶' },
        
        // Organic (1)
        { name: 'Apple Core', type: 1, emoji: '🍎' },
        { name: 'Banana Peel', type: 1, emoji: '🍌' },
        { name: 'Food Scraps', type: 1, emoji: '🥗' },
        { name: 'Leaves', type: 1, emoji: '🍃' },
        { name: 'Eggshell', type: 1, emoji: '🥚' },
        
        // Residual (2)
        { name: 'Broken Cup', type: 2, emoji: '☕' },
        { name: 'Styrofoam', type: 2, emoji: '📦' },
        { name: 'Diaper', type: 2, emoji: '🧷' },
        { name: 'Candy Wrapper', type: 2, emoji: '🍬' },
        { name: 'Chip Bag', type: 2, emoji: '🥔' },
        
        // Hazardous (3)
        { name: 'Battery', type: 3, emoji: '🔋' },
        { name: 'Light Bulb', type: 3, emoji: '💡' },
        { name: 'Aerosol Spray', type: 3, emoji: '💨' },
        { name: 'Old Phone', type: 3, emoji: '📱' },
        { name: 'Paint Can', type: 3, emoji: '🎨' }
    ];
    
    // Game state
    let canvas, ctx;
    let gameLoop;
    let timeLeft, score, correctCount, wrongCount, itemsSpawned;
    let isPlaying = false;
    let targetBinIndex = 0;
    let fallingItems = [];
    let playerBin = null;
    let elements = {};
    let keys = {};
    
    /**
     * Trash Item class
     */
    class TrashItem {
        constructor(itemData) {
            this.data = itemData;
            this.x = Math.random() * (canvas.width - 100) + 50;
            this.y = -80;
            this.width = 70;
            this.height = 70;
            this.speed = ITEM_FALL_SPEED;
            this.caught = false;
            this.scored = false; // Track if we already scored this item
            this.feedbackTimer = 0;
            this.feedbackText = '';
            this.feedbackColor = '';
        }
        
        update() {
            // Always continue falling - no conditions!
            this.y += this.speed;
            if (this.feedbackTimer > 0) this.feedbackTimer--;
        }
        
        draw() {
            ctx.save();
            
            // Border - thicker for better visibility
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x - 35, this.y - 35, 70, 70);
            
            // Background - white
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x - 35, this.y - 35, 70, 70);
            
            // Emoji - larger
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.data.emoji, this.x, this.y);
            
            // Feedback
            if (this.feedbackTimer > 0) {
                ctx.font = 'bold 28px Arial';
                ctx.fillStyle = this.feedbackColor;
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 3;
                ctx.strokeText(this.feedbackText, this.x, this.y - 60);
                ctx.fillText(this.feedbackText, this.x, this.y - 60);
            }
            
            ctx.restore();
        }
        
        isOffScreen() {
            return this.y > canvas.height + 100;
        }
        
        checkCollision(bin) {
            // Check if item is touching the top of the bin
            // Only trigger when item crosses into bin from above
            return (
                this.x > bin.x &&
                this.x < bin.x + bin.width &&
                this.y >= bin.y - 40 &&
                this.y <= bin.y + 20
            );
        }
        
        showFeedback(text, color) {
            this.feedbackText = text;
            this.feedbackColor = color;
            this.feedbackTimer = 50; // Longer feedback time
        }
    }
    
    /**
     * Bin class - Movable player bin
     */
    class Bin {
        constructor(type, index) {
            this.type = type;
            this.index = index;
            this.width = 150;
            this.height = 100;
            this.x = canvas.width / 2 - this.width / 2;
            this.y = canvas.height - this.height - 20;
            this.speed = BIN_MOVE_SPEED;
        }
        
        moveLeft() {
            this.x = Math.max(10, this.x - this.speed);
        }
        
        moveRight() {
            this.x = Math.min(canvas.width - this.width - 10, this.x + this.speed);
        }
        
        update() {
            // Handle keyboard input
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                this.moveLeft();
            }
            if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                this.moveRight();
            }
        }
        
        draw() {
            ctx.save();
            
            // Glow effect
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 6;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            
            // Bin body
            ctx.fillStyle = this.type.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            // Emoji
            ctx.shadowBlur = 0;
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.type.emoji, this.x + this.width / 2, this.y + this.height / 2 - 10);
            
            // Label
            ctx.font = 'bold 10px "Press Start 2P", monospace';
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(this.type.name, this.x + this.width / 2, this.y + this.height + 15);
            ctx.fillText(this.type.name, this.x + this.width / 2, this.y + this.height + 15);
            
            // Target indicator
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.fillText('🎯 TARGET', this.x + this.width / 2, this.y - 15);
            
            ctx.restore();
        }
    }
    
    /**
     * Initialize elements
     */
    function initElements() {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return false;
        
        ctx = canvas.getContext('2d');
        
        elements = {
            timeLeft: document.getElementById('timeLeft'),
            itemsLeft: document.getElementById('itemsLeft'),
            score: document.getElementById('scoreValue'),
            correctCount: document.getElementById('correctCount'),
            wrongCount: document.getElementById('wrongCount'),
            targetBinName: document.getElementById('targetBinName'),
            targetBinEmoji: document.getElementById('targetBinEmoji')
        };
        
        return true;
    }
    
    /**
     * Start game
     */
    function start() {
        if (!initElements()) {
            alert('Canvas not found!');
            return;
        }
        
        // Reset state
        timeLeft = GAME_DURATION;
        score = 0;
        correctCount = 0;
        wrongCount = 0;
        itemsSpawned = 0;
        fallingItems = [];
        isPlaying = true;
        
        // Random target bin
        targetBinIndex = Math.floor(Math.random() * BIN_TYPES.length);
        
        // Create single player bin
        playerBin = new Bin(BIN_TYPES[targetBinIndex], targetBinIndex);
        
        // Setup keyboard controls
        setupKeyboardControls();
        
        // Update UI
        updateStats();
        updateMissionDisplay();
        
        // Show mission
        showMissionNotification();
        
        // Start after 3 seconds
        setTimeout(() => {
            startTimer();
            startSpawning();
            gameLoop = requestAnimationFrame(update);
        }, 3000);
    }
    
    /**
     * Setup keyboard controls
     */
    function setupKeyboardControls() {
        // Remove old listeners
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        
        // Add new listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }
    
    /**
     * Handle key down
     */
    function handleKeyDown(e) {
        if (!isPlaying) return;
        keys[e.key] = true;
        e.preventDefault();
    }
    
    /**
     * Handle key up
     */
    function handleKeyUp(e) {
        keys[e.key] = false;
        e.preventDefault();
    }
    
    /**
     * Show mission notification
     */
    function showMissionNotification() {
        const targetBin = BIN_TYPES[targetBinIndex];
        const message = `🎯 MISSION: Sort trash into "${targetBin.name}" ${targetBin.emoji} bin!`;
        
        if (window.GameController && window.GameController.showNotification) {
            window.GameController.showNotification(message, 'success');
        }
    }
    
    /**
     * Update mission display
     */
    function updateMissionDisplay() {
        const targetBin = BIN_TYPES[targetBinIndex];
        if (elements.targetBinName) {
            elements.targetBinName.textContent = targetBin.name;
            elements.targetBinName.style.color = targetBin.color;
        }
        if (elements.targetBinEmoji) {
            elements.targetBinEmoji.textContent = targetBin.emoji;
        }
    }
    
    /**
     * Start timer
     */
    function startTimer() {
        const timerInterval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(timerInterval);
                return;
            }
            
            timeLeft--;
            updateStats();
            
            // End game when time runs out
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
        // Spawn first item immediately
        spawnItem();
        
        // Continue spawning items continuously until game ends
        const spawnInterval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(spawnInterval);
                return;
            }
            spawnItem();
        }, ITEM_SPAWN_INTERVAL);
    }
    
    /**
     * Spawn random item
     */
    function spawnItem() {
        const randomItem = TRASH_ITEMS[Math.floor(Math.random() * TRASH_ITEMS.length)];
        fallingItems.push(new TrashItem(randomItem));
        itemsSpawned++;
        updateStats(); // Update items spawned counter
        
        // Play item spawn sound
        if (window.soundManager) {
            soundManager.play('itemSpawn');
        }
    }
    
    /**
     * Main update loop
     */
    function update() {
        if (!isPlaying) {
            console.log('Game stopped: isPlaying = false');
            return;
        }
        
        try {
            // Clear canvas
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw player bin
            if (playerBin) {
                playerBin.update();
                playerBin.draw();
            }
            
            // Update and draw items
            for (let i = fallingItems.length - 1; i >= 0; i--) {
                const item = fallingItems[i];
                
                // Always update and draw
                item.update();
                item.draw();
                
                // Check collision with player bin (only score once)
                if (playerBin && !item.scored && item.checkCollision(playerBin)) {
                    handleItemCatch(item, playerBin);
                    item.scored = true; // Mark as scored so we don't score again
                }
                
                // Remove if off screen (missed)
                if (item.isOffScreen()) {
                    fallingItems.splice(i, 1);
                }
            }
            
            gameLoop = requestAnimationFrame(update);
        } catch (error) {
            console.error('Error in update loop:', error);
            isPlaying = false;
        }
    }
    
    /**
     * Handle item catch
     */
    function handleItemCatch(item, bin) {
        console.log('Item caught:', item.data.name, 'Type:', item.data.type, 'Target:', targetBinIndex);
        
        // Don't set caught = true, let item continue falling
        
        // Check if correct item type for this bin
        if (item.data.type === targetBinIndex) {
            // CORRECT!
            score += POINTS_CORRECT;
            correctCount++;
            item.showFeedback('✓ +10', '#4CAF50');
            if (window.GameController) window.GameController.addPoints(POINTS_CORRECT);
            // Play correct catch sound
            if (window.soundManager) {
                soundManager.play('itemCatchCorrect');
            }
            console.log('Correct! Score:', score);
        } else {
            // WRONG item
            score -= POINTS_WRONG;
            wrongCount++;
            item.showFeedback('✗ -5', '#F44336');
            if (window.GameController) window.GameController.subtractPoints(POINTS_WRONG);
            // Play wrong catch sound
            if (window.soundManager) {
                soundManager.play('itemCatchWrong');
            }
            console.log('Wrong! Score:', score);
        }
        
        updateStats();
    }
    
    /**
     * Update stats
     */
    function updateStats() {
        if (elements.timeLeft) elements.timeLeft.textContent = timeLeft;
        if (elements.itemsLeft) elements.itemsLeft.textContent = itemsSpawned;
        if (elements.score) elements.score.textContent = score;
        if (elements.correctCount) elements.correctCount.textContent = correctCount;
        if (elements.wrongCount) elements.wrongCount.textContent = wrongCount;
    }
    
    /**
     * End game
     */
    function endGame() {
        isPlaying = false;
        cancelAnimationFrame(gameLoop);
        
        // Remove keyboard listeners
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        
        // Stop music and play game over sound
        if (window.soundManager) {
            soundManager.stopMusic();
            soundManager.play('gameOver');
        }
        
        const passed = score >= PASS_SCORE;
        const targetBin = BIN_TYPES[targetBinIndex];
        
        // Store results
        sessionStorage.setItem('sortingGameResults', JSON.stringify({
            score: score,
            correctCount: correctCount,
            wrongCount: wrongCount,
            passed: passed,
            targetBin: targetBin.name,
            knowledge: targetBin.knowledge,
            passScore: PASS_SCORE
        }));
        
        // Navigate to results
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 1000);
    }
    
    /**
     * Public API
     */
    return {
        start: start
    };
})();

// Auto-start when included
if (typeof window !== 'undefined') {
    window.TrashSortingGame = TrashSortingGame;
}
