---
published: false
title: Optimal control
term: optimal control
applies_to: control problems
levels:
  high-school:
    text: |-
      _Optimal control_ is the study of choosing the inputs to a system over time to make the behavior of the system as good as possible, measured by a cost, while the system obeys its equations of motion.
  undergraduate:
    context: control theory
    text: |-
      Consider a control system $\dot{x} = f(x, u)$ with state $x(t) \in \reals^n$, input $u(t)$ in a set $U$ of allowed inputs, and initial state $x_0$.
      _Optimal control_ is the study of problems of the form

      $$\begin{aligned}
      \text{minimize} \quad & \varphi\bigl(x(T)\bigr) + \int_0^T \ell\bigl(x(t), u(t)\bigr) \, \mathrm{d}t \\
      \text{subject to} \quad & \dot{x}(t) = f\bigl(x(t), u(t)\bigr), \quad x(0) = x_0, \quad u(t) \in U \text{ for all } t,
      \end{aligned}$$

      where the unknown is the input $u$ as a function of time.
properties:
  - >-
    Pontryagin's maximum principle gives necessary conditions for an input to be optimal, in terms of a [Hamiltonian](/definitions/hamiltonian) $H(x, u, \lambda) = \ell(x, u) + \lambda^\top f(x, u)$ and a costate $\lambda$.
  - >-
    The optimal cost, as a function of the initial state and time, satisfies the Hamilton–Jacobi–Bellman partial differential equation.
  - >-
    Every problem in the [calculus of variations](/definitions/calculus-of-variations) is an optimal control problem with the dynamics $\dot{x} = u$ and $U = \reals^n$.
---
