---
title: Real number
term: real number
applies_to: numbers
levels:
  # elementary:
  #   text: |-
  #     Think of the number line, stretching forever in both directions.
  #     The _real numbers_ are all of the numbers on the number line.
  high-school:
    text: |-
      A _real number_ is any number on the number line.
      Every real number can be written as a (possibly infinite) decimal.
  undergraduate:
    text: |-
      A _real number_ is an element of $\reals$, the unique complete ordered field.
properties:
  - |-
    Every nonnegative real number $x$ can be written as a decimal $x = n.d_1 d_2 d_3 \ldots$, where $n$ is a natural number and each digit $d_k$ is one of $0, 1, \dots, 9$, which means that

    $$x = n + \sum_{k = 1}^{\infty} \frac{d_k}{10^k}.$$

    The digits are found one at a time: $n$ is the largest whole number at most $x$, and each digit $d_k$ is the largest digit such that the decimal $n.d_1 \ldots d_k$ is at most $x$.
    The decimals $n.d_1 \ldots d_k$ then lie within $10^{-k}$ of $x$, so the decimals converge to $x$.
    A negative real number is written as the negative of a decimal.
  - >-
    A real number is [rational](/definitions/rational-number) exactly when its decimal expansion either ends or repeats, such as $\frac{1}{4} = 0.25$ and $\frac{1}{3} = 0.333\ldots$, so the decimal expansion of an [irrational number](/definitions/irrational-number), such as $\sqrt{2} = 1.41421\ldots$, neither ends nor repeats.
  - >-
    Some real numbers have two decimal expansions: a decimal that ends, such as $1.0$, equals the decimal that instead ends with repeating $9$s, such as $0.999\ldots$, because $\sum_{k = 1}^{\infty} \frac{9}{10^k} = 1$.
  - >-
    $\reals$ can be constructed from $\mathbb{Q}$ using Dedekind cuts or Cauchy [sequences](/definitions/sequence).
  - >-
    Every nonempty set of real numbers that is [bounded](/definitions/bounded) above has a [least upper bound](/definitions/supremum) (the completeness of $\reals$).
---
