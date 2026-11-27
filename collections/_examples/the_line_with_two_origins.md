---
title: 'The line with two origins'
detail: >-
  Take two copies of the real line and glue them together at every point except $0$, so that each nonzero point $x$ of one copy is identified with the point $x$ of the other.
  The result looks like $\reals$, except that it has two origins, $0_1$ and $0_2$: every neighborhood of $0_1$ and every neighborhood of $0_2$ contain the same small nonzero numbers.
level: graduate
is: [T1_space]
is_not: [
  hausdorff_space,
  normal_space,
  metrizable
]
why:
  metrizable: >-
    The line with two origins is not metrizable, because it is not Hausdorff, and every metric space is Hausdorff.
  T1_space: >-
    The line with two origins is T₁, because each point is closed.
  hausdorff_space: >-
    The line with two origins is not Hausdorff, because the two origins cannot be separated by disjoint open sets. This is why manifolds are required to be Hausdorff.
  normal_space: >-
    The line with two origins is not normal, because the two origins are disjoint closed sets that cannot be separated by disjoint open sets.
---
