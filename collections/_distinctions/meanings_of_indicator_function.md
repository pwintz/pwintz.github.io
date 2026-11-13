---
published: false
title: "Indicator function: 0 and 1 vs. 0 and ∞"
kind: conflicting
areas: [sets, analysis, statistics]
summary: >
  "Indicator function" and its synonym "characteristic function" each have rival meanings in different fields.
  In most of mathematics, the [indicator function](/dictionary/definitions/indicator-function) $\mathbf{1}_A$ of a set $A$ is $1$ on $A$ and $0$ elsewhere, and "characteristic function" is another name for $\mathbf{1}_A$.
  In convex analysis and optimization, the [indicator function](/dictionary/definitions/indicator-function-convex) $\delta_C$ of a set $C$ is $0$ on $C$ and $\infty$ elsewhere, so that adding $\delta_C$ to an objective imposes the constraint $x \in C$.
  In [probability](/dictionary/definitions/probability), the [characteristic function](/dictionary/definitions/characteristic-function-probability) of a [random variable](/dictionary/definitions/random-variable) $X$ is not an indicator function at all, but the function $t \mapsto \mathbb{E}[e^{i t X}]$.
terms:
  - indicator_function
  - indicator_function_convex
  - characteristic_function_probability
examples_note: >-
  Each cell is the value of the ___ for the example in that row.
examples:
  - example: interval_0_1_indicators_at_2
  - example: number_of_heads_in_one_coin_flip
see_also:
  - meanings_of_barrier_function
---
## Avoiding the ambiguity

Say "0–1 indicator function" or write $\mathbf{1}_A$ when the reader might know convex analysis, and write $\delta_C$ or $\iota_C$ for the version with $\infty$.
In [probability](/dictionary/definitions/probability), write "indicator function" for $\mathbf{1}_A$ and keep "characteristic function" for $\mathbb{E}[e^{i t X}]$.
