---
published: false
title: Indicator function
term: indicator function
applies_to: sets
synonyms: [characteristic function, '$\mathbf{1}_A$']
levels:
  high-school:
    text: |-
      Consider a set $A$ inside a larger set $X$.
      The _indicator function_ of $A$ is the function on $X$ that equals $1$ at the points of $A$ and $0$ at the other points of $X$.
  undergraduate:
    text: |-
      Consider a set $X$ and a [subset](/dictionary/definitions/subset) $A$ of $X$.
      The _indicator function_ of $A$ is the function $\mathbf{1}_A : X \to \setdef{0, 1}$ defined by

      $$\mathbf{1}_A(x) = \begin{cases} 1 & \text{if } x \in A, \\ 0 & \text{if } x \notin A. \end{cases}$$
properties:
  - >-
    For [subsets](/dictionary/definitions/subset) $A$ and $B$ of $X$, $\mathbf{1}_{A \cap B} = \mathbf{1}_A \mathbf{1}_B$ and $\mathbf{1}_{X \setminus A} = 1 - \mathbf{1}_A$.
  - >-
    The integral of the indicator function of a [measurable set](/dictionary/definitions/measurable-set) $A$ is the measure of $A$: $\int \mathbf{1}_A \, \mathrm{d}\mu = \mu(A)$.
  - >-
    For an [event](/dictionary/definitions/event) $A$, the [expected value](/dictionary/definitions/expected-value) of the [random variable](/dictionary/definitions/random-variable) $\mathbf{1}_A$ is the [probability](/dictionary/definitions/probability) of $A$: $\mathbb{E}[\mathbf{1}_A] = P(A)$.
---
In set theory and analysis, "characteristic function" is another name for the indicator function.
In [probability](/dictionary/definitions/probability) theory, the [characteristic function](/dictionary/definitions/characteristic-function-probability) of a [random variable](/dictionary/definitions/random-variable) is something else: the [expected value](/dictionary/definitions/expected-value) of $e^{i t X}$.

In convex analysis, the "[indicator function](/dictionary/definitions/indicator-function-convex)" of a set $C$ takes the values $0$ and $\infty$ instead of $1$ and $0$.
