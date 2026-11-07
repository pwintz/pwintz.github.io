---
published: false
title: Jordan normal form
term: Jordan normal form
applies_to: square matrices
synonyms: [Jordan canonical form, Jordan decomposition]
levels:
  undergraduate:
    context: complex matrices
    text: |-
      A _Jordan block_ is a square matrix with a number $\lambda$ on its diagonal, $1$ on the diagonal just above it, and $0$ elsewhere, such as

      $$\begin{bmatrix} \lambda & 1 & 0 \\ 0 & \lambda & 1 \\ 0 & 0 & \lambda \end{bmatrix}.$$

      Consider a square complex [matrix](/definitions/matrix) $A$.
      A _Jordan normal form_ of $A$ is a factorization $A = P J P^{-1}$, where $P$ is invertible and $J$ is block diagonal with Jordan blocks on its diagonal.
properties:
  - |-
    Every square complex matrix $A$ has a Jordan normal form, and $J$ is unique up to the order of the blocks.
    The numbers $\lambda$ in the blocks are the [eigenvalues](/definitions/eigenvalue) of $A$.
  - |-
    The matrix $A$ is diagonalizable exactly when every Jordan block in $J$ is $1 \times 1$, and then the Jordan normal form is an [eigendecomposition](/definitions/eigendecomposition).
  - |-
    Splitting $J$ into its diagonal and the $1$s above the diagonal gives the [Jordan–Chevalley decomposition](/definitions/jordan-chevalley-decomposition) of $A$.
  - |-
    The Jordan normal form is not continuous in $A$: an arbitrarily small change in $A$ can change the sizes of the blocks.
    For this reason, it is not computed numerically; the [Schur decomposition](/definitions/schur-decomposition) is used instead.
---
Strictly, the _Jordan normal form_ is the matrix $J$; the factorization $A = P J P^{-1}$ is sometimes called the _Jordan decomposition_.
That name is also used for the [Jordan–Chevalley decomposition](/definitions/jordan-chevalley-decomposition), so this page avoids it.
