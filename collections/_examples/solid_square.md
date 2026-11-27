---
title: 'A solid square, drawn on a page'
level: elementary
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    grid: false
    shapes:
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]] }
  caption: |-
    A solid square.
  alt: "A shaded square with solid edges."
values:
  interior: 'The inside of the square, without its edges'
  boundary: 'Its four edges'
  exterior: 'Everything outside the square'
why:
  interior: >-
    Every point inside the square has a small disk around it within the square, so the inside is the interior.
  boundary: >-
    Every small disk around a point on an edge reaches both inside and outside the square, so the edges are the boundary.
  exterior: >-
    The rest of the page is the exterior.
---
