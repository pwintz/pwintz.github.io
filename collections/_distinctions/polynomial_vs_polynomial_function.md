---
title: Polynomial vs. Polynomial Function
kind: siblings
areas: [algebra, numbers]
summary: >
  A polynomial and the polynomial function that it gives are written the same way, such as $x^2 + x$.
  A [polynomial](/dictionary/definitions/polynomial) is a formal sum, and two polynomials are equal when their coefficients are equal.
  A [polynomial function](/dictionary/definitions/polynomial-function) is a function, and two polynomial functions are equal when they give the same output for every input.
  Over the [real numbers](/dictionary/definitions/real-number), the two kinds of equality agree, but over a finite set of numbers, such as $\setdef{0, 1}$ with arithmetic modulo $2$, two different polynomials can give the same polynomial function.
terms:
  - polynomial
  - polynomial_function
examples:
  - example: poly_function_x_squared_minus_1
    why: >-
      Over $\reals$, $x^2 - 1$ is the only polynomial that gives the function $f(x) = x^2 - 1$.
      The difference of two different real polynomials is a nonzero polynomial, which has only finitely many roots, so the two polynomials give different outputs for some input.
  - example: poly_x_squared_plus_x_mod_2
    why: >-
      With arithmetic modulo $2$, the polynomials $x^2 + x$ and $0$ are different, because their coefficients of $x^2$ differ.
      But $x^2 + x$ and $0$ give the same polynomial function, the zero function on $\setdef{0, 1}$.
  - example: x_cubed_and_x_mod_3
see_also:
  - polynomial_vs_polynomial_function_vs_polynomial_equation
  - types_of_sameness
---
## Notes

- Over an infinite field, such as $\reals$ or $\complexes$, different [polynomials](/dictionary/definitions/polynomial) give different [polynomial functions](/dictionary/definitions/polynomial-function), so "polynomial" is often used for both.
- Over a finite field $F$ with $q$ elements, every $a \in F$ satisfies $a^q = a$, so the nonzero polynomial $x^q - x$ gives the zero function.
