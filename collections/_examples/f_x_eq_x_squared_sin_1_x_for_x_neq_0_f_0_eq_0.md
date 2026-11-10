---
published: false
title: '$f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$'
level: undergraduate
is: [differentiable]
is_not: [
  continuously_differentiable,
  smooth,
  analytic
]
why:
  continuously_differentiable: >-
    $f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, is not continuously differentiable, because $f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x)$ has no limit as $x \to 0$.
  differentiable: >-
    $f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, is differentiable at every $x$: away from $0$, the product and chain rules give $f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x)$, and at $0$, the difference quotient $\frac{h^2 \sin(1/h)}{h} = h \sin(1/h)$ tends to $0$ because $\abs{h \sin(1/h)} \leq \abs{h}$, so $f^{\prime}(0) = 0$.
  smooth: >-
    $f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, is not smooth, because $f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x)$ has no limit as $x \to 0$.
  analytic: >-
    $f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, is not analytic, because $f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x)$ has no limit as $x \to 0$.
---
