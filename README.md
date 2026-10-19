# Flappy Highlander

Flappy Highlander is an original one-button Canvas game created for a high-school AI Club demonstration. Guide a red, black, and white Highlander bird through moving banks of school lockers using Space, Arrow Up, a mouse, or touch.

The project has no runtime dependencies or downloaded media. Game rules are strict TypeScript modules, visuals are isolated Canvas drawing functions, and the browser shell uses accessible HTML controls.

## Run locally

Requirements: Node.js 24 and npm.

```powershell
npm ci
npm run dev
```

Open the Local URL printed by Vite, normally `http://127.0.0.1:5173/`.

## Verify and build

```powershell
npm run check
npm test
npm run test:e2e
npm run build
npm run test:production
```

`npm run build` creates the static `dist/` directory. To inspect it locally:

```powershell
npm run preview -- --host 127.0.0.1
```

The production build uses relative URLs and can be served from a static host or subdirectory.

## Architecture

The game runs in a fixed 400 × 600 logical coordinate system. CSS and `src/viewport.ts` fit that playfield into laptop and phone screens without changing physics. A fixed 60 Hz simulation makes movement independent of display refresh rate.

The pure modules under `src/` own physics, obstacles, seeded randomness, collision, scoring, timing, and state transitions. `src/main.ts` connects them to browser input, the animation loop, Canvas rendering, and HTML interface. The optional `?test=1` bridge exists only in development builds and advances the same simulation code deterministically.

## Tune gameplay

All values are in `src/config.ts`. The three most useful live-demo controls are:

- `physics.gravity`: how quickly the bird falls; default `1400`.
- `obstacles.gapHeight`: vertical opening size; default `160`.
- `obstacles.speed`: horizontal locker speed; default `160`.

Other values define flap velocity, hitbox insets, spawn timing, gap bounds, and restart lockout. Change one value at a time and rerun `npm test` plus the browser suite after tuning.

## Replace artwork

The original artwork is procedural and makes no network requests. Replace the bodies of `drawBird`, `drawLocker`, `drawHallway`, or `drawFloor` in `src/renderer.ts` without changing simulation code. Preserve the configured player dimensions and hitbox unless the change intentionally retunes difficulty. See `CREDITS.md` for originality details.

## MVP boundaries

The MVP intentionally omits deployment, persistent high scores, difficulty levels, sound, music, polished external art, power-ups, boss encounters, accounts, backend services, analytics, and multiplayer.

