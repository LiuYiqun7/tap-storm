# Tap Storm

**Idea.** A small interactive experience: tap the `A` key as fast as you like.
The faster you tap, the bigger the particle storm on screen. It turns one key
into a speed you can see.

**Intended user.** Anyone sitting at a laptop who wants a 30-second way to warm
up, fidget or let off steam. No account, no install, no instructions needed to
start.

## The interaction

| Layer | What happens |
| --- | --- |
| Input | Tap the `A` key repeatedly (or click anywhere). |
| Response | The tap interval becomes a rate (taps/second). The rate sets how many particles burst per tap, how fast they fly, and their colour. |
| Feedback | A live rate bar, a `taps/s` number, a `COMBO` counter, the particles themselves, and a brief screen flash at the top tier. |

Rate is the average of the last four tap intervals, smoothed so the number does
not jitter. Stop tapping for 1.5 seconds and the rate falls back to zero.

| Rate (taps/s) | Particles per tap | Colour |
| --- | --- | --- |
| < 2 | 3 | cool blue |
| 2–5 | 10 | cyan |
| 5–8 | 25 | amber |
| > 8 | 40 | orange-red |

## How to run

Browser project. Two options:

1. **Live page** — open the GitHub Pages URL for this repository (see the link at
   the top of this repo) and press `A`.
2. **Local** — from this folder, serve the files and open the page:

   ```bash
   python -m http.server 8000
   # open http://localhost:8000/index.html
   ```

Requires an internet connection on first load: p5.js 1.11.3 is loaded from a CDN.
No API key, GPU, model download, microphone or camera is used.

Controls: `A` = tap, click = tap at the pointer, `R` = clear the screen and reset.

## Ordinary mistakes this handles

- **Holding `A` down.** The browser repeats `keydown`; repeats are ignored and the
  screen says "hold does not count — tap instead".
- **Pressing another key.** Ignored; a hint says only `A` counts.
- **Not pressing anything.** An idle prompt breathes in the middle of the screen.
- **Mashing until it slows down.** Particles are capped at 800 (oldest recycled)
  and the burst size halves if the frame rate stays under 30.

## Known limitations

- Rate is measured per key press, so a keyboard's own repeat/blocking behaviour
  sets a physical ceiling on very fast tapping.
- Colour and count change in four tiers, not continuously — the jump between
  tiers is deliberate so the change is visible.
- On a very small window the HUD may overlap the particle field.

## Credits

- Built with [p5.js](https://p5js.org/) 1.11.3 (LGPL-2.1), loaded from a CDN.
- Particle motion (gravity + drag + fade) is a standard pattern, written for this
  project; no course example code is copied here.

## Files

- `index.html` — page and p5.js script tag.
- `sketch.js` — the whole experience: input, rate, particles, HUD, error handling.
