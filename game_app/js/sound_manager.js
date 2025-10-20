/**
 * SoundManager - Manages all audio for the GreenGrow game
 * Handles background music, sound effects, volume control, and muting
 */
class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.currentMusic = null;
        this.sfxVolume = 0.7; // Sound effects volume (0-1)
        this.musicVolume = 0.4; // Background music volume (0-1)
        this.isMuted = false;
        
        // Load saved volume settings from localStorage
        this.loadSettings();
        
        // Initialize all sounds
        this.initSounds();
    }

    /**
     * Initialize all sound files
     */
    initSounds() {
        // UI Sounds
        this.sounds.buttonClick = this.createSound('assets/sounds/button_click.mp3', 0.5);
        this.sounds.notification = this.createSound('assets/sounds/notification.mp3', 0.6);
        
        // Quiz Sounds
        this.sounds.correctAnswer = this.createSound('assets/sounds/correct_answer.mp3', 0.7);
        this.sounds.wrongAnswer = this.createSound('assets/sounds/wrong_answer.mp3', 0.6);
        this.sounds.quizComplete = this.createSound('assets/sounds/quiz_complete.mp3', 0.8);
        
        // Sorting Game Sounds
        this.sounds.itemSpawn = this.createSound('assets/sounds/item_spawn.mp3', 0.3);
        this.sounds.itemCatchCorrect = this.createSound('assets/sounds/item_catch_correct.mp3', 0.7);
        this.sounds.itemCatchWrong = this.createSound('assets/sounds/item_catch_wrong.mp3', 0.6);
        this.sounds.itemMissed = this.createSound('assets/sounds/item_missed.mp3', 0.5);
        this.sounds.gameOver = this.createSound('assets/sounds/game_over.mp3', 0.7);
        
        // Tree Growth Sounds
        this.sounds.treeGrow = this.createSound('assets/sounds/tree_grow.mp3', 0.6);
        this.sounds.achievement = this.createSound('assets/sounds/achievement.mp3', 0.7);
        
        // Background Music
        this.sounds.musicMenu = this.createSound('assets/sounds/music_menu.mp3', 0.4, true);
        this.sounds.musicGameplay = this.createSound('assets/sounds/music_gameplay.mp3', 0.4, true);
        this.sounds.musicVictory = this.createSound('assets/sounds/music_victory.mp3', 0.5);
    }

    /**
     * Create an audio element
     */
    createSound(path, volume = 1.0, loop = false) {
        const audio = new Audio(path);
        audio.volume = volume * (loop ? this.musicVolume : this.sfxVolume);
        audio.loop = loop;
        audio.preload = 'auto';
        
        // Handle loading errors silently (for missing sound files)
        audio.addEventListener('error', () => {
            console.warn(`Sound file not found: ${path}`);
        });
        
        return audio;
    }

    /**
     * Play a sound effect
     */
    play(soundName) {
        if (this.isMuted) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }

        // Reset and play (allows overlapping sounds)
        sound.currentTime = 0;
        sound.play().catch(err => {
            // Ignore autoplay policy errors
            console.debug(`Could not play ${soundName}:`, err.message);
        });
    }

    /**
     * Play background music
     */
    playMusic(musicName) {
        if (this.isMuted) return;
        
        const music = this.sounds[musicName];
        if (!music) {
            console.warn(`Music not found: ${musicName}`);
            return;
        }

        // Stop current music if playing different track
        if (this.currentMusic && this.currentMusic !== music) {
            this.stopMusic();
        }

        this.currentMusic = music;
        
        // Start playing
        music.play().catch(err => {
            console.debug(`Could not play music ${musicName}:`, err.message);
        });
    }

    /**
     * Stop current music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    /**
     * Pause current music
     */
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    /**
     * Resume current music
     */
    resumeMusic() {
        if (this.currentMusic && this.isMuted === false) {
            this.currentMusic.play().catch(err => {
                console.debug('Could not resume music:', err.message);
            });
        }
    }

    /**
     * Set sound effects volume
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        
        // Update all sound effects volumes
        for (const [key, sound] of Object.entries(this.sounds)) {
            if (!key.startsWith('music')) {
                sound.volume = sound.baseVolume * this.sfxVolume;
            }
        }
        
        this.saveSettings();
    }

    /**
     * Set music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        // Update all music volumes
        for (const [key, sound] of Object.entries(this.sounds)) {
            if (key.startsWith('music')) {
                sound.volume = sound.baseVolume * this.musicVolume;
            }
        }
        
        this.saveSettings();
    }

    /**
     * Toggle mute/unmute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
        
        this.saveSettings();
        return this.isMuted;
    }

    /**
     * Set mute state
     */
    setMute(muted) {
        this.isMuted = muted;
        
        if (this.isMuted) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
        
        this.saveSettings();
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        localStorage.setItem('soundSettings', JSON.stringify({
            sfxVolume: this.sfxVolume,
            musicVolume: this.musicVolume,
            isMuted: this.isMuted
        }));
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('soundSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.sfxVolume = settings.sfxVolume ?? 0.7;
                this.musicVolume = settings.musicVolume ?? 0.4;
                this.isMuted = settings.isMuted ?? false;
            } catch (e) {
                console.warn('Could not load sound settings');
            }
        }
    }

    /**
     * Store base volumes for later adjustment
     */
    storeBaseVolumes() {
        for (const [key, sound] of Object.entries(this.sounds)) {
            sound.baseVolume = sound.volume;
        }
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// Store base volumes after initialization
soundManager.storeBaseVolumes();

// Add button click sounds to all buttons on page load
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, button, .quiz-option');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            soundManager.play('buttonClick');
        });
    });
    
    // Create mute button
    createMuteButton();
});

/**
 * Create and add mute button to the page
 */
function createMuteButton() {
    // Check if button already exists
    if (document.querySelector('.sound-control')) return;
    
    // Create button container
    const container = document.createElement('div');
    container.className = 'sound-control';
    
    // Create button
    const button = document.createElement('button');
    button.className = 'btn-sound';
    button.id = 'muteBtn';
    button.setAttribute('aria-label', 'Toggle Sound');
    button.innerHTML = soundManager.isMuted ? '🔇' : '🔊';
    
    if (soundManager.isMuted) {
        button.classList.add('muted');
    }
    
    // Add click handler
    button.addEventListener('click', () => {
        const isMuted = soundManager.toggleMute();
        button.innerHTML = isMuted ? '🔇' : '🔊';
        
        if (isMuted) {
            button.classList.add('muted');
        } else {
            button.classList.remove('muted');
        }
    });
    
    container.appendChild(button);
    document.body.appendChild(container);
}
