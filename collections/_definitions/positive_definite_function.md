---
published: false
title: Positive definite function
term: positive definite
applies_to: functions
levels:
  graduate:
    context: Lyapunov theory
    text: |-
      A function $V : D \to \reals$ with $0 \in D$ is _positive definite_ if $V(0) = 0$ and $V(x) > 0$ for all $x \neq 0$ in $D$. It is _positive semidefinite_ if $V(0) = 0$ and $V(x) \geq 0$ for all $x$.
---
A [symmetric matrix](/definitions/symmetric-matrix) $P$ is positive definite if $x^{\top} P x > 0$ for all $x \neq 0$, which says exactly that the function $V(x) = x^{\top} P x$ is positive definite. Positive definite functions in harmonic analysis (Bochner's theorem) are something else.
