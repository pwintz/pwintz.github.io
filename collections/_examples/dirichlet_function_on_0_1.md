---
title: 'The indicator function of $\rationals$ on $[0, 1]$: $f(x) = 1$ for rational $x$ and $f(x) = 0$ for irrational $x$'
level: undergraduate
# figure:
#   widget: function-plot
#   params:
#     x: [-0.2, 1.2]
#     y: [-0.4, 1.4]
#     curves:
#       - {"f": "1", "dash": true, "from": 0, "to": 1}
#       - {"f": "0", "dash": true, "same": true, "from": 0, "to": 1}
#   caption: |-
#     A sketch of the graph of the indicator function of $\rationals$ on $[0, 1]$: points at height $1$ above the rational numbers and at height $0$ above the irrational numbers (dashed).
#   alt: "Two dashed horizontal segments over [0, 1], at heights 0 and 1."
values:
  riemann_integral: 'None'
  lebesgue_integral: '$\int_{[0, 1]} f \diff{\mu} = 1 \cdot \mu(\rationals \cap [0, 1]) = 0$'
why:
  riemann_integral: >-
    The indicator function of $\rationals$ on $[0, 1]$ is not Riemann integrable, because every subinterval contains rational and irrational points, so Riemann sums can be $0$ or $1$ however fine the partition.
  lebesgue_integral: >-
    The Lebesgue integral of the indicator function of $\rationals$ is $0$, because the rational numbers in $[0, 1]$ have measure $0$.
---
