---
published: false
title: Clarke tangent cone
term: Clarke tangent cone
applies_to: sets
synonyms: [regular tangent cone (in Rockafellar and Wets)]
levels:
  graduate:
    context: set-valued analysis
    text: |-
      Consider a [closed set](/dictionary/definitions/closed-set) $S \subseteq \reals^n$ and a point $x \in S$.
      The _Clarke tangent cone_ $C_S(x)$ is the set of $v$ such that for all [sequences](/dictionary/definitions/sequence) $x_n \to x$ in $S$ and $t_n \downarrow 0$, there exist $v_n \to v$ such that $x_n + t_n v_n \in S$.
properties:
  - >-
    $C_S(x)$ is closed and convex.
  - >-
    $C_S(x) \subseteq T_S(x)$, where $T_S(x)$ is the [contingent cone](/dictionary/definitions/contingent-cone), with equality when $S$ is convex.
---
