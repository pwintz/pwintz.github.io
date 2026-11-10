---
published: false
title: Markov chain vs. Markov decision process
kind: hierarchy
areas: [statistics, control]
summary: >
  Markov chains and Markov decision processes model a system that moves at random between states, where the probabilities of the next state depend only on the current state.
  In a [Markov chain](/definitions/markov-chain), the probabilities of the next state are fixed, so the chain only describes what happens.
  In a [Markov decision process](/definitions/markov-decision-process), a decision maker chooses an action in each state, the action changes the probabilities of the next state, and each choice earns a reward, so the model asks which choices earn the most reward.
relation: Markov chain = Markov decision process with one action in each state
terms:
  - markov_chain
  - markov_decision_process
examples:
  - example: tomorrows_weather_depending_only_on_todays_weather
  - example: a_robot_choosing_moves_on_a_slippery_grid
  - example: a_robot_on_a_slippery_grid_that_always_tries_to_move_right
    why: >-
      A robot on a slippery grid that tries to move right at every step is a Markov chain, whereas the robot that chooses its moves is a Markov decision process: fixing the rule for choosing actions (a policy) turns a Markov decision process into a Markov chain.
  - example: a_shop_choosing_how_much_stock_to_order_each_week
see_also:
  - types_of_stochastic_processes
---
## Notes

- A [Markov chain](/definitions/markov-chain) with a reward in each state, but no actions, is called a _Markov reward process_.
- In a _hidden Markov model_, the states of a Markov chain are not observed directly; only random observations that depend on the states are seen.
