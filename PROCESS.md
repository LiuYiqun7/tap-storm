# Process — Tap Storm

## Starting idea

I wanted one input I already had (a keyboard key) and one thing that could grow
with effort: pressing `A` faster should visibly produce more. I first thought of
a music/rhythm game, then cut it — the brief says one well-made interaction beats
a pile of unfinished features, and a rhythm game needs audio timing I could not
finish and test in the time left.

## One design change I made

**Tiers instead of a continuous curve.** My first version mapped the rate straight
onto the particle count, so 2 taps/s and 3 taps/s looked nearly identical and the
response did not feel earned. I changed it to four tiers (3 / 10 / 25 / 40
particles) with a colour change at each step. Now the jump is obvious, and I can
point at one line — `burstTier(rate)` — as the code that connects the user's
action to what they see.

## User trial

> TODO — do this before submitting: ask one person to try it *without* explaining
> how it works. Write down (1) what they tried first, (2) where they hesitated,
> (3) whether they noticed the rate change. Then make one improvement from what
> you saw, or say why you kept the design. Do not name the person.

My prediction before the trial: people will hold the key down first rather than
tap it. That is why the "hold does not count" message exists.

## Tools

- **AI used:** WorkBuddy (agent) generated the first working version of
  `index.html` and `sketch.js` from my idea, and this README/PROCESS structure.
- **Suggestion I kept:** handling the key-repeat case explicitly. Without it,
  holding `A` looks like superhuman speed and the whole rate idea collapses.
- **Suggestion I changed or rejected:** it first drew a full particle trail with
  per-particle history objects; I replaced it with a translucent background redraw
  (one line, cheaper, and the trail looks the same).
- I tested the page myself in a browser: tapping, holding, pressing other keys,
  idling, and mashing until the particle cap kicked in.

## What I would do next

- Make the tier thresholds adjustable in the page so a user can find their own range.
- Try a decay-mode: the storm keeps building only while you keep the rate up.
