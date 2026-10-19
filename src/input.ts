export interface InputController {
  consume(): boolean;
  clear(): void;
  destroy(): void;
}

export function createInputController(
  gameSurface: HTMLElement,
  actionButtons: readonly HTMLButtonElement[],
): InputController {
  let pending = false;

  const queueAction = (): void => {
    pending = true;
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.code !== 'Space' && event.code !== 'ArrowUp') return;
    event.preventDefault();
    if (event.repeat) return;
    queueAction();
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (event.target instanceof Element && event.target.closest('button')) return;
    event.preventDefault();
    queueAction();
  };

  window.addEventListener('keydown', onKeyDown, { passive: false });
  gameSurface.addEventListener('pointerdown', onPointerDown, { passive: false });
  actionButtons.forEach((button) => button.addEventListener('click', queueAction));

  return {
    consume() {
      const action = pending;
      pending = false;
      return action;
    },
    clear() {
      pending = false;
    },
    destroy() {
      window.removeEventListener('keydown', onKeyDown);
      gameSurface.removeEventListener('pointerdown', onPointerDown);
      actionButtons.forEach((button) => button.removeEventListener('click', queueAction));
    },
  };
}

