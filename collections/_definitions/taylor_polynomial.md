---
published: false
title: Taylor Polynomial
term: Taylor polynomial
applies_to: functions
levels:
  high-school:
    text: |-
      Consider a function $f$ and a point $a$.
      The _Taylor polynomial_ of degree $n$ of $f$ at $a$ is the [polynomial](/dictionary/definitions/polynomial) of degree at most $n$ whose value and first $n$ derivatives at $a$ are the same as those of $f$.
      Near $a$, it approximates $f$.
      For example, the Taylor polynomial of degree $1$ is the tangent line to the graph of $f$ at $a$.
    figure:
      widget: taylor
      params: { fn: sin, drag: true, degree: 3 }
      caption: |-
        The graph of $f(x) = \sin x$ and its Taylor polynomial $P_n$ of degree $n$ at $a$ (dashed).
        Drag $a$, and change $n$ with the slider.
      alt: "A sine wave and a dashed polynomial curve that follows the wave near a point a on the x-axis and turns away from it farther out. The point a can be dragged, and a slider sets the degree n."
  undergraduate:
    text: |-
      Consider a function $f : I \to \reals$ on an open interval $I$, a point $a \in I$, and a number $n \geq 0$ such that $f$ is $n$ times [differentiable](/dictionary/definitions/differentiable) at $a$.
      The _Taylor polynomial_ of degree $n$ of $f$ at $a$ is

      $$P_n(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!} (x - a)^k.$$
properties:
  - |-
    The Taylor polynomial $P_n$ and $f$ have the same value and the same first $n$ derivatives at $a$.
  - |-
    The Taylor polynomial of degree $1$ is the tangent line approximation $P_1(x) = f(a) + f^{\prime}(a) (x - a)$.
  - |-
    The Taylor polynomials of $f$ at $a$ are the partial sums of the [Taylor series](/dictionary/definitions/taylor-series) of $f$ at $a$.
  - |-
    The remainder $R_n(x) = f(x) - P_n(x)$ is small compared with $(x - a)^n$ near $a$:

    $$\lim_{x \to a} \frac{R_n(x)}{(x - a)^n} = 0.$$
  - |-
    If $f$ is $n + 1$ times [differentiable](/dictionary/definitions/differentiable) on $I$, then for each $x \in I$ there exists $c$ between $a$ and $x$ such that

    $$R_n(x) = \frac{f^{(n+1)}(c)}{(n + 1)!} (x - a)^{n+1}.$$

    This is the Lagrange form of the remainder.
---
