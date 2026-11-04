---
published: false
title: Polynomial vs. polynomial function vs. polynomial equation
kind: siblings
areas: [numbers, language]
status: draft
summary: >
  A polynomial is an expression, such as $x^2 - 1$.
  A polynomial function assigns an output to each input using a polynomial.
  A polynomial equation, such as $x^2 - 1 = 0$, is a statement to be solved.
terms:
  - polynomial
  - polynomial_function
  - polynomial_equation
examples:
  - example: poly_x_squared_minus_1
    why: >-
      $x^2 - 1$ is a polynomial: a formal expression with the coefficients $1$, $0$, and $-1$.
      It is not an equation, because it has no equal sign, and it is not a function until it is given a domain.
  - example: poly_function_x_squared_minus_1
    why: >-
      $f(x) = x^2 - 1$ for $x \in \reals$ is a polynomial function because it evaluates a polynomial at each real number.
      It is not an equation to be solved, but a rule.
  - example: poly_equation_x_squared_minus_1
    why: >-
      $x^2 - 1 = 0$ is a polynomial equation, whose solutions are $x = \pm 1$.
      It is not a polynomial, because it says that a polynomial is equal to $0$.
  - example: sqrt_x_plus_1
    why: >-
      $\sqrt{x} + 1$ is not a polynomial, because $\sqrt{x} = x^{1/2}$ is not a whole-number power of $x$.
  - example: x_to_sin_x
    why: >-
      $\sin$ is not a polynomial function, because it has infinitely many zeros, and a nonzero polynomial has only finitely many.
  - example: poly_x_squared_plus_x_mod_2
    why: >-
      $x^2 + x$ is a nonzero polynomial over $\lbrace 0, 1 \rbrace$.
      Its polynomial function is the zero function, because $0^2 + 0 = 0$ and $1^2 + 1 = 0$, so over a finite field, different polynomials can give the same function.
see_also:
  - equal_signs
  - types_of_mathematical_expressions
---
## Notes

- Over $\reals$ and $\mathbb{C}$, a polynomial and its polynomial function determine each other, so "polynomial" is often used for both.
- "Solve the polynomial $x^2 - 1$" is shorthand for "find the roots of $x^2 - 1$," that is, solve the polynomial equation $x^2 - 1 = 0$.
