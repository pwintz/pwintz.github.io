---
title: 'The closed unit ball of $\ell^2$'
detail: |-
  The space $\ell^2$ is the space of real sequences $x = (x_1, x_2, x_3, \dots)$ whose squares have a finite sum, with the norm

  $$\norm{x} = \sqrt{x_1^2 + x_2^2 + x_3^2 + \cdots}.$$

  The closed unit ball of $\ell^2$ is the set

  $$B = \setdef{x \in \ell^2 : \norm{x} \leq 1},$$

  with the metric $d(x, y) = \norm{x - y}$.
  The standard basis vectors $e_1 = (1, 0, 0, \dots)$, $e_2 = (0, 1, 0, \dots)$, and so on, lie in $B$, and every two different standard basis vectors are a distance $\sqrt{2}$ apart.
level: graduate
is: [paracompact]
is_not: [
  compact,
  sequentially_compact,
  locally_compact
]
why:
  paracompact: >-
    The closed unit ball of $\ell^2$ is paracompact because it is a metric space.
  compact: >-
    The closed unit ball of $\ell^2$ is not compact, even though it is closed and bounded, because the standard basis vectors have no convergent subsequence.
  sequentially_compact: >-
    The closed unit ball of $\ell^2$ is not sequentially compact, because the standard basis vectors have no convergent subsequence.
  locally_compact: >-
    The closed unit ball of $\ell^2$ is not locally compact, because no ball in an infinite-dimensional normed space is compact.
---
