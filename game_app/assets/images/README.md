# Images Folder

## Required Image Assets

This folder should contain visual assets for the GreenGrow game.

### Tree Growth Stages (Priority: HIGH)

Generate 5 tree images showing growth progression:

- `tree_stage_1_seed.png` - Small seed in soil
- `tree_stage_2_sprout.png` - Young sprout with leaves
- `tree_stage_3_sapling.png` - Small tree sapling
- `tree_stage_4_young_tree.png` - Growing tree
- `tree_stage_5_blossom.png` - Full blossoming tree

**Specifications:**

- Size: 512x512px
- Format: PNG with transparent background
- Style: Cartoon/cute, suitable for educational game
- Colors: Natural greens and browns

### Waste Bin Graphics (Priority: MEDIUM)

4 color-coded waste bins:

- `bin_green.png` - Green recyclable bin with ♻️ symbol
- `bin_brown.png` - Brown organic bin with 🍂 symbol
- `bin_grey.png` - Grey residual bin with 🗑️ symbol
- `bin_red.png` - Red hazardous bin with ☢️ symbol

**Specifications:**

- Size: 256x256px
- Format: PNG with transparency
- Style: Simple, clear, cartoon style
- View: Front-facing

### Trash Item Icons (Priority: LOW - Currently using emojis)

Icons for various trash items. The game currently uses emojis, but you can replace them with custom icons:

- Recyclable items (plastic bottles, cans, paper, cardboard, glass)
- Organic items (apple cores, banana peels, food scraps, leaves)
- Residual items (styrofoam, wrappers, broken ceramics)
- Hazardous items (batteries, light bulbs, electronics, paint)

**Specifications:**

- Size: 128x128px
- Format: PNG with transparency
- Style: Flat design with slight 3D effect

### Background Images (Priority: LOW - Currently using CSS gradients)

- `background_game.jpg` - Outdoor scene with sky, grass, clouds
- `background_menu.jpg` - Nature-themed gradient background

**Specifications:**

- Size: 1920x1080px
- Format: JPG or PNG
- Optimized for web (compressed)

---

## How to Generate Assets

Use the prompts in `/prompts/asset_generation_prompts.txt` with AI image generators like:

- DALL-E
- Midjourney
- Stable Diffusion
- Adobe Firefly
- Canva AI

---

## Notes

The game is fully functional without custom images (using emojis and CSS).
Custom images will enhance the visual appeal and professional appearance.
