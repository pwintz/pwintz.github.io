---
published: false
title: Number of axes of an array
term: number of axes
applies_to: arrays
synonyms: [rank (of an array or tensor), ndim, order, number of dimensions]
levels:
  high-school:
    text: |-
      Consider an [array](/definitions/array) of numbers, such as a list or a table.
      The _number of axes_ of the array is how many positions you need to locate an entry: $1$ for a list (which entry), and $2$ for a table (which row and which column).
  undergraduate:
    context: programming
    text: |-
      Consider an [array](/definitions/array), whose elements are picked out by indices.
      The _number of axes_ of the array is the number of indices needed to pick out one element.
      A list has $1$ axis and a table has $2$.
      In NumPy, this is `ndim`.
---
This is unrelated to the [rank](/definitions/matrix-rank) of a [matrix](/definitions/matrix) in linear algebra.
