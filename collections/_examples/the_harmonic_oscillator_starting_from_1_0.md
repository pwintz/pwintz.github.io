---
published: false
title: 'The harmonic oscillator $\dot{x} = y$, $\dot{y} = -x$, starting from $(1, 0)$'
level: undergraduate
values:
  trajectory: '$(x(t), y(t)) = (\cos t, -\sin t)$'
  path: '$\gamma(s) = (\cos 2 \pi s, -\sin 2 \pi s)$, for $s \in [0, 1]$'
  orbit: '$\mathcal{O}(1, 0) = \setdef{(x, y) : x^2 + y^2 = 1}$'
  flow: '$\varphi(t, (x_0, y_0)) = (x_0 \cos t + y_0 \sin t, \, -x_0 \sin t + y_0 \cos t)$'
why:
  trajectory: >-
    The trajectory of the harmonic oscillator from $(1, 0)$ is $(\cos t, -\sin t)$, because $\frac{\mathrm{d}}{\mathrm{d}t} \cos t = -\sin t = y$ and $\frac{\mathrm{d}}{\mathrm{d}t}(-\sin t) = -\cos t = -x$, and the function starts at $(1, 0)$.
  path: >-
    The path $\gamma(s) = (\cos 2 \pi s, -\sin 2 \pi s)$ follows the trajectory of the harmonic oscillator from $(1, 0)$ for one period, $2 \pi$, with the time $t = 2 \pi s$ rescaled to the parameter $s \in [0, 1]$.
  orbit: >-
    The orbit of $(1, 0)$ for the harmonic oscillator is the unit circle, because the trajectory $(\cos t, -\sin t)$ passes through every point of the unit circle and through no other point.
  flow: >-
    The flow of the harmonic oscillator rotates each initial state $(x_0, y_0)$ clockwise by the angle $t$, because $(x_0 \cos t + y_0 \sin t, -x_0 \sin t + y_0 \cos t)$ solves $\dot{x} = y$, $\dot{y} = -x$ and equals $(x_0, y_0)$ at $t = 0$.
---
