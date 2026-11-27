---
published: false
title: 'Meanings of "Root"'
kind: conflicting
areas: [numbers, algebra]
summary: >
  "Root" has two meanings in algebra, and the two meanings often appear in the same problem.
  A [root of a number](/dictionary/definitions/root-of-number) $b$ is a number whose $n$th power is $b$, so $3$ is a square root of $9$.
  A [root of a polynomial](/dictionary/definitions/root-of-polynomial) $p$ is a number $a$ such that $p(a) = 0$, so $3$ is a root of $x^2 - 9$.
  A [zero of a function](/dictionary/definitions/zero-of-function) $f$ is an input $x$ such that $f(x) = 0$, which must be in the domain of $f$.
terms:
  - root_of_number
  - zero_of_function
  - root_of_polynomial
examples:
  - example: 3_square_root_of_9
  - example: minus_3_square_root_of_9
  - example: 2_for_f_x_eq_x_squared_minus_4
  - example: zero_for_x_squared_minus_4
  - example: zeros_of_sine
    why: >-
      The sine function has infinitely many zeros, but a nonzero polynomial has at most as many roots as its degree.
      So $\sin$ is not a polynomial function.
  - example: i_for_polynomial_x_squared_plus_1
    why: >-
      $i$ is a root of the polynomial $x^2 + 1$, but $i$ is not a zero of the function $x \mapsto x^2 + 1$ on $\reals$, because $i$ is not in the domain $\reals$.
      The roots of a polynomial can be complex numbers, but the zeros of a function must be in its domain.
  - example: i_for_real_function_x_squared_plus_1
  - example: 1_for_polynomial_x_minus_1_squared
    why: >-
      A root of a polynomial has a multiplicity, which counts how many times its factor $x - a$ divides the polynomial.
      A zero of a general function, such as $\sin$, has no multiplicity defined by factors.
see_also:
  - polynomial_vs_polynomial_function_vs_polynomial_equation
  - types_of_nothing
  - poles_vs_eigenvalues_vs_zeros
---
## Notes

### Where the two meanings meet

The $n$th roots of a number $b$ are exactly the roots of the polynomial $x^n - b$.
For example, the [square roots](/dictionary/definitions/root-of-number) of $9$, which are $3$ and $-3$, are the roots of $x^2 - 9$.
So "a root of $9$" and "a root of $x^2 - 9$" name the same numbers, but "a root of $9$" is about the number $9$, while "a root of $x^2 - 9$" is about the polynomial.

### Root of a polynomial vs. zero of a function

Over $\reals$ or $\complexes$, a root of a polynomial $p$ is a zero of the [polynomial function](/dictionary/definitions/polynomial-function) $x \mapsto p(x)$, and many texts do not distinguish the two.
The two differ in two ways.

1. A root of $p$ may lie in a larger field than the coefficients of $p$, such as a complex root of a polynomial with real coefficients.
   A zero of a function must be in the domain of the function.
2. A root of a polynomial has a multiplicity, defined by the factors of $p$.
   A zero of a general function has no multiplicity, though zeros of smooth or [analytic](/dictionary/definitions/analytic) functions have a multiplicity defined by derivatives.

### "Root" vs. "zero"

"Root" is the usual word for [polynomials](/dictionary/definitions/polynomial) and equations, and "zero" is the usual word for other functions, but both words are used for both.
A root of an equation is a solution of the equation.
