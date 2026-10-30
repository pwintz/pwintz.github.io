---
published: false
title: Injective vs. surjective vs. bijective vs. endomorphism vs. automorphism
kind: family
areas: [sets]
status: draft
summary: >
  Injective, surjective, and bijective describe how a function matches inputs to outputs.
  Endomorphisms and automorphisms are structure-preserving maps from an object to itself.
terms:
  - injective
  - surjective
  - bijective
  - endomorphism
  - automorphism
examples:
  - example: x_to_e_x_as_a_function_reals_to_reals
    why: >-
      Negative numbers are not outputs.
  - example: x_to_e_x_as_a_function_reals_to_0_infinity
    why: >-
      Changing the codomain makes the same rule surjective.
  - example: x_to_x_squared_as_a_function_reals_to_0_infinity
    why: >-
      $-1$ and $1$ have the same output.
  - example: x_to_2x_as_a_linear_map_reals_to_reals
    why: >-
      An invertible linear map from $\reals$ to itself.
  - example: x_y_to_x_0_as_a_linear_map_reals_squared_to_reals
    why: >-
      A projection is linear but not invertible.
  - example: differentiation_p_to_p_prime_as_a_linear_map_from
    why: >-
      Every polynomial has an antiderivative, but all constants map to $0$.
see_also:
  - domain_vs_codomain_vs_image
  - types_of_sameness
---
## Notes

- Whether a function is surjective depends on its codomain, not just its rule.
- For groups and vector spaces, every bijective homomorphism is an isomorphism. For topological spaces, this fails: $t \mapsto (\cos t, \sin t)$ is a continuous bijection from $[0, 2\pi)$ onto the unit circle, but its inverse is not continuous, so it is not a homeomorphism.
