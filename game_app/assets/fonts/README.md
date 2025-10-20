# Fonts Folder

## Custom Fonts (Optional)

This folder is for custom web fonts to enhance the game's typography.

### Recommended Fonts

#### Primary Font (Headings & Titles)

A friendly, rounded sans-serif font that conveys environmental/nature themes:

- **Suggestions:** Quicksand, Nunito, Poppins, Comfortaa
- **Usage:** Game title, headings, buttons
- **Weight:** 400 (Regular), 600 (Semi-Bold), 700 (Bold)

#### Secondary Font (Body Text)

Clean, readable sans-serif for body text and UI:

- **Suggestions:** Open Sans, Lato, Roboto, Inter
- **Usage:** Questions, explanations, general text
- **Weight:** 400 (Regular), 600 (Semi-Bold)

---

## How to Add Custom Fonts

### Option 1: Google Fonts (Recommended)

Add to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

Then in `style.css`:

```css
:root {
  --font-heading: "Quicksand", sans-serif;
  --font-body: "Open Sans", sans-serif;
}

body {
  font-family: var(--font-body);
}

h1,
h2,
h3,
.game-title {
  font-family: var(--font-heading);
}
```

### Option 2: Self-Hosted Fonts

1. Download font files (.woff2, .woff formats)
2. Place in this folder
3. Add to `style.css`:

```css
@font-face {
  font-family: "CustomFont";
  src: url("../assets/fonts/CustomFont-Regular.woff2") format("woff2"), url("../assets/fonts/CustomFont-Regular.woff")
      format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

---

## Current Setup

The game currently uses system fonts:

- `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`

This works well across all platforms but custom fonts can add personality and brand identity.

---

## Performance Tips

- Use `font-display: swap` to prevent invisible text
- Only load needed font weights (don't load all 9 weights)
- Use WOFF2 format for best compression
- Preload critical fonts for faster rendering

---

## Licensing

When using fonts, ensure:

- Free for commercial use (check license)
- Properly attributed if required
- Downloaded from legitimate sources (Google Fonts, Font Squirrel, etc.)
