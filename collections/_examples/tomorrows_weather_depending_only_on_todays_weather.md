---
published: false
title: "Tomorrow's weather, sunny or rainy, with probabilities that depend only on today's weather"
level: high-school
description: >-
  After a sunny day, the next day is sunny with probability $0.8$, and after a rainy day, the next day is rainy with probability $0.6$.
is: [markov_chain]
is_not: [markov_decision_process]
why:
  markov_chain: >-
    Tomorrow's weather, with probabilities that depend only on today's weather, is a Markov chain with the two states "sunny" and "rainy," because the probabilities of the next state depend only on the current state.
  markov_decision_process: >-
    Tomorrow's weather is not a Markov decision process, because nobody chooses an action that changes the weather.
---
The transition matrix, with the states ordered (sunny, rainy), is

$$P = \begin{bmatrix} 0.8 & 0.2 \\ 0.4 & 0.6 \end{bmatrix}.$$
