---
published: false
title: Rational vs. irrational vs. algebraic vs. transcendental numbers
kind: hierarchy
areas: [numbers]
summary: >
  Every real number is either rational or irrational.
  Separately, every number is either algebraic or transcendental.
  Irrational does not mean transcendental: $\sqrt{2}$ is irrational but algebraic.
relation: integers ⊂ rational numbers ⊂ algebraic numbers, and transcendental numbers ⊂ irrational numbers (for real numbers).
terms:
  - integer
  - rational_number
  - irrational_number
  - real_number
  - algebraic_number
  - transcendental_number
examples:
  - example: two
    why: >-
      $2$ is an integer, and so a rational number ($2/1$) and a real number.
      It is algebraic, because it is a root of $x - 2$, so it is not irrational or transcendental.
  - example: one_half
    why: >-
      $1/2$ is a rational number, and so a real number, and it is algebraic, because it is a root of $2x - 1$.
      It is not an integer, and it is not irrational or transcendental.
  - example: sqrt_2
    why: >-
      $\sqrt{2}$ is a real number, and it is irrational, because it is not a ratio of integers.
      It is algebraic, because it is a root of $x^2 - 2$, so it is not transcendental.
  - example: pi
    why: >-
      $\pi$ is a real number, and it is transcendental: Lindemann proved in 1882 that $\pi$ is not a root of any nonzero polynomial with integer coefficients.
      So it is irrational, not an integer, and not algebraic.
  - example: i_eq_sqrt_minus_1
    why: >-
      $i$ is algebraic, because it is a root of $x^2 + 1$, so it is not transcendental.
      It is not a real number, so it is neither rational nor irrational.
see_also:
  - natural_numbers
  - fractions_vs_ratios
---
## Notes

- "Irrational" only applies to real numbers.
  A complex number such as $1 + i$ is neither rational nor irrational.
- The algebraic numbers are countable, so almost every real number is transcendental, even though it is hard to prove that any particular number (such as $\pi$) is transcendental.
