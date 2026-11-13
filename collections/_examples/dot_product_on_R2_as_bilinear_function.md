---
published: false
title: 'The dot product $(u, v) \mapsto u \cdot v = u_1 v_1 + u_2 v_2$ on $\reals^2$'
level: undergraduate
is: [tensor]
is_not: [
  array,
  differential_form,
  lie_bracket
]
why:
  tensor: >-
    The dot product on $\reals^2$ is a tensor of type $(0, 2)$, because it is a function of two vectors that is linear in each vector when the other is fixed.
  array: >-
    The dot product on $\reals^2$ is not an array, because it is a function of two vectors.
    Its components in the standard basis form the array $$\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$, but in another basis its components form a different array.
  differential_form: >-
    The dot product on $\reals^2$ is not a $2$-form, because it is symmetric instead of alternating: swapping $u$ and $v$ does not change the sign of $u \cdot v$.
  lie_bracket: >-
    The dot product on $\reals^2$ is not a Lie bracket, because its values are numbers instead of vectors in $\reals^2$, and because it is symmetric instead of antisymmetric.
---
