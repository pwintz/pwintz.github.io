---
title: '$f(x) = x^2$, as a function $f : \reals \to [0, \infty)$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    curves:
      - {"f": "x^2", "label": "f"}
  caption: |-
    The graph of $f(x) = x^2$.
  alt: "A parabola opening upward with its vertex at the origin."
is: [surjective]
is_not: [injective]
values:
  domain: '$\reals$'
  codomain: '$[0, \infty)$'
  range_image: '$f(\reals) = [0, \infty)$'
  image: '$f([-1, 2]) = [0, 4]$'
  preimage: '$f^{-1}(\setdef{4}) = \setdef{-2, 2}$'
why:
  surjective: >-
    $f$ is surjective, because every number in the codomain $[0, \infty)$ is the square of a real number.
  injective: >-
    $f$ is not injective, because $f(-2) = f(2) = 4$.
  codomain: >-
    The codomain of $f$ is $[0, \infty)$, because $f$ is declared as a function from $\reals$ to $[0, \infty)$.
---
