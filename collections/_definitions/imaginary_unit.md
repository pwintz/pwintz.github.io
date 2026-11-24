---
title: Imaginary Unit
term: imaginary unit
applies_to: complex numbers
synonyms: ['$i$', '$j$', '$\sqrt{-1}$']
levels:
  high-school:
    text: |-
      The _imaginary unit_ is a number $i$ whose square is $-1$:

      $$i^2 = -1.$$
  undergraduate:
    text: |-
      Consider the complex numbers $\complexes$, constructed as the set of pairs $(a, b)$ of [real numbers](/dictionary/definitions/real-number) with addition $(a, b) + (c, d) = (a + c, b + d)$ and multiplication

      $$(a, b)(c, d) = (ac - bd, ad + bc).$$

      The _imaginary unit_ is the complex number

      $$i = (0, 1).$$

      Identifying each real number $a$ with the pair $(a, 0)$, the imaginary unit $i$ satisfies $i^2 = (-1, 0) = -1$, and each pair $(a, b)$ is equal to $a + b i$.
properties:
  - |-
    The imaginary unit $i$ is not a [real number](/dictionary/definitions/real-number), because the square of every real number is nonnegative.
  - |-
    Every complex number can be written as $a + b i$, where $a$ and $b$ are [real numbers](/dictionary/definitions/real-number).
  - |-
    The equation $x^2 = -1$ has exactly two complex solutions, $i$ and $-i$.
  - |-
    The powers of $i$ repeat every four steps:

    $$i^1 = i, \quad i^2 = -1, \quad i^3 = -i, \quad i^4 = 1.$$

    For every natural number $n$, the power $i^n$ is equal to $i^r$, where $r$ is the remainder of $n$ divided by $4$.
  - |-
    In the complex plane, $i$ is the point one unit above $0$ on the imaginary axis, and multiplying a complex number by $i$ rotates it a quarter turn counterclockwise about $0$.
  - |-
    The imaginary unit $i$ has modulus $\abs{i} = 1$, angle $\pi/2$, and [complex conjugate](/dictionary/definitions/complex-conjugate) $\conj{i} = -i$, so $1/i = -i$.
---
### Notation

Electrical engineers write $j$ for the imaginary unit, because $i$ is the usual symbol for electric current.

### The square root of −1

Writing $i = \sqrt{-1}$ is common, but the rule $\sqrt{a} \sqrt{b} = \sqrt{ab}$ holds only for nonnegative [real numbers](/dictionary/definitions/real-number) $a$ and $b$.
Applying it to $-1$ gives a false result:

$$-1 = i \cdot i = \sqrt{-1} \sqrt{-1} \neq \sqrt{(-1)(-1)} = \sqrt{1} = 1.$$
