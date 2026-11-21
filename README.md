# Man About The House

A web page for dads: Money, Work, Fixer and The Room, each cut by life stage (expecting and first year, toddlers to primary, teenagers, separated). Fatherhood talk is the by-product, not a section. The research behind the shape is in `Panclaude/reports/Man about the house dads app.md`.

## What is here

- `index.html` home: the floor plan, the stage switcher, why the front door says Money
- `money.html` child maintenance calculator (Child Maintenance Service rules), first-year planner, what you're owed, debt first steps
- `work.html` leave, flexible hours, redundancy, side income
- `fixer.html` the five things to know, damp, hiring trades, jobs worth doing yourself
- `room.html` the in-person night, how it runs, meet-ups list, the clubs that already exist
- `config.js` the only file to edit day to day: stream invite links per room and stage, meet-ups, contact address
- `assets/style.css`, `assets/site.js`, `assets/calc.js`

No framework, no build step. Any static host serves it.

## Run it locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Opening a stream

Streams live on a hosted layer (WhatsApp Community, Discord or Circle), not in this code. Create the group there, paste the invite link into `config.js` under the room and stage, add a one-line `who`, and the page shows "Join the stream". Until then it shows "Not open yet" with an "Ask to open it" link to the `contact` address.

## Rules the pages promise

What is said in a stream stays there. Nobody fixes anybody. No selling. First names or none. Every page carries the Samaritans number. Nothing on the site is regulated financial, legal or medical advice, and the copy says so.

## Not yet built

- A form behind "Ask to open it" (currently a mailto)
- Any login, posting or in-house forum
- The app wrapper. The page proves the money door first.
