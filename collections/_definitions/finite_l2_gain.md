---
published: false
title: Finite L2 gain
term: finite $L_2$ gain
applies_to: input-output systems
levels:
  graduate:
    text: |-
      A system has *finite $L_2$ gain* if there are constants $\gamma, b \geq 0$ such that

      $$\lVert y \rVert_{L_2[0, T]} \leq \gamma \lVert u \rVert_{L_2[0, T]} + b$$

      for every input $u$ and every $T \geq 0$. The smallest such $\gamma$ is the $L_2$ gain.
properties:
  - >-
    For a stable linear [time-invariant](/definitions/time-invariant) system, the $L_2$ gain is the peak of $\lvert G(i \omega) \rvert$ over all frequencies (the $H_{\infty}$ [norm](/definitions/norm) of its transfer function).
  - >-
    [Output strictly passive](/definitions/output-strictly-passive) systems have finite $L_2$ gain.
---
