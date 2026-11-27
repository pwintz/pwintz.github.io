---
published: false
title: '$\frac{1}{2}(\sin t - \cos t)$, for $\dot{x} = -x + \sin t$'
level: high-school
figure:
  widget: function-plot
  params:
    var: t
    y_var: x
    x: [-0.5, 14]
    y: [-1, 2.3]
    curves:
      - { f: "(sin(t) - cos(t))/2", label: "x_{\\mathrm{ss}}" }
      - { f: "(sin(t) - cos(t))/2 + 2.5 exp(-t)", from: 0, ends: "[ ", dash: true }
  caption: |-
    The steady state $(\sin t - \cos t)/2$ (blue) and the solution with $x(0) = 2$ (orange, dashed).
  alt: "A wave of amplitude about 0.7, and a dashed curve starting at height 2 that settles onto the wave."
is: [steady_state]
is_not: [
  equilibrium,
  operating_point
]
why:
  steady_state: >-
    $\frac{1}{2}(\sin t - \cos t)$ is the steady state because every solution approaches this oscillation.
  operating_point: >-
    $\frac{1}{2}(\sin t - \cos t)$, for $\dot{x} = -x + \sin t$, is not an operating point, because it is not constant, and the system has no equilibrium.
  equilibrium: >-
    $\frac{1}{2}(\sin t - \cos t)$, for $\dot{x} = -x + \sin t$, is not an equilibrium, because it is not constant, and the system has no equilibrium.
---
