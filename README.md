# Which Colour Are You? 🎨

A fun, animated quiz that finds your personality colour: **Red, Yellow, Green or Blue**.

**Live demo:** `https://YOUR-USERNAME.github.io/colour-quiz/`

## What is this?
Many personality models (like **DISC** and **Insights Discovery**) group people into four colours:

| Colour | Type | Core style |
|---|---|---|
| 🔴 Red | The Leader | Bold, fast, goal-focused |
| 🟡 Yellow | The Spark | Social, creative, energetic |
| 🟢 Green | The Heart | Calm, kind, loyal |
| 🔵 Blue | The Thinker | Careful, logical, detail-focused |

The quiz has a pool of **100 questions**. Each time, it asks 10 random ones (answers are shuffled too). Each answer matches one colour. Your highest score is your colour, and you also see your full mix.

**Tie-breaker:** if two or more colours have equal top scores, the quiz asks 3 to 6 extra questions that show only the tied colours, until one colour wins.

> ⚠️ This is for fun and self-reflection. It is not a scientific or medical test.

## Features
- 100-question pool, 10 random questions each time
- Smart tie-breaker rounds when colours are equal
- Smooth animations, moving gradient background, colour reveal
- Skip button on every question (up to 5 skips, skipped questions do not count)
- Mixed-style names like "The Strategist" (Red + Blue) when two colours are close
- Careers that fit each colour
- Save your result as a share-card image (PNG)
- Glow that follows your mouse, floating sparks, colour-reveal animation
- Keyboard support (press 1–4 to answer, 0 to skip)
- Works on phone and desktop
- No libraries, no build step

## Run it
Just open `index.html` in your browser. Or run a local server:
```bash
python3 -m http.server 8000
```

## Customize
- Add or edit questions in `questions.js` (one line per question)
- Edit colour descriptions in `script.js` (`COLOURS`)
- Edit design in `style.css`

## Credits
Inspired by the colour-types idea from Carl Jung's psychology, William Marston's DISC model, and Insights Discovery.

## License
MIT
