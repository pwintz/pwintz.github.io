---
published: false
title: Zero vs. empty set vs. zero vector vs. identity element vs. root
kind: family
areas: [language, sets]
status: draft
summary: >
  Many different objects play the role of "nothing." Each belongs to a different kind of structure,
  and a "zero" of a function is not zero at all: it is an input where the function is zero.
terms:
  - zero_number
  - empty_set
  - zero_vector
  - identity_element
  - root_of_function
examples:
  - example: zero
    why: >-
      It is the identity element for addition of numbers.
  - example: empty_set
    why: >-
      It is the identity element for union, since $A \cup \emptyset = A$.
  - example: set_containing_empty_set
    why: >-
      It has one element, namely $\emptyset$.
  - example: 0_0_in_reals_squared
    why: >-
      It is a vector, not a number.
  - example: one
    why: >-
      It is the identity element for multiplication.
  - example: 2_for_f_x_eq_x_squared_minus_4
    why: >-
      "$2$ is a zero of $f$" means $f(2) = 0$.
see_also:
  - types_of_sparsity
  - types_of_everything
---
## Other kinds of nothing

- **Vacuous truth.** "Every element of $\emptyset$ is purple" is true, because there is no element to check.
- **"Does not exist" vs. "is zero."** $\lim_{x \to 0} \sin(1/x)$ does not exist, while $\lim_{x \to 0} x \sin(1/x) = 0$. A limit that does not exist is not zero.
- **Measure zero and nowhere dense** describe sets that are small but not empty. See [types of sparsity](/distinctions/types-of-sparsity).
