---
title: 'The circle $\setdef{(x, y) \suchthat x^2 + y^2 = 1}$ in $\reals^2$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.6, 1.6]
    y: [-1.6, 1.6]
    shapes:
      - { circle: [0, 0, 1] }
  caption: |-
    The circle $x^2 + y^2 = 1$.
  alt: "A circle of radius 1 around the origin."
values:
  interior: '$\emptyset$'
why:
  interior: >-
    The circle is a curve, so no open ball around any of its points is contained in the circle, and its interior is empty.
    The open disk $\setdef{(x, y) \suchthat x^2 + y^2 < 1}$ that the circle encloses is the interior of the closed disk, not of the circle.
---
