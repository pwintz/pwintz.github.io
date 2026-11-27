---
published: false
title: 'The function sequence $f_n(x) = x^n$ on $[0, \frac{1}{2}]$, as $n \to \infty$'
detail: >-
  The sequence of functions $f_1(x) = x$, $f_2(x) = x^2$, $f_3(x) = x^3$, $\dots$, each defined for $x$ in $[0, \frac{1}{2}]$.
  For each fixed $x$ in the interval, $x^n \to 0$ as $n \to \infty$.
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.05, 0.6]
    y: [-0.05, 0.6]
    curves:
      - {"f": "x^1", "label": "f_{1}", "from": 0, "to": 0.5, "ends": "[]"}
      - {"f": "x^2", "label": "f_{2}", "from": 0, "to": 0.5, "ends": "[]"}
      - {"f": "x^4", "label": "f_{4}", "from": 0, "to": 0.5, "ends": "[]"}
      - {"f": "x^8", "from": 0, "to": 0.5, "ends": "[]"}
      - {"f": "x^16", "from": 0, "to": 0.5, "ends": "[]"}
      - {"f": "x^32", "from": 0, "to": 0.5, "ends": "[]"}
  caption: |-
    The graphs of $f_n(x) = x^n$ on $[0, 1/2]$ for $n = 1, 2, 4, 8, 16, 32$.
  alt: "Six curves from the origin to x = 1/2, each lower than the last, crowding onto the x-axis."
is: [
  uniform_in_parameter,
  uniform_convergence
]
why:
  uniform_in_parameter: >-
    $x^n \to 0$ uniformly on $[0, \frac{1}{2}]$, because $x^n \leq 2^{-n}$ for every $x$ in the interval.
  uniform_convergence: >-
    $x^n \to 0$ uniformly on $[0, \frac{1}{2}]$, because $N$ with $2^{-N} < \varepsilon$ works for every $x$ in the interval.
---
