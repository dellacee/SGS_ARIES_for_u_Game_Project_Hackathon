/**
 * GreenGrow: Trash Sorting Game Module - REDESIGNED
 * Drag & Drop trash items into the TARGET bin
 */

const TrashSortingGame = (() => {
    // Game constants
    const GAME_DURATION = 60; // seconds
    const POINTS_CORRECT = 10; // Correct item in target bin
    const POINTS_WRONG = 5;    // Wrong item in target bin
    const PASS_SCORE = 50;     // Score needed to pass
    const TOTAL_ITEMS = 15;    // Total items per round
    const ITEM_FALL_SPEED = 1.5;
    const ITEM_SPAWN_INTERVAL = 3000; // milliseconds
    
    // Bin types with Vietnamese names
    const BIN_TYPES = [
        { 
            name: 'Rác Tái Chế', 
            nameEn: 'Recyclable',
            color: '#4CAF50', 
            emoji: '♻️',
            description: 'Chai nhựa, lon kim loại, giấy, bìa carton, thủy tinh',
            knowledge: '♻️ Rác tái chế giúp tiết kiệm tài nguyên và bảo vệ môi trường. Hãy rửa sạch trước khi bỏ vào thùng!'
        },
        { 
            name: 'Rác Hữu Cơ', 
            nameEn: 'Organic',
            color: '#8B4513', 
            emoji: '🍂',
            description: 'Thức ăn thừa, vỏ trái cây, lá cây, vỏ trứng',
            knowledge: '🌱 Rác hữu cơ có thể làm phân compost để nuôi cây. Tách riêng giúp giảm khí nhà kính!'
        },
        { 
            name: 'Rác Thông Thường', 
            nameEn: 'Residual',
            color: '#757575', 
            emoji: '🗑️',
            description: 'Túi nilon bẩn, tã giấy, đồ dùng hỏng không tái chế',
            knowledge: '🗑️ Rác thông thường khó phân hủy. Hãy giảm thiểu sử dụng đồ dùng 1 lần!'
        },
        { 
            name: 'Rác Nguy Hại', 
            nameEn: 'Hazardous',
            color: '#F44336', 
            emoji: '☢️',
            description: 'Pin, bóng đèn, thuốc trừ sâu, sơn, điện tử',
            knowledge: '⚠️ Rác nguy hại rất độc hại! Phải xử lý đúng cách để tránh ô nhiễm đất và nước!'
        }
    ];
    
    // Trash items database
    const TRASH_ITEMS = [
        // Recyclable (index 0)
        { name: 'Chai Nhựa', type: 0, emoji: '🍾' },
        { name: 'Lon Nước', type: 0, emoji: '🥫' },
        { name: 'Giấy', type: 0, emoji: '📄' },
        { name: 'Hộp Carton', type: 0, emoji: '📦' },
        { name: 'Chai Thủy Tinh', type: 0, emoji: '🍶' },
        { name: 'Lon Kim Loại', type: 0, emoji: '🥫' },
        
        // Organic (index 1)
        { name: 'Vỏ Táo', type: 1, emoji: '🍎' },
        { name: 'Vỏ Chuối', type: 1, emoji: '🍌' },
        { name: 'Thức Ăn Thừa', type: 1, emoji: '🥗' },
        { name: 'Lá Cây', type: 1, emoji: '🍃' },
        { name: 'Vỏ Trứng', type: 1, emoji: '🥚' },
        { name: 'Bã Cà Phê', type: 1, emoji: '☕' },
        
        // Residual (index 2)
        { name: 'Cốc Vỡ', type: 2, emoji: '☕' },
        { name: 'Xốp', type: 2, emoji: '📦' },
        { name: 'Tã Giấy', type: 2, emoji: '🧷' },
        { name: 'Bao Kẹo', type: 2, emoji: '🍬' },
        { name: 'Túi Snack', type: 2, emoji: '🥔' },
        
        // Hazardous (index 3)
        { name: 'Pin', type: 3, emoji: '🔋' },
        { name: 'Bóng Đèn', type: 3, emoji: '💡' },
        { name: 'Bình Xịt', type: 3, emoji: '💨' },
        { name: 'Điện Thoại Cũ', type: 3, emoji: '📱' },
        { name: 'Hộp Sơn', type: 3, emoji: '🎨' }
    ];
    
    // Game state
    let canvas, ctx;
    let gameLoop;
    let spawnTimer;
    let timeLeft;
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let itemsSpawned = 0;
    let isPlaying = false;
    let targetBinIndex = 0; // The ONE target bin for this round
    let draggedItem = null;
    
    // Game objects
    let fallingItems = [];
    let bins = [];
    
    // DOM elements
    let elements = {};
    
    /**
     * Trash Item class - Redesigned for drag & drop
     */
    class TrashItem {
        constructor(itemData, index) {
            this.data = itemData;
            this.index = index;
            this.x = Math.random() * (canvas.width - 80) + 40;
            this.y = -80;
            this.width = 60;
            this.height = 60;
            this.speed = ITEM_FALL_SPEED;
            this.caught = false;
            this.alpha = 1;
            this.feedbackTimer = 0;
            this.feedbackText = '';
            this.feedbackColor = '';
        }
        
        update() {
            if (!this.caught) {
                this.y += this.speed;
            }
            
            // Fade out feedback
            if (this.feedbackTimer > 0) {
                this.feedbackTimer--;
                this.alpha = this.feedbackTimer / 30;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            // Pixel art style border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 30, this.y - 30, 60, 60);
            
            // Background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x - 30, this.y - 30, 60, 60);
            
            // Draw emoji
            ctx.font = '35px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.data.emoji, this.x, this.y);
            
            // Draw feedback if exists
            if (this.feedbackText) {
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
            const itemCenterX = this.x;
            const itemCenterY = this.y;
            
            return (
                itemCenterX > bin.x &&
                itemCenterX < bin.x + bin.width &&
                itemCenterY > bin.y &&
                itemCenterY < bin.y + bin.height
            );
        }
        
        showFeedback(text, color) {
            this.feedbackText = text;
            this.feedbackColor = color;
            this.feedbackTimer = 30; // 0.5 seconds at 60fps
        }
    }
    
    /**
     * Bin class - Redesigned with highlight for target
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
            this.pulseScale = 1;
            this.pulseDirection = 1;
        }
        
        update() {
            // Pulse animation for target bin
            if (this.isTarget) {
                this.pulseScale += 0.01 * this.pulseDirection;
                if (this.pulseScale > 1.1) this.pulseDirection = -1;
                if (this.pulseScale < 1) this.pulseDirection = 1;
            } else {
                this.pulseScale = 1;
            }
        }
        
        draw() {
            ctx.save();
            
            // Target bin highlight
            if (this.isTarget) {
                // Glowing effect
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 20;
                
                // Pulsing border
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 6;
                ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
            }
            
            // Bin body - pixel art style
            ctx.fillStyle = this.type.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Black border
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
            ctx.font = 'bold 12px "Press Start 2P", monospace';
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
     * Initialize game elements
     */
    function initElements() {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return false;
        
        ctx = canvas.getContext('2d');
        if (!canvas) return false;
        
        ctx = canvas.getContext('2d');
        
        elements = {
            timeLeft: document.getElementById('timeLeft'),
            correctCount: document.getElementById('correctCount'),
            wrongCount: document.getElementById('wrongCount'),
            quitSortingBtn: document.getElementById('quitSortingBtn'),
            binSelectBtns: document.querySelectorAll('.bin-select-btn'),
            targetBinName: document.getElementById('targetBinName'),
            targetBinEmoji: document.getElementById('targetBinEmoji')
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
        
        // Random target bin for this round
        targetBinIndex = Math.floor(Math.random() * BIN_TYPES.length);
        
        // Create bins
        bins = BIN_TYPES.map((type, index) => new Bin(type, index));
        
        // Update UI
        updateStats();
        selectBin(0);
        
        // Display target bin on UI
        if (elements.targetBinName) {
            elements.targetBinName.textContent = BIN_TYPES[targetBinIndex].name;
        }
        if (elements.targetBinEmoji) {
            elements.targetBinEmoji.textContent = BIN_TYPES[targetBinIndex].emoji;
        }
        
        // Show mission notification
        showMissionNotification();
        
        // Start timers after a delay
        setTimeout(() => {
            startTimer();
            startSpawning();
            // Start game loop
            gameLoop = requestAnimationFrame(update);
        }, 3000); // 3 second delay for reading mission
    }
    
    /**
     * Show mission notification
     */
    function showMissionNotification() {
        const targetBin = BIN_TYPES[targetBinIndex];
        const missionText = `🎯 NHIỆM VỤ: Phân loại rác vào thùng "${targetBin.name}" ${targetBin.emoji}\n\nChỉ bỏ đúng loại rác vào thùng ${targetBin.name} mới được điểm!`;
        
        if (window.GameState && window.GameState.showNotification) {
            window.GameState.showNotification(missionText, 'success');
        } else {
            alert(missionText);
        }
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
     * Spawn a new trash item (only target bin type)
     */
    function spawnItem() {
        // Filter items that belong to target bin
        const targetItems = TRASH_ITEMS.filter(item => item.type === targetBinIndex);
        const randomItem = targetItems[Math.floor(Math.random() * targetItems.length)];
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
        // Check if caught in the correct target bin
        const isCorrect = (item.data.type === targetBinIndex) && (activeBinIndex === targetBinIndex);
        
        if (isCorrect) {
            correctCount++;
            window.GameState.addPoints(POINTS_CORRECT);
            showFeedback('✓ Chính xác! +5 điểm', '#4CAF50');
        } else {
            wrongCount++;
            window.GameState.subtractPoints(POINTS_WRONG);
            if (activeBinIndex === targetBinIndex) {
                // Wrong item but correct bin
                showFeedback('✗ Sai loại rác!', '#F44336');
            } else {
                // Correct item but wrong bin
                showFeedback('✗ Sai thùng! Bỏ vào thùng ' + BIN_TYPES[targetBinIndex].name, '#FF9800');
            }
        }
        
        updateStats();
    }
    
    /**
     * Show feedback on canvas
     */
    function showFeedback(text, color) {
        // This could be enhanced with a proper notification system
        // For now, we'll use the game state's notification
        window.GameState.showNotification(text, color === '#4CAF50' ? 'success' : 'error');
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
