---
title: Infinity norm
term: infinity norm
applies_to: vectors in $\reals^n$
synonyms: ['$\norm{x}_{\infty}$', max norm, maximum norm, supremum norm, Chebyshev norm, '$\ell^{\infty}$ norm']
levels:
  high-school:
    text: |-
      Consider a [vector](/dictionary/definitions/vector) $x = (x_1, \dots, x_n)$.
      The _infinity norm_ of $x$ is the largest absolute value of its entries:

      $$\norm{x}_{\infty} = \max_i \abs{x_i}.$$
properties:
  - >-
    The infinity norm is the limit of the $p$-norms $\norm{x}_p = (\abs{x_1}^p + \dots + \abs{x_n}^p)^{1/p}$ as $p \to \infty$, which explains its name.
  - >-
    For functions on an interval, the analogous [norm](/dictionary/definitions/norm) is the _sup norm_ $\sup_t \abs{f(t)}$, which measures the largest deviation of $f$ from $0$.
---
