---
title: 'The functions $\sin$ and $\cos$ on $[-\pi, \pi]$, with the $L^2$ inner product $\ip{f}{g} = \int_{-\pi}^{\pi} f(x) g(x) \dx$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-3.6, 3.6]
    y: [-1.4, 1.4]
    curves:
      - {"f": "sin x", "label": "\\sin", "from": -3.14159265, "to": 3.14159265, "ends": "[]"}
      - {"f": "cos x", "label": "\\cos", "from": -3.14159265, "to": 3.14159265, "ends": "[]"}
  caption: |-
    The graphs of $\sin$ and $\cos$ on $[-\pi, \pi]$.
  alt: "Two waves between -1 and 1 on the interval from -pi to pi: sine through the origin and cosine with a peak at the origin."
is: [orthogonal_vectors]
is_not: [perpendicular]
why:
  orthogonal_vectors: >-
    The functions $\sin$ and $\cos$ are orthogonal in the $L^2$ inner product on $[-\pi, \pi]$, because $\int_{-\pi}^{\pi} \sin(x) \cos(x) \dx = 0$, since the integrand is odd.
  perpendicular: >-
    The functions $\sin$ and $\cos$ are not called perpendicular, because perpendicularity describes lines and planes in geometry, and functions are not lines.
---
