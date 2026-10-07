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

The quiz has 10 questions. Each answer matches one colour. Your highest score is your colour, and you also see your full mix.

> ⚠️ This is for fun and self-reflection. It is not a scientific or medical test.

## Features
- 10 questions, answers shuffled every time
- Smooth animations, moving gradient background, colour reveal
- Keyboard support (press 1–4)
- Works on phone and desktop
- No libraries, no build step

## Run it
Just open `index.html` in your browser. Or run a local server:
```bash
python3 -m http.server 8000
```

## Customize
- Edit questions and results in `script.js` (`QUESTIONS` and `COLOURS`)
- Edit design in `style.css`

## Credits
Inspired by the colour-types idea from Carl Jung's psychology, William Marston's DISC model, and Insights Discovery.

## License
MIT
