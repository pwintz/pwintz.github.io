---
published: false
title: Antiderivative
term: antiderivative
applies_to: functions
synonyms: [primitive, indefinite integral]
levels:
  high-school:
    text: |-
      Consider a function $f$ on an interval.
      An _antiderivative_ of $f$ is a function $F$ whose [derivative](/dictionary/definitions/ordinary-derivative) is $f$:

      $$F^{\prime}(x) = f(x) \quad \text{for every } x \text{ in the interval}.$$
properties:
  - >-
    If $F$ is an antiderivative of $f$ on an interval, then the antiderivatives of $f$ are exactly the functions $F + C$ for constants $C$.
  - >-
    By the fundamental theorem of calculus, every [continuous](/dictionary/definitions/continuous) function $f$ on $[a, b]$ has the antiderivative $F(x) = \int_a^x f(t) \mathrm{d}t$, and $\int_a^b f(x) \mathrm{d}x = F(b) - F(a)$ for every antiderivative $F$.
  - >-
    Not every function has an antiderivative: the step function that jumps from $0$ to $1$ at $0$ has none on an interval containing $0$, because derivatives cannot jump.
---
The antiderivatives of $f$ are written $\int f(x) \mathrm{d}x$ (the _indefinite integral_), as in $\int 2x \mathrm{d}x = x^2 + C$.
