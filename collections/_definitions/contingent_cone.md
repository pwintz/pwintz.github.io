---
published: false
title: Contingent cone
term: contingent cone
applies_to: sets
synonyms: [Bouligand tangent cone, tangent cone (in Rockafellar and Wets)]
levels:
  graduate:
    context: set-valued analysis
    text: |-
      For a closed set $S \subseteq \reals^n$ and $x \in S$, the _contingent cone_ $T_S(x)$ is the set of $v$ for which there exist $t_n \downarrow 0$ and $v_n \to v$ with $x + t_n v_n \in S$.
properties:
  - >-
    $v \in T_S(x)$ if and only if $\liminf_{t \downarrow 0} \operatorname{dist}(x + t v, S) / t = 0$.
  - >-
    $T_S(x)$ is a closed cone, but it need not be convex.
  - >-
    If $S$ is convex, then $T_S(x)$ is the closure of $\lbrace t (y - x) : y \in S, t \geq 0 \rbrace$.
---
