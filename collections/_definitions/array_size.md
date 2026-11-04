---
published: false
title: Number of elements of an array
term: number of elements
applies_to: arrays
synonyms: [size (in NumPy), numel (in MATLAB)]
levels:
  elementary:
    text: |-
      Think of an [array](/definitions/array), like eggs arranged in rows and columns.
      The _number of elements_ of the array is how many entries it has.
  undergraduate:
    context: programming
    text: |-
      Consider an [array](/definitions/array) with a given [shape](/definitions/array-shape).
      The _number of elements_ of the array is its total number of entries, which is the product of the lengths in the shape.
      A $3 \times 4$ array has $12$ elements.
---
"Size" is ambiguous: in NumPy, `size` is the number of elements, but in MATLAB, `size` returns the [shape](/definitions/array-shape).
