---
published: false
title: Types of sameness
kind: family
areas: [sets]
status: draft
summary: >
  Mathematics has many ways to say that two objects are "the same."
  Equal objects are the same object.
  The other words describe objects that are different but "the same in some respect," and each one depends on what respect is meant.
terms:
  - equal
  - congruent
  - equivalent
  - isomorphic
  - identified
examples:
  - example: one_half_and_two_quarters
    why: >-
      $\frac{1}{2}$ and $\frac{2}{4}$ are equal, because they are the same number, written differently.
      In school, they are called "equivalent fractions," because the fractions are written differently.
      They are not identified, because identifying is for objects that are different but treated as the same.
  - example: 3_and_10
    why: >-
      $3$ and $10$ are congruent modulo $7$, and so equivalent, because they have the same remainder after division by $7$.
      They are not equal.
  - example: two_3_4_5_triangles_in_different_places
    why: >-
      The two triangles are congruent, and so equivalent, because a rotation and a translation move one onto the other.
      They are not equal, because they are different sets of points.
  - example: reals_squared_and_complexes_as_real_vector_spaces
    why: >-
      $\reals^2$ and $\mathbb{C}$ are isomorphic as real vector spaces, and so equivalent, because $(a, b) \mapsto a + b i$ is a linear bijection, and they are often identified through it.
      They are not equal, because their elements are different objects.
  - example: p_rightarrow_q_and_neg_q_rightarrow_neg_p
    why: >-
      $P \Rightarrow Q$ and its contrapositive $\neg Q \Rightarrow \neg P$ are logically equivalent, because each is true exactly when the other is.
      They are not equal, because they are different statements.
see_also:
  - equal_signs
  - type_of_function_correspondence
---
## Notes

- "Similar" is another word in this family.
  Similar triangles have the same shape but possibly different sizes, and similar matrices $A$ and $B = P^{-1} A P$ represent the same linear map in different bases.
- Equivalence, congruence, isomorphism, and similarity are all equivalence relations, so each one splits objects into classes of "same in that respect."
