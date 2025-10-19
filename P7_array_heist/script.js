// Code Breaker - The Array Heist Game
class CodeBreakerGame {
    constructor() {
        this.array = new Array(10).fill(null);
        this.secretPattern = [];
        this.currentLevel = 1;
        this.score = 0;
        this.timeLeft = 60;
        this.operationsUsed = 0;
        this.gameActive = false;
        this.timer = null;
        this.startTime = null;
        
        this.initializeGame();
    }

    initializeGame() {
        this.bindEvents();
        this.generateSecretPattern();
        this.renderArray();
        this.updateUI();
        this.showLevelModal();
    }

    bindEvents() {
        // Operation buttons
        document.getElementById('insertBtn').addEventListener('click', () => this.insertElement());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteElement());
        document.getElementById('searchBtn').addEventListener('click', () => this.searchPattern());
        
        // Control buttons
        document.getElementById('resetBtn').addEventListener('click', () => this.resetArray());
        document.getElementById('autoFillBtn').addEventListener('click', () => this.autoFillArray());
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('closeLevelModal').addEventListener('click', () => this.closeLevelModal());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.playAgain());
        document.getElementById('nextLevelModalBtn').addEventListener('click', () => this.nextLevel());
        
        // Level selection
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', () => {
                const level = parseInt(card.dataset.level);
                this.selectLevel(level);
            });
        });
        
        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (document.getElementById('insertIndex').matches(':focus') || 
                    document.getElementById('insertValue').matches(':focus')) {
                    this.insertElement();
                } else if (document.getElementById('deleteIndex').matches(':focus')) {
                    this.deleteElement();
                } else if (document.getElementById('searchPattern').matches(':focus')) {
                    this.searchPattern();
                }
            }
        });
    }

    generateSecretPattern() {
        const patterns = {
            1: { length: 2, description: "Find a 2-digit pattern" },
            2: { length: 3, description: "Find a 3-digit pattern" },
            3: { length: 3, description: "Find a 3-digit pattern in reverse order" }
        };
        
        const config = patterns[this.currentLevel];
        this.secretPattern = [];
        
        for (let i = 0; i < config.length; i++) {
            this.secretPattern.push(Math.floor(Math.random() * 10));
        }
        
        // For level 3, reverse the pattern
        if (this.currentLevel === 3) {
            this.secretPattern = this.secretPattern.reverse();
        }
        
        this.updateMissionText(config.description);
        this.renderSecretPattern();
    }

    updateMissionText(description) {
        document.getElementById('missionText').textContent = description;
    }

    renderSecretPattern() {
        const patternDisplay = document.getElementById('secretPattern');
        patternDisplay.innerHTML = '';
        
        this.secretPattern.forEach(digit => {
            const digitElement = document.createElement('div');
            digitElement.className = 'pattern-digit';
            digitElement.textContent = digit;
            patternDisplay.appendChild(digitElement);
        });
    }

    renderArray() {
        const arrayDisplay = document.getElementById('arrayDisplay');
        const indicesDisplay = document.getElementById('arrayIndices');
        
        arrayDisplay.innerHTML = '';
        indicesDisplay.innerHTML = '';
        
        this.array.forEach((value, index) => {
            // Array cell
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.dataset.index = index;
            
            if (value === null) {
                cell.classList.add('empty');
                cell.textContent = '';
            } else {
                cell.textContent = value;
            }
            
            arrayDisplay.appendChild(cell);
            
            // Index label
            const indexLabel = document.createElement('div');
            indexLabel.className = 'array-index';
            indexLabel.textContent = index;
            indicesDisplay.appendChild(indexLabel);
        });
    }

    insertElement() {
        const index = parseInt(document.getElementById('insertIndex').value);
        const value = parseInt(document.getElementById('insertValue').value);
        
        if (isNaN(index) || isNaN(value)) {
            this.showFeedback('Please enter valid index and value!', 'error');
            return;
        }
        
        if (index < 0 || index >= this.array.length) {
            this.showFeedback('Index out of bounds! (0-9)', 'error');
            return;
        }
        
        if (value < 0 || value > 9) {
            this.showFeedback('Value must be between 0 and 9!', 'error');
            return;
        }
        
        // Shift elements to the right
        for (let i = this.array.length - 1; i > index; i--) {
            this.array[i] = this.array[i - 1];
        }
        
        this.array[index] = value;
        this.operationsUsed++;
        
        this.renderArray();
        this.animateInsert(index);
        this.showFeedback(`Inserted ${value} at index ${index}!`, 'success');
        this.addToHistory(`Inserted ${value} at index ${index}`);
        this.updateUI();
        
        // Clear inputs
        document.getElementById('insertIndex').value = '';
        document.getElementById('insertValue').value = '';
    }

    deleteElement() {
        const index = parseInt(document.getElementById('deleteIndex').value);
        
        if (isNaN(index)) {
            this.showFeedback('Please enter a valid index!', 'error');
            return;
        }
        
        if (index < 0 || index >= this.array.length) {
            this.showFeedback('Index out of bounds! (0-9)', 'error');
            return;
        }
        
        if (this.array[index] === null) {
            this.showFeedback('No element at this index!', 'error');
            return;
        }
        
        const deletedValue = this.array[index];
        
        // Shift elements to the left
        for (let i = index; i < this.array.length - 1; i++) {
            this.array[i] = this.array[i + 1];
        }
        
        this.array[this.array.length - 1] = null;
        this.operationsUsed++;
        
        this.animateDelete(index);
        setTimeout(() => {
            this.renderArray();
        }, 500);
        
        this.showFeedback(`Deleted element ${deletedValue} at index ${index}!`, 'success');
        this.addToHistory(`Deleted element at index ${index}`);
        this.updateUI();
        
        // Clear input
        document.getElementById('deleteIndex').value = '';
    }

    searchPattern() {
        const patternInput = document.getElementById('searchPattern').value.trim();
        
        if (!patternInput) {
            this.showFeedback('Please enter a pattern to search!', 'error');
            return;
        }
        
        let searchPattern;
        try {
            searchPattern = patternInput.split(',').map(x => parseInt(x.trim()));
        } catch (error) {
            this.showFeedback('Invalid pattern format! Use: 1,2,3', 'error');
            return;
        }
        
        if (searchPattern.some(x => isNaN(x) || x < 0 || x > 9)) {
            this.showFeedback('Pattern must contain numbers 0-9!', 'error');
            return;
        }
        
        this.operationsUsed++;
        this.animateSearch(searchPattern);
        
        // Clear input
        document.getElementById('searchPattern').value = '';
    }

    animateInsert(index) {
        const cells = document.querySelectorAll('.array-cell');
        const targetCell = cells[index];
        
        targetCell.classList.add('inserting');
        setTimeout(() => {
            targetCell.classList.remove('inserting');
        }, 500);
    }

    animateDelete(index) {
        const cells = document.querySelectorAll('.array-cell');
        const targetCell = cells[index];
        
        targetCell.classList.add('deleting');
        setTimeout(() => {
            targetCell.classList.remove('deleting');
        }, 500);
    }

    async animateSearch(searchPattern) {
        const cells = document.querySelectorAll('.array-cell');
        const arrayValues = this.array.filter(x => x !== null);
        
        this.showFeedback('Searching for pattern...', 'info');
        
        for (let i = 0; i <= arrayValues.length - searchPattern.length; i++) {
            // Highlight current search position
            for (let j = 0; j < searchPattern.length; j++) {
                const cellIndex = this.getCellIndex(i + j);
                if (cellIndex !== -1) {
                    cells[cellIndex].classList.add('searching');
                }
            }
            
            await this.sleep(800);
            
            // Check if pattern matches
            let matches = true;
            for (let j = 0; j < searchPattern.length; j++) {
                if (arrayValues[i + j] !== searchPattern[j]) {
                    matches = false;
                    break;
                }
            }
            
            // Remove highlighting
            for (let j = 0; j < searchPattern.length; j++) {
                const cellIndex = this.getCellIndex(i + j);
                if (cellIndex !== -1) {
                    cells[cellIndex].classList.remove('searching');
                }
            }
            
            if (matches) {
                // Highlight found pattern
                for (let j = 0; j < searchPattern.length; j++) {
                    const cellIndex = this.getCellIndex(i + j);
                    if (cellIndex !== -1) {
                        cells[cellIndex].classList.add('highlight');
                    }
                }
                
                this.showFeedback(`Pattern found at position ${i}!`, 'success');
                this.addToHistory(`Found pattern [${searchPattern.join(',')}] at position ${i}`);
                
                // Check if it's the secret pattern
                if (this.isSecretPattern(searchPattern)) {
                    setTimeout(() => this.levelComplete(), 1000);
                }
                
                this.updateUI();
                return;
            }
        }
        
        this.showFeedback('Pattern not found!', 'error');
        this.addToHistory(`Pattern [${searchPattern.join(',')}] not found`);
        this.updateUI();
    }

    getCellIndex(arrayIndex) {
        let currentIndex = 0;
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i] !== null) {
                if (currentIndex === arrayIndex) {
                    return i;
                }
                currentIndex++;
            }
        }
        return -1;
    }

    isSecretPattern(searchPattern) {
        if (searchPattern.length !== this.secretPattern.length) {
            return false;
        }
        
        for (let i = 0; i < searchPattern.length; i++) {
            if (searchPattern[i] !== this.secretPattern[i]) {
                return false;
            }
        }
        
        return true;
    }

    resetArray() {
        this.array = new Array(10).fill(null);
        this.operationsUsed = 0;
        this.renderArray();
        this.showFeedback('Array reset!', 'info');
        this.addToHistory('Array reset');
        this.updateUI();
    }

    autoFillArray() {
        const emptyIndices = [];
        this.array.forEach((value, index) => {
            if (value === null) {
                emptyIndices.push(index);
            }
        });
        
        if (emptyIndices.length === 0) {
            this.showFeedback('Array is already full!', 'info');
            return;
        }
        
        // Fill with random values
        emptyIndices.forEach(index => {
            this.array[index] = Math.floor(Math.random() * 10);
        });
        
        this.renderArray();
        this.showFeedback(`Auto-filled ${emptyIndices.length} positions!`, 'success');
        this.addToHistory(`Auto-filled ${emptyIndices.length} positions`);
        this.updateUI();
    }

    levelComplete() {
        this.gameActive = false;
        clearInterval(this.timer);
        
        const timeTaken = 60 - this.timeLeft;
        const bonusScore = Math.max(0, this.timeLeft * 10);
        this.score += 100 + bonusScore;
        
        document.getElementById('gameOverTitle').textContent = 'Level Complete!';
        document.getElementById('gameOverMessage').textContent = `Congratulations! You cracked the code in ${timeTaken} seconds!`;
        document.getElementById('timeTaken').textContent = `${timeTaken}s`;
        document.getElementById('operationsUsed').textContent = this.operationsUsed;
        document.getElementById('finalScore').textContent = this.score;
        
        this.showModal();
        
        // Show next level button if not on last level
        if (this.currentLevel < 3) {
            document.getElementById('nextLevelBtn').style.display = 'flex';
        }
    }

    nextLevel() {
        this.currentLevel++;
        this.timeLeft = 60;
        this.operationsUsed = 0;
        this.gameActive = true;
        
        this.generateSecretPattern();
        this.resetArray();
        this.startTimer();
        this.closeModal();
        
        document.getElementById('nextLevelBtn').style.display = 'none';
        this.showFeedback(`Level ${this.currentLevel} started!`, 'success');
    }

    startTimer() {
        this.startTime = Date.now();
        this.gameActive = true;
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    gameOver() {
        this.gameActive = false;
        clearInterval(this.timer);
        
        document.getElementById('gameOverTitle').textContent = 'Time\'s Up!';
        document.getElementById('gameOverMessage').textContent = 'You ran out of time! Try again to crack the code.';
        document.getElementById('timeTaken').textContent = '60s';
        document.getElementById('operationsUsed').textContent = this.operationsUsed;
        document.getElementById('finalScore').textContent = this.score;
        
        this.showModal();
    }

    playAgain() {
        this.currentLevel = 1;
        this.score = 0;
        this.timeLeft = 60;
        this.operationsUsed = 0;
        
        this.generateSecretPattern();
        this.resetArray();
        this.startTimer();
        this.closeModal();
        
        this.showFeedback('New game started!', 'success');
    }

    selectLevel(level) {
        this.currentLevel = level;
        this.score = 0;
        this.timeLeft = 60;
        this.operationsUsed = 0;
        
        this.generateSecretPattern();
        this.resetArray();
        this.startTimer();
        this.closeLevelModal();
        
        this.showFeedback(`Level ${level} selected!`, 'success');
    }

    showLevelModal() {
        document.getElementById('levelModal').style.display = 'block';
    }

    closeLevelModal() {
        document.getElementById('levelModal').style.display = 'none';
    }

    showModal() {
        document.getElementById('gameOverModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('gameOverModal').style.display = 'none';
    }

    updateUI() {
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('score').textContent = this.score;
        
        // Update timer color based on time left
        const timerElement = document.getElementById('timer');
        if (this.timeLeft <= 10) {
            timerElement.style.color = '#ff6b6b';
        } else if (this.timeLeft <= 30) {
            timerElement.style.color = '#ffa726';
        } else {
            timerElement.style.color = '#00d4ff';
        }
    }

    showFeedback(message, type) {
        const feedbackElement = document.getElementById('feedbackMessage');
        feedbackElement.textContent = message;
        feedbackElement.className = `feedback-message ${type}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            feedbackElement.className = 'feedback-message';
        }, 3000);
    }

    addToHistory(operation) {
        const historyElement = document.getElementById('operationHistory');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `${new Date().toLocaleTimeString()}: ${operation}`;
        
        historyElement.insertBefore(historyItem, historyElement.firstChild);
        
        // Keep only last 10 items
        while (historyElement.children.length > 10) {
            historyElement.removeChild(historyElement.lastChild);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CodeBreakerGame();
});

// Add some sound effects (optional - using Web Audio API)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }

    playBeep(frequency = 800, duration = 200) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    playError() {
        this.playBeep(300, 400);
    }

    playSuccess() {
        this.playBeep(600, 200);
        setTimeout(() => this.playBeep(800, 200), 100);
        setTimeout(() => this.playBeep(1000, 300), 200);
    }

    playInsert() {
        this.playBeep(500, 150);
    }

    playDelete() {
        this.playBeep(400, 150);
    }
}

// Initialize sound effects
const soundEffects = new SoundEffects();
