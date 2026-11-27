---
title: '$x \mapsto 5$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-3, 3]
    y: [-1, 6.5]
    curves:
      - {"f": "5"}
  caption: |-
    The graph of $x \mapsto 5$.
  alt: "A horizontal line at height 5."
is: [
  constant_function,
  idempotent
]
values:
  fixed_point: '$5$'
why:
  constant_function: >-
    $x \mapsto 5$ is a constant function, because it gives the same output, $5$, for every input.
  fixed_point: >-
    The only fixed point of $x \mapsto 5$ is $5$, because $f(x) = x$ means $5 = x$.
  idempotent: >-
    $x \mapsto 5$ is idempotent, because applying it twice still gives $5$.
---
