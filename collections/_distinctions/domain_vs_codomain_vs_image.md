---
published: false
title: Domain vs. image vs. codomain vs. preimage
kind: siblings
areas: [sets]
summary: >
  A function comes with several sets that describe its inputs and outputs.
  The domain is where inputs come from, and the [codomain](/definitions/codomain) is where outputs are allowed to land.
  The image is the set of outputs that actually occur, and a [preimage](/definitions/preimage) is the set of inputs that land in a given set.
terms:
  - domain
  - image
  - codomain
  - preimage
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: x_sq_on_reals
    why: >-
      The domain and codomain of $f$ are both $\reals$.
      Squares of real numbers are exactly the nonnegative numbers, so the image is $[0, \infty)$, which is smaller than the codomain.
      The preimage of $\setdef{4}$ is $\setdef{-2, 2}$, even though $f$ has no inverse.
  - example: square_onto_nonnegatives
    why: >-
      This is the same rule as $x \mapsto x^2$ on $\reals$, but with the smaller codomain $[0, \infty)$.
see_also:
  - meanings_of_range
  - function_vs_graph
  - type_of_function_correspondence
---
## Notes

- The notation $f^{-1}(B)$ for a [preimage](/definitions/preimage) does not mean $f$ has an inverse.
- "Range" is not listed here because it has conflicting meanings: usually the image, but sometimes the [codomain](/definitions/codomain).
  See [the meanings of "range"](/distinctions/meanings-of-range).
