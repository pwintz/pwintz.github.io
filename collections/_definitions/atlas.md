---
published: false
title: Atlas
term: atlas
applies_to: manifolds
levels:
  graduate:
    context: differential geometry
    text: |-
      Consider a [manifold](/dictionary/definitions/manifold) $M$.
      An _atlas_ on $M$ is a collection of [charts](/dictionary/definitions/chart-manifold) $\{(U_\alpha, \varphi_\alpha)\}_{\alpha \in A}$ on $M$ such that the domains cover $M$:

      $$\bigcup_{\alpha \in A} U_\alpha = M.$$
properties:
  - >-
    Consider two charts $(U_\alpha, \varphi_\alpha)$ and $(U_\beta, \varphi_\beta)$ in an atlas such that $U_\alpha \cap U_\beta$ is nonempty.
    The _transition map_ $\varphi_\beta \circ \varphi_\alpha^{-1}$ sends $\varphi_\alpha(U_\alpha \cap U_\beta)$ to $\varphi_\beta(U_\alpha \cap U_\beta)$.
  - >-
    An atlas is _smooth_ if all of its transition maps are [smooth](/dictionary/definitions/smooth).
    A smooth atlas makes $M$ a smooth manifold.
  - >-
    The [sphere](/dictionary/definitions/sphere) has an atlas with two charts, given by stereographic projection from the north pole and from the south pole.
---
