---
title: Binomial coefficient
term: binomial coefficient
applies_to: counting
synonyms: ['$\binom{n}{k}$', '${}_n C_k$', '$C(n, k)$']
levels:
  high-school:
    text: |-
      Consider [integers](/dictionary/definitions/integer) $n$ and $k$ such that $0 \leq k \leq n$.
      The _binomial coefficient_ $\binom{n}{k}$, read "$n$ choose $k$," is the number of [combinations](/dictionary/definitions/combination) of $k$ of $n$ objects, that is, the number of ways to choose $k$ different objects from $n$ objects when the order does not matter:

      $$\binom{n}{k} = \frac{n!}{k! \, (n - k)!}.$$
properties:
  - |-
    Each [combination](/dictionary/definitions/combination) of $k$ objects can be put in order in $k!$ ways, so the binomial coefficient is the [number of permutations](/dictionary/definitions/number-of-permutations) divided by $k!$:

    $$\binom{n}{k} = \frac{P(n, k)}{k!}.$$

  - >-
    Choosing $k$ of $n$ objects is the same as choosing the $n - k$ objects to leave out, so $\binom{n}{k} = \binom{n}{n - k}$.

  - |-
    The binomial coefficient $\binom{n}{k}$ is the coefficient of $x^k$ in $(1 + x)^n$ (the binomial theorem):

    $$(1 + x)^n = \sum_{k = 0}^{n} \binom{n}{k} x^k.$$

    The reason is that $(1 + x)^n$ is a product of $n$ factors $(1 + x)$.
    Multiplying out the product means choosing either $1$ or $x$ from each factor, and a choice gives $x^k$ when $x$ is chosen from exactly $k$ of the $n$ factors.
    So the number of terms equal to $x^k$ is the number of [combinations](/dictionary/definitions/combination) of $k$ of the $n$ factors.
    For example,

    $$\begin{align*}
    (1 + x)^3 &= \binom{3}{0} + \binom{3}{1} x + \binom{3}{2} x^2 + \binom{3}{3} x^3 \\
    &= 1 + 3 x + 3 x^2 + x^3.
    \end{align*}$$
---
The binomial coefficient $\binom{n}{k}$ is also written ${}_n C_k$ (read "$n$ C $k$," as on a calculator) or $C(n, k)$.
