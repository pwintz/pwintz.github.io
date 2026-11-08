---
title: Unit vector
term: unit vector
applies_to: vectors in a normed space
levels:
  high-school:
    text: |-
      A _unit vector_ is a vector of length $1$, such as $(1, 0)$ or $\left(\frac{3}{5}, \frac{4}{5}\right)$ in the plane.
  undergraduate:
    context: normed vector spaces
    text: |-
      Consider a vector space $V$ with a [norm](/definitions/norm) $\norm{\cdot}$.
      A _unit vector_ is a vector $u \in V$ such that

      $$\norm{u} = 1.$$
properties:
  - >-
    Dividing a nonzero vector $v$ by its [norm](/definitions/norm) gives the unit vector $v / \norm{v}$ that points in the same direction as $v$; this is called _normalizing_ $v$.
  - >-
    Whether a vector is a unit vector depends on the [norm](/definitions/norm): $(1, 1)$ is a unit vector in the [max norm](/definitions/infinity-norm), because $\max(\abs{1}, \abs{1}) = 1$, but $(1, 1)$ is not a unit vector in the [Euclidean norm](/definitions/euclidean-norm), because $\sqrt{1^2 + 1^2} = \sqrt{2}$.
  - >-
    An [orthogonal](/definitions/orthogonal-vectors) list of unit vectors is called _orthonormal_.
---
