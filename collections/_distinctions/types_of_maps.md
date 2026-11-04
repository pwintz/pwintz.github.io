---
published: false
title: Types of maps
kind: family
areas: [sets, analysis]
status: draft
summary: >
  Operators, functionals, and transforms are all functions.
  Their names signal what the inputs and outputs are:
  operators act on vectors (often functions) and return vectors, functionals return scalars, and transforms change the variable of a function.
terms:
  - function
  - operator
  - functional
  - transform
examples:
  - example: square_on_reals
    why: >-
      $x \mapsto x^2$ is a function.
      It is not an operator, functional, or transform, because its inputs are numbers, not elements of a space of functions.
  - example: f_to_f_prime_on_differentiable_functions
    why: >-
      $f \mapsto f^{\prime}$ is a function, and it is an operator because it takes a function and returns a function.
      It is not a functional, because its outputs are functions, not numbers.
  - example: f_to_f_0
    why: >-
      $f \mapsto f(0)$ is a function, and it is a functional because it takes a function and returns a number.
      It is not an operator, because its outputs are numbers, not functions.
  - example: the_fourier_transform_f_to_hat_f
    why: >-
      The Fourier transform is a function, and an operator, because it takes a function and returns a function.
      It is called a transform because it converts a function of time into a function of frequency, and it is not a functional, because its outputs are functions.
see_also:
  - function_vs_map
  - relation_vs_operator
  - types_of_function_transforms
---
## Notes

- "Map" is not listed here because it is an exact synonym for "function."
  See [function vs. map](/distinctions/function-vs-map).
