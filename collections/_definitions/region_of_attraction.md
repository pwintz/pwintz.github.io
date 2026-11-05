---
published: false
title: Region of attraction
term: region of attraction
applies_to: equilibria
synonyms: [domain of attraction]
levels:
  high-school:
    text: |-
      Consider a system with a stable [equilibrium](/definitions/equilibrium).
      The _region of attraction_ of the equilibrium is the set of starting states from which the system eventually settles there.
  undergraduate:
    text: |-
      Consider a system with an [asymptotically stable](/definitions/asymptotically-stable) [equilibrium](/definitions/equilibrium) $x^{\ast}$.
      The _region of attraction_ of $x^{\ast}$ is the set of all initial states whose solutions converge to $x^{\ast}$.
properties:
  - >-
    The region of attraction is an open, invariant set.
  - >-
    If $V$ is a [Lyapunov function](/definitions/lyapunov-function) and $\dot{V} < 0$ on a [bounded](/definitions/bounded) sublevel set $\setdef{x \suchthat V(x) \leq c}$ (except at $x^{\ast}$), then that sublevel set is a [forward invariant](/definitions/forward-invariant) [subset](/definitions/subset) of the region of attraction, which is how regions of attraction are usually estimated.
---
Some authors call any such estimate a "region of attraction," rather than the whole set.
