---
title: Associative vs. commutative
kind: siblings
areas: [algebra]
summary: >
  Consider a [binary operation](/dictionary/definitions/binary-operation), such as addition, that combines two inputs, such as two numbers, into one result.
  Associativity and commutativity both involve changing an order, but they change the order of different things.
  An [associative](/dictionary/definitions/associative) operation gives the same result when the order in which the _operations_ are performed changes, while the inputs stay in place, as in $(a \ast b) \ast c = a \ast (b \ast c)$: on the left, $a \ast b$ is computed first; on the right, $b \ast c$ is computed first.
  A [commutative](/dictionary/definitions/commutative) operation gives the same result when the order of the _inputs_ changes, as in $a \ast b = b \ast a$: $a$ and $b$ trade places.
  An operation can have either property without the other.
terms:
  - associative
  - commutative
examples:
  - example: addition_on_reals
  - example: multiplication_on_reals
  - example: matrix_multiplication_2_by_2
    why: >-
      Multiplication of $2 \times 2$ matrices shows that an associative operation need not be commutative.
  - example: average_of_two_numbers
    why: >-
      The average of two numbers shows that a commutative operation need not be associative.
  - example: subtraction_on_reals
---
## Notes

- A quick test: in the equation for associativity, $(a \ast b) \ast c = a \ast (b \ast c)$, the letters appear in the same order $a, b, c$ on both sides, and only the parentheses move.
  In the equation for commutativity, $a \ast b = b \ast a$, there are no parentheses, and the letters trade places.

- If an operation is both [associative](/dictionary/definitions/associative) and [commutative](/dictionary/definitions/commutative), then the elements of a finite list can be combined in every grouping and every order with the same result, which is why sums such as $\sum_{i=1}^{n} a_i$ need no parentheses.
