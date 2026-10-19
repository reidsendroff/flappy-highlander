# Credits and originality

Flappy Highlander was created for the Northern Highlands AI Club demonstration. Its source code, interface, game bird, lockers, hallway, and floor are original to this project.

The bird uses a red, black, and white palette inspired by the public visual identity on the Northern Highlands Regional School District website. It does not reproduce the school seal, logo, lettering, or an existing mascot. It does not use artwork, audio, source code, or interface elements from Flappy Bird.

All MVP graphics are drawn at runtime with the Canvas 2D API. There are no external image, font, or audio downloads. To replace the artwork later without changing gameplay, update the isolated `drawBird`, `drawLocker`, `drawHallway`, and `drawFloor` functions in `src/renderer.ts`; keep the configured drawing dimensions and hitbox values stable unless gameplay is intentionally retuned.

