---
published: false
title: 'The linear map $T(x) = A x$ on $\reals^n$ with the weighted inner product $\ip{x}{y} = x^{\top} W y$, for a real $n \times n$ matrix $A$ and a symmetric positive definite matrix $W$'
level: undergraduate
values:
  adjoint: '$T^{\ast}(y) = W^{-1} A^{\top} W y$'
why:
  adjoint: |-
    The adjoint of the linear map $T(x) = A x$ with the weighted inner product $\ip{x}{y} = x^{\top} W y$ is $T^{\ast}(y) = W^{-1} A^{\top} W y$, because, for all $x$ and $y$,

    $$\ip{T x}{y} = x^{\top} A^{\top} W y = x^{\top} W \left(W^{-1} A^{\top} W y\right) = \ip{x}{W^{-1} A^{\top} W y}.$$

    So the matrix of $T^{\ast}$ is $W^{-1} A^{\top} W$, which is the transpose $A^{\top}$ only when $W A^{\top} = A^{\top} W$, such as when $W = I$ and the inner product is the dot product.
---
