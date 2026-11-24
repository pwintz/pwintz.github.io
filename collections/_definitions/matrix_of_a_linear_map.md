---
title: Matrix of a Linear Map
term: matrix of a linear map
applies_to: linear maps between finite-dimensional vector spaces
synonyms: [matrix representation]
levels:
  undergraduate:
    text: |-
      Consider a [vector space](/dictionary/definitions/vector-space) $V$ with a [basis](/dictionary/definitions/vector-basis) $\mathcal{V} = \setdef{v_1, \dots, v_n}$, a vector space $W$ with a basis $\mathcal{W} = \setdef{w_1, \dots, w_m}$, and a [linear map](/dictionary/definitions/linear-map) $T : V \to W$.
      The _matrix of $T$ relative to $\mathcal{V}$ and $\mathcal{W}$_ is the $m \times n$ [matrix](/dictionary/definitions/matrix) whose $j$th column is the [coordinate vector](/dictionary/definitions/coordinate-vector) of $T(v_j)$ relative to $\mathcal{W}$:

      $$A = \begin{bmatrix} [T(v_1)]_{\mathcal{W}} & [T(v_2)]_{\mathcal{W}} & \cdots & [T(v_n)]_{\mathcal{W}} \end{bmatrix}.$$
properties:
  - |-
    The matrix $A$ of $T$ relative to $\mathcal{V}$ and $\mathcal{W}$ transforms coordinates: for every $x$ in $V$, $[T(x)]_{\mathcal{W}} = A [x]_{\mathcal{V}}$.
  - |-
    The matrix of $T$ depends on the bases $\mathcal{V}$ and $\mathcal{W}$; the [linear map](/dictionary/definitions/linear-map) $T$ does not.
  - |-
    If $V = \reals^n$ and $W = \reals^m$ with their standard bases, then the matrix of $T$ is the matrix $A$ such that $T(x) = A x$ for every $x$ in $\reals^n$.
---
