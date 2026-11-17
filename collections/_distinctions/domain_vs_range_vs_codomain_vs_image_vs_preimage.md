---
published: false
title: Domain vs. Range vs. Codomain vs. Image vs. Preimage
kind: siblings
areas: [sets]
summary: >
  A function comes with several sets that describe its inputs and outputs.
  The domain is where inputs come from, and the [codomain](/dictionary/definitions/codomain) is where outputs are allowed to land.
  The [range](/dictionary/definitions/range-image) is the set of outputs that actually occur.
  For a set $A$ of inputs, the [image](/dictionary/definitions/image) $f(A)$ is the set of outputs for inputs in $A$, so the range is the image of the whole domain.
  For a set $B$ of outputs, the [preimage](/dictionary/definitions/preimage) $f^{-1}(B)$ is the set of inputs that land in $B$.
terms:
  - domain
  - range_image
  - codomain
  - image
  - preimage
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: x_sq_on_reals
    why: >-
      The domain and codomain of $f$ are both $\reals$.
      Squares of real numbers are exactly the nonnegative numbers, so the range is $[0, \infty)$, which is smaller than the codomain.
      The image of $[-1, 2]$ is $[0, 4]$, which is smaller than the range.
      The preimage of $\setdef{4}$ is $\setdef{-2, 2}$, even though $f$ has no inverse.
  - example: square_onto_nonnegatives
    why: >-
      This is the same rule as $x \mapsto x^2$ on $\reals$, but with the smaller codomain $[0, \infty)$, which equals the range.
see_also:
  - meanings_of_range
  - function_vs_graph
  - type_of_function_correspondence
---
## Notes

- The notation $f^{-1}(B)$ for a [preimage](/dictionary/definitions/preimage) does not mean $f$ has an inverse.
- Some texts use "range" for the [codomain](/dictionary/definitions/codomain) instead.
  See [the meanings of "range"](/dictionary/distinctions/meanings-of-range).
