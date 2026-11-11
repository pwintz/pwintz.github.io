---
published: false
title: Markov chain
term: Markov chain
applies_to: random processes
levels:
  high-school:
    text: |-
      A _Markov chain_ is a [random process](/dictionary/definitions/stochastic-process) that moves between states in steps, such that the [probability](/dictionary/definitions/probability) of each next state depends only on the current state, and not on the states before the current state.
  undergraduate:
    context: probability
    text: |-
      A _Markov chain_ is a sequence $X_0, X_1, X_2, \dots$ of [random variables](/dictionary/definitions/random-variable) with values in a [countable](/dictionary/definitions/countable) set $S$ of states such that, for every time $n$ and all states $x_0, \dots, x_{n+1}$ in $S$,

      $$P(X_{n+1} = x_{n+1} \mid X_n = x_n, \dots, X_0 = x_0) = P(X_{n+1} = x_{n+1} \mid X_n = x_n).$$

      This condition is called the _Markov property_.
properties:
  - >-
    A Markov chain with finitely many states and transition probabilities that do not depend on the time $n$ is described by a transition matrix $P$, whose entry $P_{ij}$ is the [probability](/dictionary/definitions/probability) of moving from state $i$ to state $j$ in one step.
  - >-
    Each row of a transition matrix adds up to $1$.
  - >-
    The probabilities of being in each state after $n$ steps are the entries of $\pi_0 P^n$, where $\pi_0$ is the row vector of initial probabilities.
---
Some authors use "Markov chain" only for discrete time, and "Markov process" for continuous time or for uncountably many states.
