---
title: Coordinate vector
term: coordinate vector
applies_to: vectors and bases
synonyms: [coordinates, components]
levels:
  high-school:
    text: |-
      Consider a set of [basis](/dictionary/definitions/vector-basis) directions, such as "east" and "north."
      The _coordinate vector_ of a vector [vector](/dictionary/definitions/vector) $v$ is the list of numbers saying how much of each basis direction is needed to equal $v$.
  undergraduate:
    text: |-
      Consider a [vector](/dictionary/definitions/vector) space $V$ with a [basis](/dictionary/definitions/vector-basis) $B = (b_1, \dots, b_n)$, and a vector $v$ in $V$, written as $v = c_1 b_1 + \dots + c_n b_n$.
      The _coordinate vector_ of $v$ is 
      
      $$[v]_B = (c_1, c_2, \dots, c_n) \in \reals^n.$$
properties:
  - >-
    The coordinate vector depends on the [basis](/dictionary/definitions/vector-basis); the [vector](/dictionary/definitions/vector) does not.
  - >-
    If the columns of $P$ are the new [basis](/dictionary/definitions/vector-basis) [vectors](/dictionary/definitions/vector) written in the old basis, then the new coordinates of $v$ are $P^{-1}$ times its old coordinates.
---
