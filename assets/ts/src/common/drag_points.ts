// ╭───────────────────────────────────────────────────────────────╮
// │                Dragging things drawn on a canvas               │
// ╰───────────────────────────────────────────────────────────────╯
// A canvas draws everything itself, so it can't tell the browser which parts are draggable. Here,
// `pick` says what (if anything) is under the pointer, and `move` is told where the pointer goes
// while it is held. The cursor shows a grab hand over draggable things.

export interface DragOptions<T> {
  /** The thing under the canvas point (x, y) in CSS pixels, or null for nothing draggable. */
  pick(x: number, y: number): T | null;
  /** The pointer, holding `target`, moved to (x, y), by (dx, dy) since the last call. */
  move(target: T, x: number, y: number, dx: number, dy: number): void;
  /** The pointer let go of `target`. */
  end?(target: T): void;
}

export function enableDrag<T>(canvas: HTMLCanvasElement, o: DragOptions<T>): void {
  let held: { target: T; x: number; y: number; id: number } | null = null;
  // Without this, touch dragging scrolls the page instead.
  canvas.style.touchAction = "none";
  const at = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  canvas.addEventListener("pointerdown", e => {
    const [x, y] = at(e);
    const target = o.pick(x, y);
    if (target === null) return;
    e.preventDefault();
    held = { target, x, y, id: e.pointerId };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", e => {
    const [x, y] = at(e);
    if (!held) {
      canvas.style.cursor = o.pick(x, y) === null ? "" : "grab";
      return;
    }
    if (e.pointerId !== held.id) return;
    const dx = x - held.x, dy = y - held.y;
    held.x = x;
    held.y = y;
    o.move(held.target, x, y, dx, dy);
  });
  const release = (e: PointerEvent) => {
    if (!held || e.pointerId !== held.id) return;
    const target = held.target;
    held = null;
    canvas.style.cursor = o.pick(...at(e)) === null ? "" : "grab";
    o.end?.(target);
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
}
