---
published: false
title: 'A PyTorch tensor created by `torch.zeros(2, 3)`'
level: undergraduate
is: [array]
is_not: [tensor]
why:
  array: >-
    The PyTorch tensor created by `torch.zeros(2, 3)` is an array of numbers with $2$ rows and $3$ columns.
  tensor: >-
    The PyTorch tensor created by `torch.zeros(2, 3)` is not a tensor in the mathematical sense, because it is a grid of numbers with no vector space and no rule for how the numbers change when the basis changes.
    PyTorch uses "tensor" to mean a multidimensional array.
---
