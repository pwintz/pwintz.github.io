---
title: Group vs. ring vs. field
kind: hierarchy
areas: [algebra]
summary: >
  Groups, rings, and fields are sets with operations that obey some of the rules of arithmetic.
  A [group](/dictionary/definitions/group) has one operation, which is [associative](/dictionary/definitions/associative), has an [identity element](/dictionary/definitions/identity-element), and can be undone.
  A [ring](/dictionary/definitions/ring) has an addition and a multiplication; its addition forms a [commutative](/dictionary/definitions/commutative) group, but its elements need not have multiplicative inverses.
  A [field](/dictionary/definitions/field) is a commutative ring in which every nonzero element has a multiplicative inverse, so division by nonzero elements is possible.
relation: field ⊂ ring ⊂ commutative group (under addition)
terms:
  - group
  - ring
  - field
examples:
  - example: nonzero_reals_with_multiplication
  - example: integers_with_addition_and_multiplication
  - example: rationals_with_addition_and_multiplication
  - example: real_2_by_2_matrices
  - example: integers_mod_6
  - example: integers_mod_5
    why: >-
      The integers modulo $5$ form a field, but the integers modulo $6$ do not, because $5$ is prime and $6$ is not.
see_also:
  - associative_vs_commutative
  - vector_space_module_vs_algebra
---
## Notes

- A [ring](/dictionary/definitions/ring) is a group under addition, but a ring is usually not a group under multiplication, because $0$ has no multiplicative inverse.
- The **nonzero** elements of a field are a group under multiplication.
- Some authors do not require a ring to have a multiplicative identity $1$.
