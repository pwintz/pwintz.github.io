---
title: 'Moving a cart from rest at position $0$ to rest at position $1$ in the shortest time, with an acceleration $u(t)$ between $-1$ and $1$'
level: undergraduate
detail: >-
  Minimize the final time $T$ subject to $\ddot{x} = u$, $\abs{u(t)} \leq 1$, $x(0) = 0$, $\dot{x}(0) = 0$, $x(T) = 1$, and $\dot{x}(T) = 0$.
is: [optimal_control]
is_not: [calculus_of_variations]
why:
  calculus_of_variations: >-
    Moving a cart in minimum time with acceleration between $-1$ and $1$ is not a calculus of variations problem, because the bound $\abs{\ddot{x}} \leq 1$ constrains the derivatives of the unknown function, and the optimal acceleration jumps from $1$ to $-1$, so the optimal position is not a smooth solution of an Euler–Lagrange equation.
  optimal_control: >-
    Moving a cart in minimum time with acceleration between $-1$ and $1$ is an optimal control problem with the bounded input $u$.
    The optimal input is "bang-bang": $u = 1$ until $t = 1$, then $u = -1$ until the cart stops at $T = 2$.
---
