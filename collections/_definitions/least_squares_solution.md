---
published: false
title: Least Squares Solution
term: least squares solution
applies_to: linear systems
synonyms: [least-squares solution, least squares approximate solution]
levels:
  undergraduate:
    text: |-
      Consider an $m \times n$ matrix $A$ and a vector $\vect{b} \in \reals^m$.
      A _least squares solution_ of the [linear system](/dictionary/definitions/linear-system) $A \vect{x} = \vect{b}$ is a vector $\vect{x}^{\ast} \in \reals^n$ such that $A \vect{x}^{\ast}$ is as close to $\vect{b}$ as possible:

      $$\norm{\vect{b} - A \vect{x}^{\ast}} \leq \norm{\vect{b} - A \vect{x}} \quad \text{for every } \vect{x} \in \reals^n,$$

      where $\norm{\cdot}$ is the [Euclidean norm](/dictionary/definitions/euclidean-norm).
      The name comes from the square $\norm{\vect{b} - A \vect{x}}^2$, which is the sum of the squares of the entries of $\vect{b} - A \vect{x}$.
properties:
  - |-
    A vector $\vect{x}^{\ast}$ is a least squares solution of $A \vect{x} = \vect{b}$ if and only if $\vect{x}^{\ast}$ solves the _normal equation_

    $$A\trans A \vect{x}^{\ast} = A\trans \vect{b}.$$
  - >-
    Every linear system $A \vect{x} = \vect{b}$ has at least one least squares solution.
  - |-
    If $\vect{x}^{\ast}$ is a least squares solution of $A \vect{x} = \vect{b}$, then $A \vect{x}^{\ast}$ is the [orthogonal projection](/dictionary/definitions/orthogonal-projection) of $\vect{b}$ onto the [column space](/dictionary/definitions/column-space) of $A$:

    $$A \vect{x}^{\ast} = \operatorname{proj}_{\colspace{A}} \vect{b}.$$
  - >-
    If $\vect{x}^{\ast}$ is a least squares solution of $A \vect{x} = \vect{b}$, then the residual $\vect{b} - A \vect{x}^{\ast}$ is [orthogonal](/dictionary/definitions/orthogonal-vectors) to every column of $A$.
  - >-
    The least squares solution of $A \vect{x} = \vect{b}$ is unique if and only if the columns of $A$ are [linearly independent](/dictionary/definitions/linearly-independent).
  - |-
    If the columns of $A$ are [linearly independent](/dictionary/definitions/linearly-independent), then the least squares solution of $A \vect{x} = \vect{b}$ is

    $$\vect{x}^{\ast} = (A\trans A)^{-1} A\trans \vect{b}.$$
  - >-
    If the linear system $A \vect{x} = \vect{b}$ has a solution, then the least squares solutions of $A \vect{x} = \vect{b}$ are exactly its solutions.
---
### Notation and terminology

Many books write a least squares solution as $\hat{\vect{x}}$ instead of $\vect{x}^{\ast}$.
Finding a least squares solution is called the _least squares problem_:

$$\begin{aligned} \operatorname*{minimize}_{\vect{x} \in \reals^n} \quad & \norm{A \vect{x} - \vect{b}}^2. \end{aligned}$$

[Linear regression](/dictionary/definitions/linear-regression) fits a model to data by finding a least squares solution, where the columns of $A$ are the features and $\vect{b}$ holds the observed outputs.

### Tool

The [Projections and Least Squares tool](/tools/projection_least_squares/) solves least squares problems step by step, draws them in $\reals^2$ and $\reals^3$, and fits [polynomials](/dictionary/definitions/polynomial) to data.
