---
published: false
title: Types of collections
kind: siblings
areas: [sets]
status: draft
summary: >
  A set ignores order and repetition.
  A multiset keeps repetition.
  A sequence keeps order and repetition.
  "Collection" is informal, and "group" is a technical term for a set with an operation.
terms:
  - collection
  - set
  - sequence
  - multiset
  - group
  - indexed_family
examples:
  - example: set_1_2_2
    why: >-
      $\lbrace 1, 2, 2 \rbrace$ is a collection, and as a set it equals $\lbrace 1, 2 \rbrace$, with two elements.
      As a multiset, it has three elements, with $2$ counted twice.
  - example: tuple_1_2_2
    why: >-
      $(1, 2, 2)$ is a sequence of length three, and so an indexed family, which is different from $(2, 1, 2)$ and from $(1, 2)$.
      It is not a set or a multiset, because its order matters.
  - example: the_roots_of_x_minus_1_squared_counted_with
    why: >-
      The roots of $(x - 1)^2$ counted with multiplicity form a multiset, in which the root $1$ appears twice.
      They do not form a set, which cannot count an element twice.
  - example: integers_with_addition
    why: >-
      $\mathbb{Z}$ with addition is a group because addition is associative, $0$ is the identity, and $-n$ is the inverse of $n$.
  - example: naturals_with_addition
    why: >-
      $\mathbb{N}$ with addition is not a group, because no positive integer has an additive inverse in $\mathbb{N}$.
  - example: the_class_of_all_sets
    why: >-
      The class of all sets is a collection.
      It is not a set, because treating it as one leads to Russell's paradox.
see_also:
  - types_of_inside
  - disjoint_unions
---
