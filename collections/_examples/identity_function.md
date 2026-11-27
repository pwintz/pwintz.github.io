---
title: '$x \mapsto x$, for composition of functions'
level: high-school
figure:
  widget: function-plot
  aspect: 1 / 1
  params:
    equal: true
    x: [-3, 3]
    y: [-3, 3]
    curves:
      - {"f": "x"}
  caption: |-
    The graph of the identity function $x \mapsto x$.
  alt: "A straight line through the origin with slope 1."
is: [
  idempotent,
  identity_element
]
is_not: [constant_function]
why:
  identity_element: >-
    $x \mapsto x$ is the identity element for composition, because composing every function with it gives that function.
  idempotent: >-
    $x \mapsto x$ is idempotent, because composing it with itself gives itself.
  constant_function: >-
    $x \mapsto x$ is not a constant function, because different inputs give different outputs: $1 \mapsto 1$ and $2 \mapsto 2$.
---
