---
title: '$x \mapsto x \abs{x}$'
level: high-school
is: [
  differentiable,
  continuously_differentiable
]
is_not: [
  smooth,
  analytic
]
why:
  differentiable: >-
    $x \mapsto x \abs{x}$ is differentiable at every $x$: away from $0$, the function equals $x^2$ or $-x^2$, and at $0$, the difference quotient $\frac{h \abs{h}}{h} = \abs{h}$ tends to $0$, so the derivative at $0$ is $0$.
  continuously_differentiable: >-
    $x \mapsto x \abs{x}$ is continuously differentiable, because its derivative $x \mapsto 2 \abs{x}$ is continuous.
  smooth: >-
    $x \mapsto x \abs{x}$ is not smooth, because its derivative $x \mapsto 2 \abs{x}$ is not differentiable at $0$.
  analytic: >-
    $x \mapsto x \abs{x}$ is not analytic, because every analytic function is smooth.
---
