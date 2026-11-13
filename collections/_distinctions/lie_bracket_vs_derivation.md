---
published: false
title: Lie bracket vs. derivation
kind: siblings
areas: [geometry, algebra, control]
summary: >
  Lie brackets and derivations come up together in differential geometry and nonlinear control, where [vector fields](/dictionary/definitions/vector-field) act on functions by differentiating them.
  A [derivation](/dictionary/definitions/derivation) is a [linear map](/dictionary/definitions/linear-map) that satisfies the product rule, $D(a b) = (D a) b + a (D b)$, such as a vector field acting on smooth functions.
  A [Lie bracket](/dictionary/definitions/lie-bracket) combines two elements into a third, such as two vector fields $X$ and $Y$ into the vector field $[X, Y] = X Y - Y X$.
  In general, the [composition](/dictionary/definitions/function-composition) $X Y$ of two vector fields is not a derivation, because $X Y$ takes second derivatives.
  The second derivatives cancel in $X Y - Y X$, so the Lie bracket $[X, Y]$ of two vector fields is again a vector field, and so a derivation.
  The bracket operation itself is not a derivation, but bracketing with a fixed $X$, the map $Y \mapsto [X, Y]$, is one.
terms:
  - lie_bracket
  - derivation
examples:
  - example: lie_bracket_of_1_0_and_0_x1
  - example: matrix_commutator
  - example: cross_product_on_R3
  - example: dot_product_on_R2_as_bilinear_function
  - example: derivative_on_polynomials
  - example: second_derivative_on_polynomials
  - example: composition_of_partial_derivatives
  - example: commutator_with_a_fixed_matrix
    why: >-
      For a fixed matrix $A$, the map $Y \mapsto A Y - Y A$ is the Lie bracket with $A$, and this map is a derivation; the Jacobi identity says that taking the Lie bracket with a fixed element is a derivation of the Lie bracket itself.
see_also:
  - types_of_derivatives
---
## Notes

- The [Lie derivative](/dictionary/definitions/lie-derivative) $L_X h$ of a function $h$ along a vector field $X$ is $X$ acting on $h$ as a [derivation](/dictionary/definitions/derivation), and the Lie derivative of a vector field $Y$ along $X$ is the [Lie bracket](/dictionary/definitions/lie-bracket) $[X, Y]$.
- Sign conventions for the Lie bracket of [vector fields](/dictionary/definitions/vector-field) differ between texts.
