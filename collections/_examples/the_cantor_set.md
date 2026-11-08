---
title: 'The Cantor set'
level: undergraduate
values:
  diameter: '$1$'
  cardinality: '$\mathfrak{c}$'
  lebesgue_measure: '$0$'
  hausdorff_dimension: '$\log 2 / \log 3 \approx 0.63$'
is: [closed_set, nowhere_dense, measure_zero, uncountable, meager_set]
is_not: [open_set, countable, finite_set]
why:
  uncountable: >-
    Even though its total length is $0$, its points correspond to the infinite sequences of $0$s and $2$s in base $3$, which are uncountable.
  diameter: >-
    The diameter of the Cantor set is $1$, because it contains $0$ and $1$.
  cardinality: >-
    The cardinality of the Cantor set is $\mathfrak{c}$, because its points correspond to the infinite sequences of $0$s and $2$s (their base-$3$ digits).
  lebesgue_measure: >-
    The Lebesgue measure of the Cantor set is $0$, because its construction removes intervals of total length $\frac{1}{3} + \frac{2}{9} + \frac{4}{27} + \dots = 1$ from $[0, 1]$.
  hausdorff_dimension: >-
    The Hausdorff dimension of the Cantor set is $\log 2 / \log 3$, because it consists of $2$ copies of itself, each scaled down by a factor of $3$, so $2 = 3^d$.
  countable: >-
    The Cantor set is not countable, because it is uncountable.
  closed_set: >-
    The Cantor set is closed, because it is the intersection of the sets $C_0 = [0, 1]$, $C_1 = [0, \frac{1}{3}] \cup [\frac{2}{3}, 1]$, $C_2$, $\dots$ that remain after each step of the construction. Each $C_n$ is a union of finitely many closed intervals, so each $C_n$ is closed, and every intersection of closed sets is closed.
  open_set: >-
    The Cantor set is not open, because it contains no interval of positive length, so no point of the Cantor set (such as $0$) has a small interval around it inside the Cantor set.
  nowhere_dense: >-
    The Cantor set is nowhere dense, because the interior of its closure is empty. The Cantor set is closed, so its closure is the Cantor set itself. After $n$ steps of the construction, what remains is a union of intervals of length $3^{-n}$, so the Cantor set contains no interval of positive length, and therefore no open set: its interior is empty.
  finite_set: >-
    The Cantor set is not finite, because it is uncountable.
  meager_set: >-
    The Cantor set is meager, because it is nowhere dense, and every nowhere dense set is meager.
---
