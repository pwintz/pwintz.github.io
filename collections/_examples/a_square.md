---
title: 'A square'
level: elementary
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    grid: false
    reflect: true
    rotate: 90
    shapes:
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]], edges: [0, 2, 3, 4] }
      - { line: [[0, 0], [1, 0]], color: 6, dash: true }
      - { line: [[0, 0], [0, 1]], color: 6, dash: true }
      - { line: [[0, 0], [1, 1]], color: 6, dash: true }
      - { line: [[0, 0], [1, -1]], color: 6, dash: true }
      - { point: [-1, -1], label: A }
      - { point: [1, -1], label: B }
      - { point: [1, 1], label: C }
      - { point: [-1, 1], label: D }
  caption: |-
    A square with corners $A$, $B$, $C$, and $D$ and its sides in four colors, and its four lines of reflection (dashed).
    Click a line to reflect the square across it, or rotate it by $90°$ about its center with the button.
  alt: "A shaded square with corners labeled A, B, C, and D and each side in a different color, crossed by four dashed lines through its center: horizontal, vertical, and the two diagonals. Clicking a line reflects the square across it, and a button rotates it by 90 degrees."
is: [geometric_symmetry]
why:
  geometric_symmetry: >-
    A square has geometric symmetry, with $8$ symmetries: $4$ rotations (by multiples of $90°$) and $4$ reflections.
---
