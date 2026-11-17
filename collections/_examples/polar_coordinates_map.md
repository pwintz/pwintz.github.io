---
published: false
title: 'Polar coordinates, $f(r, \theta) = (r \cos \theta, r \sin \theta)$'
level: undergraduate
values:
  jacobian: 'The matrix $$Df(r, \theta) = \begin{bmatrix} \cos \theta & -r \sin \theta \\ \sin \theta & r \cos \theta \end{bmatrix}$$'
  jacobian_determinant: '$\det Df(r, \theta) = r \cos^2 \theta + r \sin^2 \theta = r$'
why:
  jacobian_determinant: >-
    The Jacobian determinant of polar coordinates is $r \cos^2 \theta + r \sin^2 \theta = r$.
    This is why $\dx ~ \dy = r ~ \diff{r} ~ \diff{\theta}$ in integrals.
  jacobian: >-
    The Jacobian matrix of $f$ has the partial derivatives of $r \cos \theta$ and $r \sin \theta$ as its rows.
    Its determinant is $r$, which is why $\dx \dy = r \diff{r} \diff{\theta}$ in the change-of-variables formula, where "the Jacobian" means the determinant.
---
