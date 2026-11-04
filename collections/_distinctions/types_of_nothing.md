---
published: false
title: Zero vs. empty set vs. zero vector vs. identity element vs. root
kind: family
areas: [language, sets]
status: draft
summary: >
  Many different objects play the role of "nothing."
  Each belongs to a different kind of structure, and a "zero" of a function is not zero at all: it is an input where the function is zero.
terms:
  - zero_number
  - empty_set
  - zero_vector
  - identity_element
  - root_of_function
examples:
  - example: zero_for_addition
    why: >-
      $0$ is the zero number, and it is the identity element for addition of numbers, because adding $0$ changes nothing.
      It is not the empty set or the zero vector, because it is a number.
  - example: empty_set_for_union
    why: >-
      $\emptyset$ is the empty set, and it is the identity element for union, because $A \cup \emptyset = A$.
      It is not the number zero, because it is a set.
  - example: set_containing_empty_set
    why: >-
      $\lbrace \emptyset \rbrace$ is not the empty set, because it has one element, namely $\emptyset$.
  - example: 0_0_in_reals_squared
    why: >-
      $(0, 0)$ is the zero vector of $\reals^2$, and it is the identity element for vector addition, because adding it changes nothing.
      It is not the number zero, because it is a vector.
  - example: one_for_multiplication
    why: >-
      $1$ is the identity element for multiplication of numbers, because multiplying by $1$ changes nothing.
      It is not the number zero.
  - example: 2_for_f_x_eq_x_squared_minus_4
    why: >-
      $2$ is a root (or "zero") of $f$, because $f(2) = 0$.
      It is not the number zero.
see_also:
  - types_of_sparsity
  - types_of_everything
---
## Other kinds of nothing

- **Vacuous truth.** "Every element of $\emptyset$ is purple" is true, because there is no element to check.
- **"Does not exist" vs. "is zero."** $\lim_{x \to 0} \sin(1/x)$ does not exist, while $\lim_{x \to 0} x \sin(1/x) = 0$.
  A limit that does not exist is not zero.
- **Measure zero and nowhere dense** describe sets that are small but not empty.
  See [types of sparsity](/distinctions/types-of-sparsity).
