---
published: false
title: Element of vs. subset vs. proper subset
kind: siblings
areas: [sets]
status: draft
summary: >
  An element is one of the things in a set.
  A subset is a set whose elements all belong to another set.
  In mathematics, "in" means "element of," not "located inside of."
terms:
  - element_of
  - subset
  - proper_subset
examples_note: >-
  Each row is a pair.
  Is the first object a(n) ___ the second?
examples:
  - example: 1_and_set_1_2
    why: >-
      $1$ is an element of $\lbrace 1, 2 \rbrace$ because it is listed in the set.
      It is not a subset, because it is not a set of elements of $\lbrace 1, 2 \rbrace$.
  - example: set_1_and_set_1_2
    why: >-
      $\lbrace 1 \rbrace$ is a proper subset, and so a subset, of $\lbrace 1, 2 \rbrace$, because its only element, $1$, is in $\lbrace 1, 2 \rbrace$, and $2$ is not in $\lbrace 1 \rbrace$.
      It is not an element of $\lbrace 1, 2 \rbrace$, because the elements of $\lbrace 1, 2 \rbrace$ are $1$ and $2$.
  - example: set_1_and_set_set_1_2
    why: >-
      $\lbrace 1 \rbrace$ is an element of $\lbrace \lbrace 1 \rbrace, 2 \rbrace$ because it is listed in the set.
      It is not a subset, because its element $1$ is not an element of $\lbrace \lbrace 1 \rbrace, 2 \rbrace$.
  - example: set_1_2_and_set_1_2
    why: >-
      $\lbrace 1, 2 \rbrace$ is a subset of itself, as is every set.
      It is not a proper subset of itself, and it is not an element of itself.
  - example: empty_set_and_set_1_2
    why: >-
      $\emptyset$ is a proper subset, and so a subset, of $\lbrace 1, 2 \rbrace$, because the empty set is a subset of every set and $\emptyset \neq \lbrace 1, 2 \rbrace$.
      It is not an element of $\lbrace 1, 2 \rbrace$, because $\emptyset$ is an element only of sets that list it.
  - example: the_center_c_of_a_sphere_and_the_sphere
    why: >-
      The center $c$ is not an element of the sphere (unless $r = 0$), because the sphere contains only the points at distance $r$ from $c$.
      The center is "inside" the sphere only geometrically.
see_also:
  - types_of_sphere_balls_and_circles
  - types_of_collections
---
## "In" is not "inside"

In everyday speech, we say that water is "in" a bottle.
In mathematics, "$x$ is in $A$" means $x \in A$, which is independent of geometry.
For example, the center of a sphere is not in the sphere, but it is in the ball that the sphere surrounds.

Similarly, a polygon _inscribed_ in a circle has its vertices on the circle, so the vertices are elements of the circle, but the rest of the polygon is not.
