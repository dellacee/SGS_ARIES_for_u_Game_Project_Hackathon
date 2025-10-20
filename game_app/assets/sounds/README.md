# Sounds Folder

## 🎵 Sound System Overview

The GreenGrow game features a complete sound system with background music and sound effects. All sounds should be fun, upbeat, and match the pixel art aesthetic of the game.

---

## 📁 Required Sound Files (Currently Placeholders)

### 🎮 UI Sounds

| File               | Description                  | Duration | Use Case             |
| ------------------ | ---------------------------- | -------- | -------------------- |
| `button_click.mp3` | Soft, satisfying click sound | 0.2-0.5s | All button presses   |
| `notification.mp3` | Gentle notification chime    | 0.5-1s   | Pop-up notifications |

### 📚 Quiz Game Sounds

| File                 | Description         | Duration | Use Case            |
| -------------------- | ------------------- | -------- | ------------------- |
| `correct_answer.mp3` | Cheerful chime/ding | 0.5-1s   | Correct quiz answer |
| `wrong_answer.mp3`   | Gentle buzzer/beep  | 0.5-1s   | Wrong quiz answer   |
| `quiz_complete.mp3`  | Victory fanfare     | 2-3s     | Quiz completion     |

### ♻️ Sorting Game Sounds

| File                     | Description         | Duration | Use Case               |
| ------------------------ | ------------------- | -------- | ---------------------- |
| `item_spawn.mp3`         | Soft whoosh/pop     | 0.3-0.5s | Item appears on screen |
| `item_catch_correct.mp3` | Positive chime/bell | 0.5-0.8s | Correct item sorted    |
| `item_catch_wrong.mp3`   | Error buzz/clunk    | 0.5-0.8s | Wrong bin selected     |
| `item_missed.mp3`        | Subtle miss sound   | 0.3-0.5s | Item falls off screen  |
| `game_over.mp3`          | Game end jingle     | 1-2s     | Sorting game ends      |

### 🌳 Achievement Sounds

| File              | Description            | Duration | Use Case               |
| ----------------- | ---------------------- | -------- | ---------------------- |
| `tree_grow.mp3`   | Magical sparkle/growth | 1-1.5s   | Tree levels up         |
| `achievement.mp3` | Celebratory fanfare    | 1.5-2s   | New tree stage reached |

### 🎼 Background Music

| File                 | Description                 | Duration | Loop | Use Case                   |
| -------------------- | --------------------------- | -------- | ---- | -------------------------- |
| `music_menu.mp3`     | Calm, peaceful nature theme | 60-90s   | ✅   | Main menu & welcome screen |
| `music_gameplay.mp3` | Upbeat but relaxed          | 60-90s   | ✅   | Quiz & sorting games       |
| `music_victory.mp3`  | Triumphant celebration      | 20-30s   | ❌   | Results screen             |

---

## 🎨 Sound Style Guidelines

### Pixel Art Game Sounds

- **8-bit/chiptune style** preferred
- **Simple waveforms**: square, triangle, sawtooth
- **Retro gaming feel**: NES, Game Boy era
- **Clean and punchy**: No reverb or complex effects
- **Bright and cheerful**: Match the positive environmental message

### Technical Specifications

- **Format**: MP3 (for compatibility)
- **Sample Rate**: 44.1 kHz
- **Bit Rate**: 128-192 kbps
- **Channels**: Stereo or Mono
- **Volume**: Normalized to prevent clipping

---

## 🔧 Integration Status

✅ **Implemented:**

- Sound Manager class with volume control
- Mute/unmute functionality
- Auto-play background music on all pages
- Sound effects integrated into:
  - Quiz game (correct/wrong answers, completion)
  - Sorting game (spawn, catch, game over)
  - All button clicks

🎮 **Sound Controls:**

- Mute button (🔊/🔇) in bottom-right corner
- Settings saved to localStorage
- Separate volume controls for SFX and Music

---

## 🎵 Where to Find Pixel Art Sounds

### Free Resources:

1. **Freesound.org** - Search "8-bit", "chiptune", "pixel"
2. **OpenGameArt.org** - Retro game assets
3. **Zapsplat.com** - Free sound effects (registration required)
4. **Mixkit.co** - Free game sound effects

### Sound Generation Tools:

1. **Bfxr** (bfxr.net) - Browser-based 8-bit sound generator
2. **ChipTone** (sfbgames.itch.io/chiptone) - Retro audio maker
3. **Beepbox** (beepbox.co) - Chiptune music creator
4. **LMMS** - Free music production software with 8-bit plugins

---

## 📝 Implementation Details

### JavaScript Integration:

```javascript
// Play sound effect
soundManager.play("correctAnswer");

// Play background music
soundManager.playMusic("musicGameplay");

// Stop music
soundManager.stopMusic();

// Toggle mute
soundManager.toggleMute();
```

### File Locations:

- Sound Manager: `js/sound_manager.js`
- Sound Files: `assets/sounds/*.mp3`
- All HTML pages include sound_manager.js

---

## ⚠️ Important Notes

1. **Current files are empty placeholders** - Replace with actual audio files
2. Game will work with missing files (errors handled gracefully)
3. Sound effects play automatically when actions occur
4. Background music loops continuously on each page
5. Mute button persists setting across page loads

---

## 🚀 Quick Setup

1. Generate or download appropriate 8-bit sounds
2. Replace the placeholder MP3 files in this folder
3. Test in-game to ensure volume levels are balanced
4. Adjust volume multipliers in `sound_manager.js` if needed

**Default Volumes:**

- Sound Effects: 70% (0.7)
- Background Music: 40% (0.4)

---

Made with 💚 by SGS Aries for U Team

- Format: MP3
- Duration: 60-90 seconds (loopable)
- Sample Rate: 44.1 kHz
- Bit Rate: 128 kbps
- Style: Nature-inspired, educational, not distracting

---

## How to Generate Audio

Use the prompts in `/prompts/asset_generation_prompts.txt` with:

- **AI Audio Generators:**
  - Suno AI
  - Soundraw
  - AIVA
  - Mubert
- **Free Sound Libraries:**
  - Freesound.org
  - Zapsplat.com
  - OpenGameArt.org
- **Music Creation Tools:**
  - GarageBand
  - FL Studio
  - Audacity (for editing)

---

## Implementation Notes

The game currently works without sound. To add sounds:

1. Add audio files to this folder
2. In `main.js`, create audio elements:

   ```javascript
   const sounds = {
     click: new Audio("assets/sounds/button_click.mp3"),
     correct: new Audio("assets/sounds/correct_answer.mp3"),
     // ... etc
   };
   ```

3. Play sounds at appropriate events:

   ```javascript
   sounds.click.play();
   ```

4. Add volume controls and mute option for accessibility

---

## Copyright & Licensing

Ensure all audio assets are:

- Created by you
- AI-generated (check AI tool's licensing)
- Licensed under Creative Commons (CC0, CC-BY)
- Royalty-free from legitimate sources

Document sources and licenses in your project report.
