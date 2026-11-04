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
      $x \mapsto e^x$ is injective because it is increasing.
      It is not surjective onto $\reals$, because negative numbers are not outputs, so it is not bijective.
  - example: x_to_e_x_as_a_function_reals_to_0_infinity
    why: >-
      $x \mapsto e^x$ is injective because it is increasing.
      It is surjective onto $(0, \infty)$, because every positive $y$ is $e^{\ln y}$, so it is bijective; changing the codomain made the same rule surjective.
  - example: x_to_x_squared_as_a_function_reals_to_0_infinity
    why: >-
      $x \mapsto x^2$ is surjective onto $[0, \infty)$, because every $y \geq 0$ is $(\sqrt{y})^2$.
      It is not injective, because $-1$ and $1$ have the same output, so it is not bijective.
  - example: x_to_2x_as_a_linear_map_reals_to_reals
    why: >-
      $x \mapsto 2x$ is a linear map from $\reals$ to itself, so it is an endomorphism.
      It is bijective, with inverse $x \mapsto x / 2$, so it is injective, surjective, and an automorphism.
  - example: x_y_to_x_0_as_a_linear_map_reals_squared_to_reals
    why: >-
      The projection $(x, y) \mapsto (x, 0)$ is a linear map from $\reals^2$ to itself, so it is an endomorphism.
      It is not injective, because $(0, 1)$ maps to $(0, 0)$, and not surjective, because $(0, 1)$ is not an output, so it is not bijective or an automorphism.
  - example: differentiation_p_to_p_prime_as_a_linear_map_from
    why: >-
      Differentiation is a linear map from the polynomials to themselves, so it is an endomorphism.
      It is surjective, because every polynomial has an antiderivative, but it is not injective, because every constant maps to $0$, so it is not bijective or an automorphism.
see_also:
  - domain_vs_codomain_vs_image
  - types_of_sameness
---
## Notes

- Whether a function is surjective depends on its codomain, not just its rule.
- For groups and vector spaces, every bijective homomorphism is an isomorphism.
  For topological spaces, this fails: $t \mapsto (\cos t, \sin t)$ is a continuous bijection from $[0, 2\pi)$ onto the unit circle, but its inverse is not continuous, so it is not a homeomorphism.
