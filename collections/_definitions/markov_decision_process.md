---
published: false
title: Markov decision process
term: Markov decision process
applies_to: decision problems
synonyms: [MDP]
levels:
  high-school:
    text: |-
      A _Markov decision process_ is a model of decisions made in steps.
      In each step, a decision maker chooses an action, receives a reward, and moves to a random next state, whose probabilities depend only on the current state and the chosen action.
      The goal is to choose actions that earn the largest total reward on average.
  undergraduate:
    context: probability and control
    text: |-
      A _Markov decision process_ consists of

      1. a set $S$ of states,
      2. a set $A$ of actions,
      3. transition probabilities $P(s^{\prime} \mid s, a)$ of moving to the state $s^{\prime}$ after taking the action $a$ in the state $s$, and
      4. a reward $r(s, a)$ for taking the action $a$ in the state $s$.

      A _policy_ $\pi$ chooses an action $\pi(s)$ in each state $s$.
      The goal is to find a policy that maximizes the expected discounted total reward,

      $$\mathbb{E}\left[\sum_{n = 0}^{\infty} \gamma^n r(s_n, a_n)\right],$$

      where $0 \leq \gamma < 1$ is a discount factor.
properties:
  - >-
    Fixing a policy $\pi$ turns a Markov decision process into a [Markov chain](/dictionary/definitions/markov-chain) on the states $S$, with transition probabilities $P(s^{\prime} \mid s, \pi(s))$.
  - >-
    The optimal value function $V$ of a discounted Markov decision process satisfies the Bellman equation $V(s) = \max_{a} \left[ r(s, a) + \gamma \sum_{s^{\prime}} P(s^{\prime} \mid s, a) V(s^{\prime}) \right]$.
  - >-
    Reinforcement learning studies Markov decision processes whose transition probabilities and rewards are unknown and must be learned from experience.
---
Some authors use costs instead of rewards and minimize instead of maximize.
Finite-horizon and average-reward versions replace the discounted sum with a sum over $N$ steps or a long-run average.
