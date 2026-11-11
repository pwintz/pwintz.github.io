---
published: false
title: Random walk
term: random walk
applies_to: random processes
levels:
  high-school:
    text: |-
      A _random walk_ is a process that starts at $0$ and, at each step, adds a random step, where the steps are independent of each other and all have the same distribution.
      In the _simple random walk_, each step is $+1$ or $-1$, each with [probability](/dictionary/definitions/probability) $\frac{1}{2}$.
  undergraduate:
    context: probability
    text: |-
      Consider independent, identically distributed [random variables](/dictionary/definitions/random-variable) $\xi_1, \xi_2, \dots$, called the steps.
      The _random walk_ with these steps is the sequence of partial sums $S_0 = 0$ and

      $$S_n = \xi_1 + \xi_2 + \dots + \xi_n.$$
properties:
  - >-
    A random walk is a [Markov chain](/dictionary/definitions/markov-chain).
  - >-
    The simple random walk on the [integers](/dictionary/definitions/integer) returns to $0$ with [probability](/dictionary/definitions/probability) $1$.
  - >-
    A random walk with steps of mean $0$ and [variance](/dictionary/definitions/variance) $1$, scaled by $S_{\lfloor n t \rfloor} / \sqrt{n}$, converges in distribution to a [Brownian motion](/dictionary/definitions/brownian-motion) as $n \to \infty$ (Donsker's theorem).
---
