---
title: 'The $2 \times 2$ real matrices, with matrix addition, multiplication by real numbers, and matrix multiplication'
level: undergraduate
is: [
  group,
  ring,
  vector_space,
  module,
  algebra_over_a_field
]
is_not: [field]
why:
  # TODO: Saying it is a group may be confusing, because it is not a group under multiplication. Maybe split?
  group: >-
    The $2 \times 2$ real matrices form a group under matrix addition, because the zero matrix is an identity and $-A$ is the inverse of $A$.
  ring: >-
    The $2 \times 2$ real matrices form a ring, because matrix multiplication is associative, has the identity matrix $I$ as its identity, and distributes over addition.
  field: >-
    The $2 \times 2$ real matrices do not form a field, because matrix multiplication is not commutative, and nonzero singular matrices, such as $$\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}$$, have no inverse.
  vector_space: >-
    The $2 \times 2$ real matrices form a real vector space of dimension $4$, with entrywise addition and scalar multiplication by real numbers.
  module: >-
    The $2 \times 2$ real matrices form a module over $\reals$, because they form a vector space over $\reals$.
  algebra_over_a_field: >-
    The $2 \times 2$ real matrices form an algebra over $\reals$, because matrix multiplication is bilinear: $(a A) B = a (A B) = A (a B)$, and matrix multiplication distributes over addition.
---
