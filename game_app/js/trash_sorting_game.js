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
    const TOTAL_ITEMS = 15;
    const ITEM_FALL_SPEED = 1.5;
    const ITEM_SPAWN_INTERVAL = 3000;
    
    // Bin types
    const BIN_TYPES = [
        { 
            name: 'Rác Tái Chế',
            color: '#4CAF50', 
            emoji: '♻️',
            knowledge: '♻️ Rác tái chế giúp tiết kiệm tài nguyên và bảo vệ môi trường!'
        },
        { 
            name: 'Rác Hữu Cơ',
            color: '#8B4513', 
            emoji: '🍂',
            knowledge: '🌱 Rác hữu cơ có thể làm phân compost để nuôi cây!'
        },
        { 
            name: 'Rác Thông Thường',
            color: '#757575', 
            emoji: '🗑️',
            knowledge: '🗑️ Rác thông thường khó phân hủy. Hãy giảm thiểu!'
        },
        { 
            name: 'Rác Nguy Hại',
            color: '#F44336', 
            emoji: '☢️',
            knowledge: '⚠️ Rác nguy hại rất độc hại! Phải xử lý đúng cách!'
        }
    ];
    
    // Trash items
    const TRASH_ITEMS = [
        // Recyclable (0)
        { name: 'Chai Nhựa', type: 0, emoji: '🍾' },
        { name: 'Lon Nước', type: 0, emoji: '🥫' },
        { name: 'Giấy', type: 0, emoji: '📄' },
        { name: 'Hộp Carton', type: 0, emoji: '📦' },
        { name: 'Chai Thủy Tinh', type: 0, emoji: '🍶' },
        
        // Organic (1)
        { name: 'Vỏ Táo', type: 1, emoji: '🍎' },
        { name: 'Vỏ Chuối', type: 1, emoji: '🍌' },
        { name: 'Thức Ăn Thừa', type: 1, emoji: '🥗' },
        { name: 'Lá Cây', type: 1, emoji: '🍃' },
        { name: 'Vỏ Trứng', type: 1, emoji: '🥚' },
        
        // Residual (2)
        { name: 'Cốc Vỡ', type: 2, emoji: '☕' },
        { name: 'Xốp', type: 2, emoji: '📦' },
        { name: 'Tã Giấy', type: 2, emoji: '🧷' },
        { name: 'Bao Kẹo', type: 2, emoji: '🍬' },
        { name: 'Túi Snack', type: 2, emoji: '🥔' },
        
        // Hazardous (3)
        { name: 'Pin', type: 3, emoji: '🔋' },
        { name: 'Bóng Đèn', type: 3, emoji: '💡' },
        { name: 'Bình Xịt', type: 3, emoji: '💨' },
        { name: 'Điện Thoại Cũ', type: 3, emoji: '📱' },
        { name: 'Hộp Sơn', type: 3, emoji: '🎨' }
    ];
    
    // Game state
    let canvas, ctx;
    let gameLoop, spawnTimer;
    let timeLeft, score, correctCount, wrongCount, itemsSpawned;
    let isPlaying = false;
    let targetBinIndex = 0;
    let fallingItems = [];
    let bins = [];
    let elements = {};
    
    /**
     * Trash Item class
     */
    class TrashItem {
        constructor(itemData) {
            this.data = itemData;
            this.x = Math.random() * (canvas.width - 100) + 50;
            this.y = -80;
            this.width = 60;
            this.height = 60;
            this.speed = ITEM_FALL_SPEED;
            this.caught = false;
            this.feedbackTimer = 0;
            this.feedbackText = '';
            this.feedbackColor = '';
        }
        
        update() {
            if (!this.caught) {
                this.y += this.speed;
            }
            if (this.feedbackTimer > 0) this.feedbackTimer--;
        }
        
        draw() {
            ctx.save();
            
            // Border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 30, this.y - 30, 60, 60);
            
            // Background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x - 30, this.y - 30, 60, 60);
            
            // Emoji
            ctx.font = '35px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.data.emoji, this.x, this.y);
            
            // Feedback
            if (this.feedbackTimer > 0) {
                ctx.font = 'bold 24px Arial';
                ctx.fillStyle = this.feedbackColor;
                ctx.fillText(this.feedbackText, this.x, this.y - 50);
            }
            
            ctx.restore();
        }
        
        isOffScreen() {
            return this.y > canvas.height + 100;
        }
        
        checkCollision(bin) {
            return (
                this.x > bin.x &&
                this.x < bin.x + bin.width &&
                this.y > bin.y &&
                this.y < bin.y + bin.height
            );
        }
        
        showFeedback(text, color) {
            this.feedbackText = text;
            this.feedbackColor = color;
            this.feedbackTimer = 40;
        }
    }
    
    /**
     * Bin class
     */
    class Bin {
        constructor(type, index, posX) {
            this.type = type;
            this.index = index;
            this.width = 150;
            this.height = 100;
            this.x = posX;
            this.y = canvas.height - this.height - 20;
            this.isTarget = false;
        }
        
        draw() {
            ctx.save();
            
            // Target highlight
            if (this.isTarget) {
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 20;
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 6;
                ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            }
            
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
            if (this.isTarget) {
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#FFD700';
                ctx.fillText('🎯 MỤC TIÊU', this.x + this.width / 2, this.y - 15);
            }
            
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
        
        // Create bins
        const binSpacing = canvas.width / (BIN_TYPES.length + 1);
        bins = BIN_TYPES.map((type, index) => {
            const bin = new Bin(type, index, binSpacing * (index + 1) - 75);
            bin.isTarget = (index === targetBinIndex);
            return bin;
        });
        
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
     * Show mission notification
     */
    function showMissionNotification() {
        const targetBin = BIN_TYPES[targetBinIndex];
        const message = `🎯 NHIỆM VỤ: Phân loại rác vào thùng "${targetBin.name}" ${targetBin.emoji}!`;
        
        if (window.GameState && window.GameState.showNotification) {
            window.GameState.showNotification(message, 'success');
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
            
            if (timeLeft <= 0 || itemsSpawned >= TOTAL_ITEMS && fallingItems.length === 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }
    
    /**
     * Start spawning items
     */
    function startSpawning() {
        spawnItem();
        
        spawnTimer = setInterval(() => {
            if (!isPlaying || itemsSpawned >= TOTAL_ITEMS) {
                clearInterval(spawnTimer);
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
    }
    
    /**
     * Main update loop
     */
    function update() {
        if (!isPlaying) return;
        
        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw bins
        bins.forEach(bin => bin.draw());
        
        // Update and draw items
        for (let i = fallingItems.length - 1; i >= 0; i--) {
            const item = fallingItems[i];
            
            if (item.caught) {
                if (item.feedbackTimer === 0) {
                    fallingItems.splice(i, 1);
                }
                continue;
            }
            
            item.update();
            item.draw();
            
            // Check collision with all bins
            bins.forEach(bin => {
                if (item.checkCollision(bin)) {
                    handleItemCatch(item, bin);
                }
            });
            
            // Remove if off screen
            if (item.isOffScreen()) {
                fallingItems.splice(i, 1);
            }
        }
        
        gameLoop = requestAnimationFrame(update);
    }
    
    /**
     * Handle item catch
     */
    function handleItemCatch(item, bin) {
        item.caught = true;
        
        // Check if target bin
        if (bin.index === targetBinIndex) {
            // Check if correct item type
            if (item.data.type === targetBinIndex) {
                // CORRECT!
                score += POINTS_CORRECT;
                correctCount++;
                item.showFeedback('✓ +10', '#4CAF50');
                window.GameState.addPoints(POINTS_CORRECT);
            } else {
                // WRONG item in target bin
                score -= POINTS_WRONG;
                wrongCount++;
                item.showFeedback('✗ -5', '#F44336');
                window.GameState.subtractPoints(POINTS_WRONG);
            }
        }
        // If not target bin, no points (0 điểm)
        
        updateStats();
    }
    
    /**
     * Update stats
     */
    function updateStats() {
        if (elements.timeLeft) elements.timeLeft.textContent = timeLeft;
        if (elements.score) elements.score.textContent = score;
        if (elements.correctCount) elements.correctCount.textContent = correctCount;
        if (elements.wrongCount) elements.wrongCount.textContent = wrongCount;
    }
    
    /**
     * End game
     */
    function endGame() {
        isPlaying = false;
        clearInterval(spawnTimer);
        cancelAnimationFrame(gameLoop);
        
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

// Auto-start
document.addEventListener('DOMContentLoaded', () => {
    if (window.TrashSortingGame) {
        window.TrashSortingGame.start();
    }
});
