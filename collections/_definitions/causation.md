---
published: false
title: Causation
term: causation
applies_to: variables in a system
synonyms: [causality, causal effect, causes]
levels:
  high-school:
    text: |-
      Consider two quantities in a system, such as the dose of a medicine and a patient's blood pressure.
      The first quantity _causes_ a change in the second quantity if changing the first quantity, while everything else is held fixed, changes the second quantity.
  undergraduate:
    context: causal inference
    text: |-
      Consider random variables $X$ and $Y$ in a system.
      The variable $X$ has a _causal effect_ on $Y$ if intervening in the system to set $X$ to a value $x$, written $\operatorname{do}(X = x)$, changes the distribution of $Y$ for some values of $x$:

      $$P(Y \in B \mid \operatorname{do}(X = x)) \neq P(Y \in B \mid \operatorname{do}(X = x')) \quad \text{for some } x, x', B.$$
properties:
  - >-
    Intervening is different from observing: $P(Y \mid \operatorname{do}(X = x))$ describes what happens if $X$ is _set_ to $x$, and the conditional probability $P(Y \mid X = x)$ describes what happens among the cases in which $X$ _happens to equal_ $x$.
  - >-
    A [correlation](/dictionary/definitions/correlation) between $X$ and $Y$ can come from $X$ causing $Y$, from $Y$ causing $X$, from a common cause of both (a _confounder_), or from chance.
    A randomized experiment sets $X$ by a coin flip, which removes the confounders, so a correlation in a randomized experiment indicates causation.
---
