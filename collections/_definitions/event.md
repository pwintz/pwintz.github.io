---
title: Event (probability)
term: event
applies_to: random experiments
levels:
  high-school:
    text: |-
      Consider a random experiment, such as rolling two dice, whose [outcomes](/definitions/outcome) are pairs of values, such as $(1, 3)$.
      An _event_ is a set of outcomes, such as "the sum of the dice is $4$," which is the set $A = \setdef{(1, 3), (2, 2), (3, 1)}$.
      The event _occurs_ if the outcome of the experiment is in the set.
  undergraduate:
    context: measure-theoretic probability
    text: |-
      Consider a probability space $(\Omega, \mathcal{F}, P)$.
      An _event_ $A$ is a [subset](/definitions/subset) of the sample space $\Omega$ such that $A$ is an element of the [σ-algebra](/definitions/sigma-algebra) $\mathcal{F}$. 
      For each event, the probability measure $P$ assigns the [probability](/definitions/probability) that $A$ occurs in each experiment.
properties:
  - >-
    An [outcome](/definitions/outcome) $\omega$ and the event $\setdef{\omega}$ are different objects: an outcome is a result coming from a particular experiment, and an event is a set of results which describes which outcomes satisfy a property of interest.
  - >-
    When $\Omega$ is [uncountable](/definitions/uncountable), such as $[0, 1]$, it is impossible for every [subset](/definitions/subset) of $\Omega$ to be an event, because no [probability](/definitions/probability) can be assigned consistently to every subset.
---
