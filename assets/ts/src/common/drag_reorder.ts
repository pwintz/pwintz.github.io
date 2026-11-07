// ╭───────────────────────────────────────────────────────────────╮
// │                  Drag-and-drop list reordering                │
// ╰───────────────────────────────────────────────────────────────╯
// Lets the children of a list be reordered by dragging a handle. Pointer events cover mouse, pen,
// and touch. The dragged item moves in the DOM as it passes its neighbors, and the neighbors slide
// into their new slots. Only each item's `body` is transformed, never the item itself, so item
// boxes always give the untransformed slot positions.
//
// Each item must carry `data-index` with its original position; `onEnd` receives the new order as
// a list of those original indices.

export interface DragReorderOptions {
  /** The element whose children are reordered. */
  list: HTMLElement;
  /** The child of `list` to drag. */
  item: HTMLElement;
  /** The element that starts a drag when pressed. */
  handle: HTMLElement;
  /** The part of an item that follows the pointer (defaults to the item itself). */
  bodyOf?: (item: Element) => HTMLElement;
  /**
   * 'y' for a vertical list (the default), 'x' for a horizontal one, and 'wrap' for a list that
   * wraps onto several rows (such as a flex row with flex-wrap), where items move in both directions.
   */
  axis?: 'x' | 'y' | 'wrap';
  /** Class added to the item while it is dragged. */
  draggingClass: string;
  /** Called whenever the item moves to a new slot during the drag. */
  onMove?: () => void;
  /** Called after the drag settles, with the new order and whether it differs from the old one. */
  onEnd: (order: number[], changed: boolean) => void;
}

export function enableDragReorder(options: DragReorderOptions): void {
  const { list, item, handle, draggingClass, onMove, onEnd } = options;
  const bodyOf = options.bodyOf ?? ((other: Element) => other as HTMLElement);
  const axis = options.axis ?? 'y';
  // Which directions the dragged body follows the pointer in.
  const followX = axis !== 'y', followY = axis !== 'x';
  const translate = (dx: number, dy: number) => `translate(${followX ? dx : 0}px, ${followY ? dy : 0}px)`;

  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    item.classList.add(draggingClass);
    // Listen on window rather than using pointer capture: moving the item in the DOM releases
    // capture, which would drop the rest of the drag.

    const body = bodyOf(item);
    const startX = event.clientX, startY = event.clientY;
    const startBox = item.getBoundingClientRect();

    // Keeps the dragged body under the pointer, wherever its item currently sits in the list.
    const follow = (e: PointerEvent) => {
      const box = item.getBoundingClientRect();
      body.style.transform = translate(
        e.clientX - startX - (box.left - startBox.left),
        e.clientY - startY - (box.top - startBox.top));
    };

    // Moves the dragged item before `before` (null = to the end), sliding the other items to
    // their new slots: record where they were, move the item, then animate from old to new.
    const moveItem = (before: Element | null) => {
      const others = [...list.children].filter((other) => other !== item);
      const oldBoxes = new Map(others.map((other) => [other, other.getBoundingClientRect()]));
      list.insertBefore(item, before);
      onMove?.();
      for (const other of others) {
        const old = oldBoxes.get(other)!, now = other.getBoundingClientRect();
        const dx = old.left - now.left, dy = old.top - now.top;
        if (dx === 0 && dy === 0) continue;
        // Animate in both directions here, since a slot can change rows even in a 1D list.
        bodyOf(other).animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
          { duration: 150, easing: 'ease-out' },
        );
      }
    };

    const middle = (other: Element) => {
      const box = other.getBoundingClientRect();
      return axis === 'x' ? (box.left + box.right) / 2 : (box.top + box.bottom) / 2;
    };

    // In a wrapping list, move into a neighbor's slot when the pointer is inside that neighbor's
    // box (the item boxes are never transformed, so they are the slots). After the move, that
    // neighbor has shifted out from under the pointer, so it can't immediately swap back.
    const moveWrapped = (e: PointerEvent) => {
      const siblings = [...list.children];
      const target = siblings.find((other) => {
        if (other === item) return false;
        const box = other.getBoundingClientRect();
        return e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
      });
      if (!target) return;
      const after = siblings.indexOf(target) > siblings.indexOf(item);
      moveItem(after ? target.nextElementSibling : target);
      follow(e);
    };

    // In a 1D list, swap with a neighbor once the dragged item's center crosses that neighbor's
    // midpoint. Comparing centers (not edges) keeps items of different sizes from swapping back
    // and forth: after a swap, the neighbor's midpoint lies on the other side of the unchanged
    // center. Loop so a fast drag can pass several items in one move; the cap guards against any
    // cycle.
    const onPointerMove = (moveEvent: PointerEvent) => {
      follow(moveEvent);
      if (axis === 'wrap') {
        moveWrapped(moveEvent);
        return;
      }
      for (let guard = 0; guard < list.children.length; guard++) {
        const center = middle(body);
        const next = item.nextElementSibling;
        const prev = item.previousElementSibling;
        if (next && center > middle(next)) {
          moveItem(next.nextElementSibling);
        } else if (prev && center < middle(prev)) {
          moveItem(prev);
        } else {
          break;
        }
        follow(moveEvent);
      }
    };

    const onPointerEnd = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);

      // Each item remembers its original index; read the new order from the DOM.
      const order = [...list.children].map((other) => Number((other as HTMLElement).dataset.index));
      const changed = order.some((original, position) => original !== position);

      // Settle the dragged item into its slot, then report the new order.
      const settle = body.animate(
        [{ transform: body.style.transform || 'translate(0, 0)' }, { transform: 'translate(0, 0)' }],
        { duration: 120, easing: 'ease-out' },
      );
      body.style.transform = '';
      settle.onfinish = () => {
        item.classList.remove(draggingClass);
        onEnd(order, changed);
      };
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);
  });
}
