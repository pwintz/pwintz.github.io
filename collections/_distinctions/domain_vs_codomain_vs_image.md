---
published: false
title: Domain vs. image vs. codomain vs. preimage
kind: siblings
areas: [sets]
status: draft
summary: >
  A function comes with several sets that describe its inputs and outputs.
  The domain is where inputs come from, and the codomain is where outputs are allowed to land.
  The image is the set of outputs that actually occur, and a preimage is the set of inputs that land in a given set.
terms:
  - domain
  - image
  - codomain
  - preimage
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: square_on_reals
    why: >-
      The domain and codomain of $f$ are both $\reals$.
      Squares of real numbers are exactly the nonnegative numbers, so the image is $[0, \infty)$, which is smaller than the codomain.
      The preimage of $\lbrace 4 \rbrace$ is $\lbrace -2, 2 \rbrace$, even though $f$ has no inverse.
  - example: square_onto_nonnegatives
    why: >-
      This is the same rule as $x \mapsto x^2$ on $\reals$, but with the smaller codomain $[0, \infty)$.
      Now the image equals the codomain, so $f$ is surjective.
see_also:
  - meanings_of_range
  - function_vs_graph
  - type_of_function_correspondence
---
## Notes

- The notation $f^{-1}(B)$ for a preimage does not mean $f$ has an inverse.
- "Range" is not listed here because it has conflicting meanings: usually the image, but sometimes the codomain.
  See [the meanings of "range"](/distinctions/meanings-of-range).
