---
published: false
title: Tensor
term: tensor
applies_to: vector spaces
levels:
  undergraduate:
    context: linear algebra
    text: |-
      A _tensor_ of type $(r, s)$ on a finite-dimensional real [vector space](/dictionary/definitions/vector-space) $V$ is a function

      $$T : \underbrace{V^{\ast} \times \cdots \times V^{\ast}}_{r \text{ copies}} \times \underbrace{V \times \cdots \times V}_{s \text{ copies}} \to \reals$$

      that is linear in each argument when the other arguments are fixed (multilinear), where $V^{\ast}$ is the space of [covectors](/dictionary/definitions/covector) on $V$.
  graduate:
    context: multilinear algebra
    text: |-
      A _tensor_ of type $(r, s)$ on a [vector space](/dictionary/definitions/vector-space) $V$ is an element of the tensor product

      $$V^{\otimes r} \otimes (V^{\ast})^{\otimes s} = \underbrace{V \otimes \cdots \otimes V}_{r \text{ copies}} \otimes \underbrace{V^{\ast} \otimes \cdots \otimes V^{\ast}}_{s \text{ copies}}.$$

      For finite-dimensional $V$, these elements correspond exactly to the multilinear functions in the undergraduate definition.
properties:
  - >-
    Relative to a [basis](/dictionary/definitions/vector-basis) $e_1, \dots, e_n$ of $V$ and its dual basis $\varepsilon^1, \dots, \varepsilon^n$, a tensor $T$ of type $(r, s)$ has the $n^{r + s}$ components $T^{i_1 \cdots i_r}_{j_1 \cdots j_s} = T(\varepsilon^{i_1}, \dots, \varepsilon^{i_r}, e_{j_1}, \dots, e_{j_s})$, which form an [array](/dictionary/definitions/array) with $r + s$ axes.
  - >-
    When the [basis](/dictionary/definitions/vector-basis) changes, the components of a tensor change by a fixed rule: the upper indices change like the coordinates of a [vector](/dictionary/definitions/vector), and the lower indices change like the coordinates of a [covector](/dictionary/definitions/covector).
  - >-
    A vector is a tensor of type $(1, 0)$, a [covector](/dictionary/definitions/covector) is a tensor of type $(0, 1)$, an [inner product](/dictionary/definitions/inner-product) is a tensor of type $(0, 2)$, and a [linear map](/dictionary/definitions/linear-map) $V \to V$ corresponds to a tensor of type $(1, 1)$.
---
In physics, "tensor" usually means a _tensor field_, which assigns a tensor to each point of space, such as the stress tensor of a material.

In machine learning libraries, such as PyTorch and TensorFlow, a "tensor" is a multidimensional [array](/dictionary/definitions/array), with no [vector space](/dictionary/definitions/vector-space) and no rule for changing bases.

The "rank" of a tensor can mean its number of indices, $r + s$, or the smallest number of products $v_1 \otimes \dots \otimes v_{r + s}$ that add up to the tensor; see [the meanings of "rank"](/dictionary/distinctions/meanings-of-rank).
