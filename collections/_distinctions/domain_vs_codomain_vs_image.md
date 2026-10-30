---
published: false
title: Domain vs. image vs. codomain vs. preimage
kind: siblings
areas: [sets]
status: draft
summary: >
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
      Squares of real numbers are exactly the nonnegative numbers, so the image is smaller than the codomain. The preimage of $\lbrace 4 \rbrace$ exists even though $f$ has no inverse.
  - example: square_onto_nonnegatives
    why: >-
      The same rule with a smaller codomain. Now the image equals the codomain, so $f$ is surjective.
see_also:
  - meanings_of_range
  - function_vs_graph
  - type_of_function_correspondence
---
## Notes

- The notation $f^{-1}(B)$ for a preimage does not mean $f$ has an inverse.
- "Range" is not listed here because it has conflicting meanings: usually the image, but sometimes the codomain. See [the meanings of "range"](/distinctions/meanings-of-range).
