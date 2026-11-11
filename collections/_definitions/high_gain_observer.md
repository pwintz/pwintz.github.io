---
published: false
title: High-gain observer
term: high-gain observer
applies_to: nonlinear systems
levels:
  graduate:
    context: "nonlinear systems whose output is the first of a chain of integrators"
    text: |-
      Consider a nonlinear system with state $x = (x_1, \dots, x_n)$, input $u$, and measured output $y = x_1$, given by

      $$\dot{x}_1 = x_2, \quad \dots, \quad \dot{x}_{n-1} = x_n, \quad \dot{x}_n = \phi(x, u).$$

      A _high-gain observer_ for this system is the [observer](/dictionary/definitions/observer)

      $$\dot{\hat{x}}_i = \hat{x}_{i+1} + \frac{\alpha_i}{\varepsilon^i} (y - \hat{x}_1) \quad (i < n), \qquad \dot{\hat{x}}_n = \phi_0(\hat{x}, u) + \frac{\alpha_n}{\varepsilon^n} (y - \hat{x}_1),$$

      where $\phi_0$ is a model of $\phi$, the constants $\alpha_i$ are chosen so that every root of $s^n + \alpha_1 s^{n-1} + \dots + \alpha_n$ has negative real part, and $\varepsilon > 0$ is a small parameter.
properties:
  - >-
    As $\varepsilon \to 0$, the estimation error of a high-gain observer decays faster and, without [measurement noise](/dictionary/definitions/measurement-noise), becomes arbitrarily small after a short transient, even if the model $\phi_0$ is inexact.
  - >-
    A high-gain observer can _peak_: its estimates can be of order $1 / \varepsilon^{n-1}$ during the initial transient, so they are usually saturated before being fed to a controller.
  - >-
    A smaller $\varepsilon$ amplifies [measurement noise](/dictionary/definitions/measurement-noise) more, so the choice of $\varepsilon$ trades speed against noise sensitivity.
---
High-gain observers are often combined with [state feedback](/dictionary/definitions/state-feedback) to recover the performance of the state-feedback controller by [output feedback](/dictionary/definitions/output-feedback).
