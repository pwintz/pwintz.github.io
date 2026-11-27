---
published: false
title: 'The indicator function of $\rationals$, from $\reals$ to $\reals$, with the Borel σ-algebras'
level: graduate
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    y: [-0.4, 1.4]
    curves:
      - {"f": "1", "dash": true}
      - {"f": "0", "dash": true, "same": true}
  caption: |-
    A sketch of the graph of the indicator function of $\rationals$: points at height $1$ above the rational numbers and at height $0$ above the irrational numbers (dashed).
  alt: "Two dashed horizontal lines, at heights 0 and 1."
is: [
  measurable_map,
  indicator_function
]
is_not: [continuous]
why:
  measurable_map: >-
    The indicator function of $\rationals$ is measurable, because $\rationals$ is a countable union of points, so $\rationals$ and its complement are Borel sets, and the preimage of every set is $\emptyset$, $\rationals$, $\reals \setdiff \rationals$, or $\reals$.
  continuous: >-
    The indicator function of $\rationals$ is not continuous at any point, because every interval contains rational and irrational numbers, where it takes the values $1$ and $0$.
  indicator_function: >-
    The indicator function of $\rationals$ is $1$ at every rational number and $0$ at every irrational number.
---
