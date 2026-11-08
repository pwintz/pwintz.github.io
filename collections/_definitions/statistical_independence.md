---
title: Statistical independence
term: statistical independence
applies_to: events and random variables
synonyms: [independent, independence, independent random variables, independent events]
levels:
  high-school:
    text: |-
      Consider two [events](/definitions/event), such as "the first coin lands heads" and "the second coin lands heads."
      The events are _independent_ if the [probability](/definitions/probability) of each event is the same whether or not the other event occurs.
  undergraduate:
    context: events
    text: |-
      Consider a probability space $(\Omega, \mathcal{F}, P)$.
      Two [events](/definitions/event) $A$ and $B$ are _independent_ if

      $$P(A \cap B) = P(A) \, P(B).$$

  graduate:
    context: random variables
    text: |-
      Two [random variables](/definitions/random-variable) $X$ and $Y$ are _independent_ if the events $\setdef{X \in A}$ and $\setdef{Y \in B}$ are independent for every pair of Borel sets $A$ and $B$.

properties:
  - >-
    If $P(B) > 0$, then $A$ and $B$ are independent exactly when $P(A \mid B) = P(A)$.
  - >-
    If $X$ and $Y$ are independent and have finite variances, then $X$ and $Y$ are uncorrelated, but uncorrelated random variables can be dependent: if $X$ is uniform on $[-1, 1]$ and $Y = X^2$, then $\operatorname{Cov}(X, Y) = 0$.
  - >-
    If $X$ and $Y$ are jointly [normal](/definitions/normal-distribution), then $X$ and $Y$ are independent exactly when $X$ and $Y$ are uncorrelated.
  - >-
    Statistical independence of random variables is different from [linear independence](/definitions/linearly-independent) of vectors.
---
