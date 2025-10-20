# Sounds Folder

## Required Sound Assets

This folder should contain audio effects and background music for the GreenGrow game.

### Sound Effects (Priority: MEDIUM)

#### UI Sounds

- `button_click.mp3` - Soft click sound for button presses
- `notification.mp3` - Gentle notification sound

#### Quiz Sounds

- `correct_answer.mp3` - Cheerful chime for correct answers
- `wrong_answer.mp3` - Gentle buzzer for incorrect answers
- `quiz_complete.mp3` - Victory fanfare for completing quiz

#### Sorting Game Sounds

- `item_spawn.mp3` - Soft whoosh as item appears
- `item_catch_correct.mp3` - Positive chime for correct sorting
- `item_catch_wrong.mp3` - Error sound for incorrect sorting
- `item_missed.mp3` - Subtle miss sound

#### Tree Growth Sounds

- `tree_grow.mp3` - Magical sparkle/growth sound
- `achievement.mp3` - Celebratory sound for reaching new stage

### Background Music (Priority: LOW)

- `music_menu.mp3` - Calm, peaceful nature theme (loopable, 60-90s)
- `music_gameplay.mp3` - Upbeat but relaxed (loopable, 60-90s)
- `music_victory.mp3` - Triumphant celebration (20-30s)

---

## Audio Specifications

**Sound Effects:**

- Format: MP3 or OGG
- Duration: 0.5 - 3 seconds
- Sample Rate: 44.1 kHz
- Bit Rate: 128 kbps
- Volume: Normalized, not too loud

**Background Music:**

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
