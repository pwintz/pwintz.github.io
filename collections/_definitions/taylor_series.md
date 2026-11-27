---
published: false
title: Taylor Series
term: Taylor series
applies_to: functions
synonyms: [Taylor expansion]
levels:
  high-school:
    text: |-
      Consider a function $f$ and a point $a$.
      The _Taylor series_ of $f$ at $a$ is the "[polynomial](/dictionary/definitions/polynomial) with infinitely many terms" whose value and derivatives of every order at $a$ are the same as those of $f$.
      For example, the Taylor series of $e^x$ at $0$ is $1 + x + x^2/2 + x^3/6 + \dots$.
  undergraduate:
    text: |-
      Consider a function $f : I \to \reals$ on an open interval $I$ and a point $a \in I$ such that $f$ has derivatives of every order at $a$.
      The _Taylor series_ of $f$ at $a$ is the power series

      $$\sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!} (x - a)^n.$$
properties:
  - |-
    The partial sums of the Taylor series of $f$ at $a$ are the [Taylor polynomials](/dictionary/definitions/taylor-polynomial) of $f$ at $a$.
  - |-
    A Taylor series at $a = 0$ is also called a _Maclaurin series_.
  - |-
    The Taylor series of $f$ can diverge at points where $f$ is defined.
    For example, the Taylor series $1 + x + x^2 + \dots$ of $1/(1 - x)$ at $0$ converges only for $-1 < x < 1$.
  - |-
    The Taylor series of $f$ can converge to a function other than $f$.
    For example, every derivative at $0$ of the function equal to $e^{-1/x}$ for $x > 0$ and $0$ for $x \leq 0$ is $0$, so its Taylor series at $0$ is $0$.
    A function that equals its Taylor series near each point of its domain is [analytic](/dictionary/definitions/analytic).
---
