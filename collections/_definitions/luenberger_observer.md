---
title: Luenberger observer
term: Luenberger observer
applies_to: linear systems
levels:
  high-school:
    text: |-
      A _Luenberger observer_ estimates the unmeasured quantities of a system by running a copy of the system's model alongside it and nudging the copy toward the real system whenever their measurements disagree.
  undergraduate:
    context: "continuous-time linear systems"
    text: |-
      Consider a [linear system](/definitions/linear-system) $\dot{x} = A x + B u$ with state $x$, input $u$, and measured output $y = C x$.
      A _Luenberger observer_ for this system is the dynamical system

      $$\dot{\hat{x}} = A \hat{x} + B u + L (y - C \hat{x}),$$

      where $\hat{x}$ is the state estimate and the matrix $L$ is a constant gain, called the _observer gain_.
properties:
  - >-
    The estimation error $e = x - \hat{x}$ of a Luenberger observer satisfies $\dot{e} = (A - L C) e$, so it converges to zero from every initial condition exactly when every [eigenvalue](/definitions/eigenvalue) of $A - L C$ has negative real part.
  - >-
    A gain $L$ that makes the error converge to zero exists exactly when $(A, C)$ is [detectable](/definitions/detectable).
  - >-
    If $(A, C)$ is [observable](/definitions/observable), then $L$ can be chosen to place the [eigenvalues](/definitions/eigenvalue) of $A - L C$ anywhere (in complex-conjugate pairs).
---
The discrete-time version is $\hat{x}_{k+1} = A \hat{x}_k + B u_k + L (y_k - C \hat{x}_k)$.

The [Kalman filter](/definitions/kalman-filter) has the same structure, with a time-varying gain chosen from the noise covariances.
