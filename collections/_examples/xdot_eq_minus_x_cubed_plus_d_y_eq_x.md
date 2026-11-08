---
published: false
title: '$\dot{x} = -x^3 + d$, $y = x$'
level: graduate
is: [input_to_state_stable, bibo_stable]
is_not: [finite_l2_gain]
why:
  input_to_state_stable: >-
    $\dot{x} = -x^3 + d$, $y = x$ is input-to-state stable, and so BIBO stable, because bounded inputs give bounded states.
  finite_l2_gain: >-
    $\dot{x} = -x^3 + d$, $y = x$ does not have finite $L^2$ gain, because a small constant input $d = \varepsilon$ gives the steady state $x = \varepsilon^{1/3}$, which is much larger than $\varepsilon$, so over long times no finite gain bounds the output energy.
---
