# 🌱 GreenGrow: Journey of the Green Seed

**An Educational Web Game About Environmental Sustainability and SDGs**

![GreenGrow Game](screenshots/README.md)

[![Video Demo](https://img.shields.io/badge/Video-Demo-red?style=for-the-badge&logo=youtube)](youtube_link.txt)

---

## 🚀 Quick Start

```bash
# Clone and play in 3 steps
git clone https://github.com/dellacee/SGS_ARIES_for_u_Game_Project_Hackathon.git
cd SGS_ARIES_for_u_Game_Project_Hackathon/game_app
# Open index.html in your browser
```

Or **simply download** and double-click `game_app/index.html` - No installation needed!

---

## 📖 Overview

**GreenGrow: Journey of the Green Seed** is an interactive browser-based educational game that teaches players about environmental sustainability, proper waste management, and the United Nations Sustainable Development Goals (SDGs). Designed with a charming pixel art aesthetic, the game makes learning about environmental responsibility engaging and fun.

### 🎯 Key Features

- **🎮 Two Interactive Mini-Games:**
  - **Environmental Quiz** - Test your knowledge with 10 questions about SDGs, climate change, and recycling
  - **Trash Sorting Game** - Action-packed sorting game with continuous item spawning
- **🌳 Tree Growth System:** Watch your virtual tree grow through 5 distinct stages as you earn Green Points

- **🎨 Pixel Art Aesthetic:** Retro 16-bit style visuals with Press Start 2P font

- **🔊 Full Sound System:** 8-bit/chiptune audio with background music and sound effects

- **💾 Progress Tracking:** LocalStorage saves your points and tree growth automatically

- **📱 Responsive Design:** Works on desktop, tablet, and mobile devices

### 🎓 Educational Value

Players learn about:

- **SDG 12:** Responsible Consumption and Production
- **SDG 13:** Climate Action
- **SDG 15:** Life on Land
- Proper waste segregation using international color standards
- Environmental impact of daily choices
- Real-world sustainability practices

---

## 🎮 How to Play

### Getting Started

1. **Welcome Screen:** Click "Begin Your Mission" to start
2. **Menu Screen:** View your tree and current points, select a mini-game
3. **Play Games:** Earn Green Points to grow your tree
4. **Watch Growth:** Your tree evolves through 5 stages

### Game 1: Environmental Quiz 📚

- **Format:** 10 multiple-choice questions
- **Topics:** SDGs, climate change, recycling, biodiversity, pollution
- **Scoring:** +10 points per correct answer (max 100 points)
- **Time:** No time limit, take your time to learn
- **Controls:** Click on answer buttons
- **Feedback:** Immediate explanation after each answer

### Game 2: Trash Sorting ♻️

- **Objective:** Sort falling trash into correct colored bins
- **Duration:** 60 seconds of continuous action
- **Scoring:**
  - ✅ Correct sort: +10 points
  - ❌ Wrong bin: -5 points
  - Pass threshold: 50 points
- **Controls:**
  - **Keyboard:** ← → Arrow keys or A/D keys
  - **Mobile:** Swipe left/right
- **Bins (International Standards):**
  - 🟢 **Green:** Recyclables (plastic, paper, metal, glass)
  - 🟤 **Brown:** Organic (food scraps, leaves, compost)
  - ⚫ **Grey:** Residual (non-recyclables, mixed waste)
  - 🔴 **Red:** Hazardous (batteries, chemicals, electronics)

### Tree Growth Stages 🌳

| Stage              | Points Required | Description                 |
| ------------------ | --------------- | --------------------------- |
| 🌰 Seed            | 0-20            | Just planted, hope emerging |
| 🌱 Sprout          | 21-50           | First leaves appearing      |
| 🌿 Sapling         | 51-100          | Young tree growing          |
| 🌳 Growing Tree    | 101-150         | Strong and healthy          |
| 🌸 Blossoming Tree | 151+            | Fully mature with flowers   |


---

## 📁 Project Structure

```
SGS_ARIES_for_u_Game_Project_Hackathon/
│
├── 📄 README.md                           # Project documentation (this file)
├── 📄 project_report.pdf                  # Comprehensive project report
├── 📄 youtube_link.txt                    # Demo video link
├── 📄 SOUND_INTEGRATION_SUMMARY.md        # Audio system documentation
│
├── 📁 prompts/                            # AI generation prompts
│   ├── concept_prompts.txt               # Game concept and design
│   ├── asset_generation_prompts.txt      # Visual and audio assets
│   ├── code_generation_prompts.txt       # Code structure and logic
│   ├── refinement_prompts.txt            # Improvements and debugging
│   └── ALL_PROMPTS_SUMMARY.md            # Complete prompt documentation
│
├── 📁 game_app/                           # ⭐ PLAYABLE WEB GAME ⭐
│   │
│   ├── index.html                        # Welcome/landing page
│   ├── menu.html                         # Game selection menu
│   ├── quiz.html                         # Environmental quiz game
│   ├── sorting.html                      # Trash sorting game
│   ├── results.html                      # Results screen
│   │
│   ├── 📁 css/
│   │   └── style.css                     # Complete game styling (2200+ lines)
│   │
│   ├── 📁 js/
│   │   ├── common.js                     # Shared utilities & GameController
│   │   ├── quiz_game.js                  # Quiz game logic
│   │   ├── trash_sorting_game.js         # Sorting game engine
│   │   └── sound_manager.js              # Audio system
│   │
│   └── 📁 assets/
│       ├── 📁 images/                    # Game graphics (pixel art)
│       │   ├── background_greengrow.png
│       │   ├── backgorund_noleter.png
│       │   ├── seed.png
│       │   ├── sprout.png
│       │   ├── sapling.png
│       │   ├── growing_tree.png
│       │   ├── blossoming_tree.png
│       │   └── ... (trash items, bins, etc.)
│       │
│       ├── 📁 sounds/                    # Audio files (15 files)
│       │   ├── button_click.mp3
│       │   ├── correct_answer.mp3
│       │   ├── wrong_answer.mp3
│       │   ├── item_catch_correct.mp3
│       │   ├── music_menu.mp3
│       │   └── ... (8-bit/chiptune style)
│       │
│       └── 📁 fonts/                     # Custom fonts (if any)
│
└── 📁 screenshots/                        # Game screenshots
    └── README.md                          # Screenshots info
```

### Key Files Explanation

| File/Folder              | Purpose                            |
| ------------------------ | ---------------------------------- |
| `game_app/index.html`    | **START HERE** - Main entry point  |
| `game_app/css/style.css` | All styling, pixel art CSS         |
| `game_app/js/*.js`       | Game logic and controllers         |
| `game_app/assets/`       | Images, sounds, fonts              |
| `prompts/`               | All AI prompts used in development |
| `project_report.pdf`     | Full documentation and analysis    |
| `youtube_link.txt`       | Demo video URL                     |

---

## 🎬 Demo & Documentation

### 🎥 Video Demo

Watch the full gameplay walkthrough on YouTube:

- **Link:** See `youtube_link.txt` in the repository root

### 📸 Screenshots

View game screenshots in the `screenshots/` folder:

1. Welcome Screen
2. Menu with Tree Display
3. Environmental Quiz
4. Trash Sorting Game
5. Results Screen

### 📄 Full Documentation

For detailed project analysis, see `project_report.pdf`

---

## 🤝 Contributing

This project is part of a hackathon submission. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
---

## 🌍 Impact Statement

**Making Environmental Education Engaging**

By gamifying environmental education, **GreenGrow** transforms abstract concepts like SDGs and waste management into tangible, interactive experiences. Every virtual tree grown represents real-world knowledge gained about protecting our planet.

### Our Vision

- **Inspire** young people to care about the environment
- **Educate** through engaging gameplay mechanics
- **Empower** players to take action in their daily lives
- **Create** lasting behavioral change through positive reinforcement

### Real-World Impact

- Understanding proper waste sorting = better recycling rates
- Knowledge of SDGs = informed future decision-makers
- Emotional connection to tree growth = care for nature
- Fun learning experience = long-term retention

**"Small actions today grow into a greener tomorrow."** 🌳

---

## ⭐ Quick Start Summary

```bash
# 1. Clone the repository
git clone https://github.com/dellacee/SGS_ARIES_for_u_Game_Project_Hackathon.git

# 2. Navigate to game folder
cd SGS_ARIES_for_u_Game_Project_Hackathon/game_app

# 3. Open index.html in your browser (or use Live Server in VS Code)
```

**Then:**

1. Click "Begin Your Mission" on welcome screen
2. Choose a mini-game from the menu
3. Play and earn Green Points
4. Watch your tree grow!

---

**Made with 💚 for a sustainable future**

_GreenGrow: Journey of the Green Seed - Planting seeds of environmental awareness, one game at a time._


