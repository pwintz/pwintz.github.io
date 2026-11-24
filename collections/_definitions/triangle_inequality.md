---
title: Triangle Inequality
term: triangle inequality
applies_to: norms and metrics
levels:
  elementary:
    text: |-
      Consider a triangle that has sides with lengths $A$, $B$, and $C$.
      The _triangle inequality_ states that 
      
      $$A + B \leq C$$
      
      That is, sum of any two sides of a triangle is less than the other side.

    # So walking straight from one corner to another is no longer than walking there through the third corner.
  high-school:
    text: |-
      The _triangle inequality_ states that, for all vectors $\vect{x}$ and $\vect{y}$,

      $$\norm{\vect{x} + \vect{y}} \leq \norm{\vect{x}} + \norm{\vect{y}}.$$

      For numbers $a$ and $b$, it states that $\abs{a + b} \le \abs{a} + \abs{b}$.
  undergraduate:
    context: norms
    text: |-
      Consider a [vector space](/dictionary/definitions/vector-space) $V$ and a function $\norm{\cdot} : V \to [0, \infty)$.
      The function satisfies the _triangle inequality_ if, for all $\vect{x}, \vect{y} \in V$,

      $$\norm{\vect{x} + \vect{y}} \le \norm{\vect{x}} + \norm{\vect{y}}.$$
  graduate:
    context: metrics
    text: |-
      Consider a set $X$ and a function $d : X \times X \to [0, \infty)$.
      The function satisfies the _triangle inequality_ if, for all $x, y, z \in X$,

      $$d(x, z) \le d(x, y) + d(y, z).$$
properties:
  - |-
    The triangle inequality is one of the conditions in the definitions of a [norm](/dictionary/definitions/norm) and of a [metric](/dictionary/definitions/metric).
    For a norm, the metric $d(x, y) = \norm{x - y}$ satisfies the metric version of the triangle inequality.
  - |-
    The reverse triangle inequality

    $$\abs{\norm{\vect{x}} - \norm{\vect{y}}} \le \norm{\vect{x} - \vect{y}}$$

    follows from the triangle inequality.
  - |-
    For the [norm](/dictionary/definitions/norm) of an [inner product](/dictionary/definitions/inner-product), the triangle inequality follows from the [Cauchy–Schwarz inequality](/dictionary/definitions/cauchy-schwarz-inequality):

    $$\norm{\vect{x} + \vect{y}}^2 = \norm{\vect{x}}^2 + 2 \ip{\vect{x}}{\vect{y}} + \norm{\vect{y}}^2 \le \norm{\vect{x}}^2 + 2 \norm{\vect{x}} \norm{\vect{y}} + \norm{\vect{y}}^2 = (\norm{\vect{x}} + \norm{\vect{y}})^2.$$

    This calculation is for a real [inner product space](/dictionary/definitions/inner-product-space).
  - |-
    For the [Euclidean norm](/dictionary/definitions/euclidean-norm), equality holds if and only if one of $\vect{x}$ and $\vect{y}$ is a nonnegative multiple of the other, so that the "triangle" is flat, otherwise strict inequality is achieved.

  # Todo: Mention the pythagorean theorem as related result.
---
