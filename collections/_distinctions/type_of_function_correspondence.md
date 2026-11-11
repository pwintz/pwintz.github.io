---
published: false
title: Injective vs. surjective vs. bijective vs. endomorphism vs. automorphism
kind: family
areas: [sets]
summary: >
  A function can match its inputs to its outputs in several ways, and functions from a structure to itself have their own names.
  [Injective](/dictionary/definitions/injective), [surjective](/dictionary/definitions/surjective), and [bijective](/dictionary/definitions/bijective) describe how a function matches inputs to outputs.
  [Endomorphisms](/dictionary/definitions/endomorphism) and [automorphisms](/dictionary/definitions/automorphism) are structure-preserving maps from an object to itself.
terms:
  - injective
  - surjective
  - bijective
  - endomorphism
  - automorphism
examples:
  - example: x_to_e_x_as_a_function_reals_to_reals
  - example: x_to_e_x_as_a_function_reals_to_0_infinity
    why: >-
      Changing the codomain from $\reals$ to $(0, \infty)$ makes the same rule $x \mapsto e^x$ surjective.
  - example: x_to_x_squared_as_a_function_reals_to_0_infinity
  - example: x_to_2x_as_a_linear_map_reals_to_reals
  - example: x_y_to_x_0_as_a_linear_map_R2_to_R
  - example: differentiation_p_to_p_prime_as_a_linear_map_from
see_also:
  - domain_vs_codomain_vs_image
  - types_of_sameness
---
## Notes

- Whether a function is [surjective](/dictionary/definitions/surjective) depends on its [codomain](/dictionary/definitions/codomain), not just its rule.
- For groups and vector spaces, every [bijective](/dictionary/definitions/bijective) homomorphism is an isomorphism.
  For topological spaces, this fails: $t \mapsto (\cos t, \sin t)$ is a [continuous](/dictionary/definitions/continuous) bijection from $[0, 2\pi)$ onto the unit [circle](/dictionary/definitions/circle), but its inverse is not continuous, so it is not a [homeomorphism](/dictionary/definitions/homeomorphism).
