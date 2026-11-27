---
title: '$x \mapsto 2x$, as a linear map $\reals \to \reals$'
level: high-school
figure:
  widget: function-plot
  aspect: 1 / 1
  params:
    equal: true
    x: [-3, 3]
    y: [-3, 3]
    curves:
      - {"f": "2x"}
  caption: |-
    The graph of $x \mapsto 2x$.
  alt: "A straight line through the origin with slope 2."
is: [
  injective,
  surjective,
  bijective,
  endomorphism,
  automorphism
]
why:
  endomorphism: >-
    $x \mapsto 2x$ is a linear map from $\reals$ to itself, so it is an endomorphism.

  bijective: >-
    $x \mapsto 2x$ is bijective because it has inverse $x \mapsto x / 2$

  surjective: >-
    $x \mapsto 2x$ is surjective because it is bijective.

  injective: >-
    $x \mapsto 2x$ is injective because it is bijective.

  automorphism: >-
    $x \mapsto 2x$ is an automorphism on $\reals$$ because it is a linear map $\reals \to \reals$ and is bijective.
---
