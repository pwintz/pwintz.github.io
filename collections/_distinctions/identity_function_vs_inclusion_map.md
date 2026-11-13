---
published: false
title: Identity function vs. inclusion map
kind: hierarchy
areas: [sets]
summary: >
  The identity function and the inclusion map each send every element to itself, so both are written $x \mapsto x$.
  The [inclusion map](/dictionary/definitions/inclusion-map) of a [subset](/dictionary/definitions/subset) $A$ of a set $Y$ maps $A$ into $Y$.
  The [identity function](/dictionary/definitions/identity-function) on a set $X$ is the inclusion map of $X$ into itself: the special case in which the [codomain](/dictionary/definitions/codomain) is the same set as the domain.
  A function is determined by its domain and codomain as well as its formula, so $x \mapsto x$ alone does not say whether a function is an identity function or only an inclusion map.
relation: identity function ⊂ inclusion map
terms:
  - identity_function
  - inclusion_map
examples:
  - example: f_x_eq_x_on_reals
  - example: g_x_eq_x_on_0_1
    why: >-
      The function $g : [0, 1] \to [0, 1]$ defined by $g(x) = x$ is the identity function on $[0, 1]$, which is the inclusion map of $[0, 1]$ into itself.
      The function $g$ differs from the inclusion map of $[0, 1]$ into $\reals$, which has the same formula but the codomain $\reals$, and so is not an identity function.
  - example: inclusion_of_integers_into_reals
  - example: inclusion_of_circle_into_plane
see_also:
  - domain_vs_codomain_vs_image
  - function_vs_map
---
## Notes

- Many authors treat a [subset](/dictionary/definitions/subset) $A \subseteq Y$ and the [inclusion map](/dictionary/definitions/inclusion-map) $A \hookrightarrow Y$ as interchangeable, so the inclusion map is often left unwritten.
  Writing the inclusion map out matters when a construction depends on the [codomain](/dictionary/definitions/codomain), such as surjectivity or the induced map on homotopy groups.
