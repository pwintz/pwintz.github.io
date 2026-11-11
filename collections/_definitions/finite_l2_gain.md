---
published: false
title: Finite L2 gain
term: finite $L_2$ gain
applies_to: input-output systems
levels:
  graduate:
    text: |-
      Consider an input-output system with input $u$ and output $y$.
      The system has *finite $L_2$ gain* if there are constants $\gamma, b \geq 0$ such that

      $$\norm{y}_{L_2[0, T]} \leq \gamma \norm{u}_{L_2[0, T]} + b$$

      for every input $u$ and every $T \geq 0$.
      The smallest such $\gamma$ is the $L_2$ gain.
properties:
  - >-
    For a stable linear [time-invariant](/dictionary/definitions/time-invariant) system, the $L_2$ gain is the peak of $\abs{G(i \omega)}$ over all frequencies (the $H_{\infty}$ [norm](/dictionary/definitions/norm) of its transfer function).
  - >-
    [Output strictly passive](/dictionary/definitions/output-strictly-passive) systems have finite $L_2$ gain.
---
