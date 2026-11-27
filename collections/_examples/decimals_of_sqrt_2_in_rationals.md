---
published: false
title: 'The decimal approximations $1, 1.4, 1.41, 1.414, \dots$ of $\sqrt{2}$, as a sequence in $\rationals$'
level: undergraduate
figure:
  widget: function-plot
  params:
    var: n
    y_var: a_n
    x: [0, 8.5]
    y: [0.95, 1.5]
    curves:
      - { f: "floor(10^(n - 1) sqrt(2)) / 10^(n - 1)", from: 1, to: 8, discrete: true }
      - { f: "sqrt(2)", dash: true, color: 1, label: "\\sqrt{2}", label_at: 7 }
    zoom: { at: "sqrt(2)", factor: 10, steps: 6 }
  caption: |-
    The first $8$ decimal approximations of $\sqrt{2}$, with the line $y = \sqrt{2}$ (dashed).
    Zoom in to tell the later approximations apart from $\sqrt{2}$.
  alt: "Dots rising quickly toward a dashed line at height square root of 2. Each zoom stretches the vertical axis by 10 around the square root of 2, which separates the next approximation from the line."
is: [cauchy_sequence]
is_not: [convergent]
why:
  cauchy_sequence: >-
    The decimal approximations of $\sqrt{2}$ form a Cauchy sequence, because the $m$th and $n$th approximations, for $m, n \geq N$, agree in their first $N$ decimal places and so differ by less than $10^{-N}$.
  convergent: >-
    The decimal approximations of $\sqrt{2}$ do not converge in $\rationals$, because their only possible limit, $\sqrt{2}$, is not rational.
    In $\reals$, the same sequence converges to $\sqrt{2}$.
---
