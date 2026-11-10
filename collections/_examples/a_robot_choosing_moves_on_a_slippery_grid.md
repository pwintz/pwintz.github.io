---
published: false
title: 'A robot on a slippery grid, choosing a direction to move at each step, and earning a reward for reaching a goal square'
level: high-school
description: >-
  When the robot tries to move in a direction, the robot moves in that direction with probability $0.8$ and slips to a neighboring direction with probability $0.2$.
is: [markov_decision_process]
is_not: [markov_chain]
why:
  markov_decision_process: >-
    A robot choosing moves on a slippery grid is a Markov decision process, because the robot chooses an action in each state, the action and the current square set the probabilities of the next square, and the robot earns a reward.
  markov_chain: >-
    A robot choosing moves on a slippery grid is not a Markov chain, because the probabilities of the next square depend on the move that the robot chooses, not only on the current square.
---
